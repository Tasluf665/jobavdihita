const Contract = require('../models/contract.model');

const getOverviewStats = async (district = 'Munshiganj') => {
    const match = district ? { district } : {};

    const [stats] = await Contract.aggregate([
        { $match: match },
        {
            $group: {
                _id: null,
                total_contracts: { $sum: 1 },
                total_contract_value: { $sum: '$contract_value' },
                completed_count: {
                    $sum: { $cond: [{ $eq: ['$computed_status', 'completed'] }, 1, 0] },
                },
                overdue_count: {
                    $sum: { $cond: [{ $eq: ['$computed_status', 'overdue'] }, 1, 0] },
                },
                ghost_count: {
                    $sum: { $cond: [{ $eq: ['$computed_status', 'ghost'] }, 1, 0] },
                },
                total_unverified_payments: {
                    $sum: {
                        $cond: [
                            { $gt: ['$work_status.payment_gap_pct', 20] },
                            '$contract_value',
                            0,
                        ],
                    },
                },
                last_synced_at: { $max: '$last_synced_at' },
            },
        },
    ]);

    const safe =
        stats ||
        {
            total_contracts: 0,
            total_contract_value: 0,
            completed_count: 0,
            overdue_count: 0,
            ghost_count: 0,
            total_unverified_payments: 0,
            last_synced_at: null,
        };

    return {
        ...safe,
        completed_pct: safe.total_contracts
            ? (safe.completed_count / safe.total_contracts) * 100
            : 0,
        overdue_pct: safe.total_contracts
            ? (safe.overdue_count / safe.total_contracts) * 100
            : 0,
    };
};

const getOverviewAlerts = async ({ limit = 10, severity }) => {
    const contracts = await Contract.find(
        severity
            ? { red_flags: { $elemMatch: { severity } } }
            : { 'red_flags.0': { $exists: true } }
    )
        .select('tender_id red_flags contractor_id')
        .populate('contractor_id', 'company_name')
        .sort({ updatedAt: -1 })
        .limit(Number(limit))
        .lean();

    return contracts.flatMap((contract) =>
        contract.red_flags
            .filter((flag) => (severity ? flag.severity === severity : true))
            .map((flag) => ({
                flag_type: flag.flag_type,
                title: flag.title,
                tender_id: contract.tender_id,
                contractor_name: contract.contractor_id?.company_name || null,
                severity: flag.severity,
            }))
    );
};

const getStatusBreakdown = async (district = 'Munshiganj') => {
    const match = district ? { district } : {};
    const total = await Contract.countDocuments(match);

    const rows = await Contract.aggregate([
        { $match: match },
        { $group: { _id: '$computed_status', count: { $sum: 1 } } },
    ]);

    return rows.map((row) => ({
        status: row._id,
        count: row.count,
        percentage: total ? (row.count / total) * 100 : 0,
    }));
};

const getRecentActivity = async (limit = 5) =>
    Contract.find({ last_synced_at: { $ne: null } })
        .select('tender_id description computed_status last_synced_at work_status')
        .sort({ last_synced_at: -1 })
        .limit(Number(limit))
        .lean();

module.exports = {
    getOverviewStats,
    getOverviewAlerts,
    getStatusBreakdown,
    getRecentActivity,
};
