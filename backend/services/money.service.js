const Contract = require('../models/contract.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

const districtMatch = (district) => (district ? { district } : {});

const getMoneySummary = async (district) => {
    const [data] = await Contract.aggregate([
        { $match: districtMatch(district) },
        {
            $group: {
                _id: null,
                total_allocated: { $sum: '$contract_value' },
                total_delivered: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'completed'] }, '$contract_value', 0],
                    },
                },
                total_ongoing: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'ongoing'] }, '$contract_value', 0],
                    },
                },
                total_unverified: {
                    $sum: {
                        $cond: [{ $gt: ['$work_status.payment_gap_pct', 20] }, '$contract_value', 0],
                    },
                },
            },
        },
    ]);

    const result = data || {
        total_allocated: 0,
        total_delivered: 0,
        total_ongoing: 0,
        total_unverified: 0,
    };

    const denominator = result.total_allocated || 1;
    return {
        ...result,
        delivered_pct: (result.total_delivered / denominator) * 100,
        ongoing_pct: (result.total_ongoing / denominator) * 100,
        unverified_pct: (result.total_unverified / denominator) * 100,
    };
};

const getByFundingSource = async (district) =>
    Contract.aggregate([
        { $match: districtMatch(district) },
        {
            $group: {
                _id: '$funding_source',
                total_contracts: { $sum: 1 },
                total_allocated: { $sum: '$contract_value' },
                completed_count: {
                    $sum: { $cond: [{ $eq: ['$computed_status', 'completed'] }, 1, 0] },
                },
                overdue_count: {
                    $sum: { $cond: [{ $eq: ['$computed_status', 'overdue'] }, 1, 0] },
                },
                total_unverified_payments: {
                    $sum: {
                        $cond: [{ $gt: ['$work_status.payment_gap_pct', 20] }, '$contract_value', 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                funding_source: '$_id',
                total_contracts: 1,
                total_allocated: 1,
                completed_count: 1,
                overdue_count: 1,
                total_unverified_payments: 1,
                delivery_rate_pct: {
                    $cond: [
                        { $eq: ['$total_contracts', 0] },
                        0,
                        { $multiply: [{ $divide: ['$completed_count', '$total_contracts'] }, 100] },
                    ],
                },
            },
        },
        { $sort: { total_allocated: -1 } },
    ]);

const getYearlySpending = async (district, fromYear, toYear) => {
    const start = new Date(`${fromYear}-01-01T00:00:00.000Z`);
    const end = new Date(`${toYear + 1}-01-01T00:00:00.000Z`);

    return Contract.aggregate([
        {
            $match: {
                ...districtMatch(district),
                notification_date: { $gte: start, $lt: end },
            },
        },
        {
            $group: {
                _id: { $year: '$notification_date' },
                total_allocated: { $sum: '$contract_value' },
                delivered_amount: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'completed'] }, '$contract_value', 0],
                    },
                },
                ongoing_amount: {
                    $sum: {
                        $cond: [{ $eq: ['$computed_status', 'ongoing'] }, '$contract_value', 0],
                    },
                },
                unverified_amount: {
                    $sum: {
                        $cond: [{ $gt: ['$work_status.payment_gap_pct', 20] }, '$contract_value', 0],
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
    ]);
};

const getBudgetVsActual = async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};

    if (query.flag === 'zero_variance') {
        filter.budget_variance_pct = 0;
    } else if (query.flag === 'over_budget') {
        filter.budget_variance_pct = { $gt: 0 };
    } else if (query.flag === 'competitive') {
        filter.budget_variance_pct = { $lt: 0 };
    }

    const sortBy = query.sort_by || 'budget_variance_pct';
    const sortOrder = query.sort_order === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
        Contract.find(filter)
            .select('tender_id description estimated_budget contract_value budget_variance_pct')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean(),
        Contract.countDocuments(filter),
    ]);

    return {
        items: items.map((item) => ({
            ...item,
            zero_variance_flag: item.budget_variance_pct === 0,
        })),
        pagination: buildPaginationMeta({ total, page, limit }),
    };
};

const getWorldBankStats = async (district) => {
    const baseFilter = {
        ...districtMatch(district),
        funding_source: { $regex: 'world bank|uiip', $options: 'i' },
    };

    const [summary] = await Contract.aggregate([
        { $match: baseFilter },
        {
            $group: {
                _id: null,
                total_wb_contracts: { $sum: 1 },
                total_wb_allocated: { $sum: '$contract_value' },
                total_wb_unverified: {
                    $sum: {
                        $cond: [{ $gt: ['$work_status.payment_gap_pct', 20] }, '$contract_value', 0],
                    },
                },
                completed_count: {
                    $sum: { $cond: [{ $eq: ['$computed_status', 'completed'] }, 1, 0] },
                },
            },
        },
    ]);

    const contracts = await Contract.find(baseFilter)
        .select('tender_id description contract_value computed_status')
        .sort({ contract_value: -1 })
        .lean();

    const safe = summary || {
        total_wb_contracts: 0,
        total_wb_allocated: 0,
        total_wb_unverified: 0,
        completed_count: 0,
    };

    return {
        ...safe,
        delivery_rate_pct: safe.total_wb_contracts
            ? (safe.completed_count / safe.total_wb_contracts) * 100
            : 0,
        contracts,
    };
};

module.exports = {
    getMoneySummary,
    getByFundingSource,
    getYearlySpending,
    getBudgetVsActual,
    getWorldBankStats,
};
