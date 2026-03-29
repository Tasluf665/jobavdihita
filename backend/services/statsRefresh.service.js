const Contractor = require('../models/contractor.model');
const Official = require('../models/official.model');
const Contract = require('../models/contract.model');

const computeContractorRiskLevel = ({ totalContracts, overdueCount, totalRedFlags }) => {
    const safeTotal = totalContracts || 0;
    const overdueRate = safeTotal > 0 ? overdueCount / safeTotal : 0;

    if (overdueRate >= 0.3 || totalRedFlags >= 10) {
        return 'high';
    }
    if (overdueRate >= 0.1 || totalRedFlags >= 3) {
        return 'medium';
    }
    return 'low';
};

const computeOfficialAccountabilityLevel = ({
    totalApprovals,
    overdueCount,
    impossibleTimelineCount,
}) => {
    const safeTotal = totalApprovals || 0;
    const overdueRate = safeTotal > 0 ? overdueCount / safeTotal : 0;

    if (overdueRate >= 0.3 || impossibleTimelineCount >= 10) {
        return 'high';
    }
    if (overdueRate >= 0.1 || impossibleTimelineCount >= 3) {
        return 'moderate';
    }
    return 'low';
};

const refreshContractorStats = async ({ district = null } = {}) => {
    const contractMatch = {
        contractor_id: { $ne: null },
        ...(district ? { district } : {}),
    };

    const baseContractorFilter = district ? { district } : {};

    await Contractor.updateMany(baseContractorFilter, {
        $set: {
            stats: {
                total_contracts: 0,
                total_contract_value: 0,
                completed_count: 0,
                overdue_count: 0,
                ongoing_count: 0,
                completion_rate_pct: 0,
                avg_delay_days: 0,
                total_unverified_payments: 0,
            },
            total_red_flags: 0,
            risk_level: 'low',
            updated_at: new Date(),
        },
    });

    const rows = await Contract.aggregate([
        { $match: contractMatch },
        {
            $addFields: {
                red_flag_count: { $size: { $ifNull: ['$red_flags', []] } },
                has_payment_gap: {
                    $gt: [{ $ifNull: ['$work_status.payment_gap_pct', 0] }, 20],
                },
                overdue_like: {
                    $in: ['$computed_status', ['overdue', 'ghost']],
                },
            },
        },
        {
            $group: {
                _id: '$contractor_id',
                total_contracts: { $sum: 1 },
                total_contract_value: { $sum: { $ifNull: ['$contract_value', 0] } },
                completed_count: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'completed'] }, 1, 0],
                    },
                },
                overdue_count: {
                    $sum: { $cond: ['$overdue_like', 1, 0] },
                },
                ongoing_count: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'ongoing'] }, 1, 0],
                    },
                },
                total_delay_days: {
                    $sum: { $max: [{ $ifNull: ['$days_overdue', 0] }, 0] },
                },
                delayed_contracts: {
                    $sum: {
                        $cond: [{ $gt: [{ $ifNull: ['$days_overdue', 0] }, 0] }, 1, 0],
                    },
                },
                total_unverified_payments: {
                    $sum: {
                        $cond: [
                            '$has_payment_gap',
                            { $ifNull: ['$contract_value', 0] },
                            0,
                        ],
                    },
                },
                total_red_flags: { $sum: '$red_flag_count' },
                last_active_date: { $max: '$last_synced_at' },
            },
        },
    ]);

    if (!rows.length) {
        return { updatedCount: 0 };
    }

    const operations = rows.map((row) => {
        const total = Number(row.total_contracts) || 0;
        const completed = Number(row.completed_count) || 0;
        const delayedContracts = Number(row.delayed_contracts) || 0;
        const avgDelayDays =
            delayedContracts > 0
                ? (Number(row.total_delay_days) || 0) / delayedContracts
                : 0;
        const completionRatePct = total > 0 ? (completed / total) * 100 : 0;
        const totalRedFlags = Number(row.total_red_flags) || 0;
        const overdueCount = Number(row.overdue_count) || 0;

        return {
            updateOne: {
                filter: { _id: row._id },
                update: {
                    $set: {
                        stats: {
                            total_contracts: total,
                            total_contract_value: Number(row.total_contract_value) || 0,
                            completed_count: completed,
                            overdue_count: overdueCount,
                            ongoing_count: Number(row.ongoing_count) || 0,
                            completion_rate_pct: completionRatePct,
                            avg_delay_days: avgDelayDays,
                            total_unverified_payments:
                                Number(row.total_unverified_payments) || 0,
                        },
                        total_red_flags: totalRedFlags,
                        risk_level: computeContractorRiskLevel({
                            totalContracts: total,
                            overdueCount,
                            totalRedFlags,
                        }),
                        ...(row.last_active_date
                            ? { last_active_date: row.last_active_date }
                            : {}),
                        updated_at: new Date(),
                    },
                },
            },
        };
    });

    const result = await Contractor.bulkWrite(operations, { ordered: false });
    return { updatedCount: result.modifiedCount || 0 };
};

const refreshOfficialStats = async ({ district = null } = {}) => {
    const contractMatch = {
        official_id: { $ne: null },
        ...(district ? { district } : {}),
    };

    const baseOfficialFilter = district ? { district } : {};

    await Official.updateMany(baseOfficialFilter, {
        $set: {
            stats: {
                total_approvals: 0,
                total_value_approved: 0,
                completed_count: 0,
                overdue_count: 0,
                ongoing_count: 0,
                completion_rate_pct: 0,
                impossible_timeline_count: 0,
                total_unverified_payments: 0,
            },
            accountability_level: 'low',
            updated_at: new Date(),
        },
    });

    const rows = await Contract.aggregate([
        { $match: contractMatch },
        {
            $addFields: {
                has_payment_gap: {
                    $gt: [{ $ifNull: ['$work_status.payment_gap_pct', 0] }, 20],
                },
                red_flags_safe: { $ifNull: ['$red_flags', []] },
                overdue_like: {
                    $in: ['$computed_status', ['overdue', 'ghost']],
                },
            },
        },
        {
            $addFields: {
                impossible_timeline_flag_count: {
                    $size: {
                        $filter: {
                            input: '$red_flags_safe',
                            as: 'f',
                            cond: { $eq: ['$$f.flag_type', 'impossible_timeline'] },
                        },
                    },
                },
            },
        },
        {
            $group: {
                _id: '$official_id',
                total_approvals: { $sum: 1 },
                total_value_approved: { $sum: { $ifNull: ['$contract_value', 0] } },
                completed_count: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'completed'] }, 1, 0],
                    },
                },
                overdue_count: { $sum: { $cond: ['$overdue_like', 1, 0] } },
                ongoing_count: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'ongoing'] }, 1, 0],
                    },
                },
                impossible_timeline_count: {
                    $sum: '$impossible_timeline_flag_count',
                },
                total_unverified_payments: {
                    $sum: {
                        $cond: [
                            '$has_payment_gap',
                            { $ifNull: ['$contract_value', 0] },
                            0,
                        ],
                    },
                },
            },
        },
    ]);

    if (!rows.length) {
        return { updatedCount: 0 };
    }

    const operations = rows.map((row) => {
        const total = Number(row.total_approvals) || 0;
        const completed = Number(row.completed_count) || 0;
        const overdueCount = Number(row.overdue_count) || 0;
        const impossibleTimelineCount = Number(row.impossible_timeline_count) || 0;

        return {
            updateOne: {
                filter: { _id: row._id },
                update: {
                    $set: {
                        stats: {
                            total_approvals: total,
                            total_value_approved: Number(row.total_value_approved) || 0,
                            completed_count: completed,
                            overdue_count: overdueCount,
                            ongoing_count: Number(row.ongoing_count) || 0,
                            completion_rate_pct: total > 0 ? (completed / total) * 100 : 0,
                            impossible_timeline_count: impossibleTimelineCount,
                            total_unverified_payments:
                                Number(row.total_unverified_payments) || 0,
                        },
                        accountability_level: computeOfficialAccountabilityLevel({
                            totalApprovals: total,
                            overdueCount,
                            impossibleTimelineCount,
                        }),
                        updated_at: new Date(),
                    },
                },
            },
        };
    });

    const result = await Official.bulkWrite(operations, { ordered: false });
    return { updatedCount: result.modifiedCount || 0 };
};

const refreshEntityStats = async ({ district = null } = {}) => {
    const [contractorResult, officialResult] = await Promise.all([
        refreshContractorStats({ district }),
        refreshOfficialStats({ district }),
    ]);

    return {
        contractorsUpdated: contractorResult.updatedCount,
        officialsUpdated: officialResult.updatedCount,
    };
};

module.exports = {
    refreshContractorStats,
    refreshOfficialStats,
    refreshEntityStats,
};
