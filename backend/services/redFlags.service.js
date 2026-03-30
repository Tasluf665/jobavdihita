const Contract = require('../models/contract.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

const listRedFlags = async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const filter = { 'red_flags.0': { $exists: true } };

    if (query.district) {
        filter.district = query.district;
    }

    if (query.flag_type || query.severity) {
        filter.red_flags = {
            $elemMatch: {
                ...(query.flag_type ? { flag_type: query.flag_type } : {}),
                ...(query.severity ? { severity: query.severity } : {}),
            },
        };
    }

    const sortByMap = {
        flag_count: { 'red_flags_count': -1 },
        contract_value: { contract_value: -1 },
        days_overdue: { days_overdue: -1 },
    };

    const sort = sortByMap[query.sort_by] || { updatedAt: -1 };
    const [items, total] = await Promise.all([
        Contract.aggregate([
            { $match: filter },
            { $addFields: { red_flags_count: { $size: '$red_flags' } } },
            {
                $lookup: {
                    from: 'contractors',
                    localField: 'contractor_id',
                    foreignField: '_id',
                    as: 'contractor_data',
                },
            },
            {
                $addFields: {
                    contractor_name: { $ifNull: [{ $first: '$contractor_data.company_name' }, null] },
                },
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    tender_id: 1,
                    description: 1,
                    district: 1,
                    procuring_entity: 1,
                    contract_value: 1,
                    days_overdue: 1,
                    notification_date: 1,
                    contract_end_date: 1,
                    work_status: 1,
                    computed_status: 1,
                    red_flags: 1,
                    red_flags_count: 1,
                    contractor_name: 1,
                    contractor_id: 1,
                    official_id: 1,
                },
            },
        ]),
        Contract.countDocuments(filter),
    ]);

    return {
        items,
        pagination: buildPaginationMeta({ total, page, limit }),
    };
};

const getRedFlagSummary = async () => {
    const rows = await Contract.aggregate([
        { $unwind: '$red_flags' },
        { $group: { _id: '$red_flags.flag_type', count: { $sum: 1 } } },
    ]);

    return rows.reduce((acc, row) => {
        acc[row._id] = row.count;
        return acc;
    }, {});
};

const getCriticalRedFlags = async (limit = 10) => {
    const contracts = await Contract.find({ red_flags: { $elemMatch: { severity: 'critical' } } })
        .select('tender_id description red_flags contractor_id')
        .populate('contractor_id', 'company_name')
        .sort({ updatedAt: -1 })
        .limit(Number(limit))
        .lean();

    return contracts.flatMap((contract) =>
        contract.red_flags
            .filter((flag) => flag.severity === 'critical')
            .map((flag) => ({
                tender_id: contract.tender_id,
                description: contract.description,
                flag_type: flag.flag_type,
                flag_title: flag.title,
                contractor_name: contract.contractor_id?.company_name || null,
            }))
    );
};

const getRepeatWinners = async (query = {}) => {
    const limit = Math.max(1, Number(query.limit || 5));
    const minWins = Math.max(2, Number(query.min_wins || 2));

    const match = {
        contractor_id: { $ne: null },
    };

    if (query.district) {
        match.district = query.district;
    }

    return Contract.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'contractors',
                localField: 'contractor_id',
                foreignField: '_id',
                as: 'contractor_data',
            },
        },
        {
            $addFields: {
                contractor_name: {
                    $ifNull: [{ $first: '$contractor_data.company_name' }, '$procuring_entity'],
                },
                has_repeat_winner_flag: {
                    $gt: [
                        {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ['$red_flags', []] },
                                    as: 'flag',
                                    cond: { $eq: ['$$flag.flag_type', 'repeat_winner'] },
                                },
                            },
                        },
                        0,
                    ],
                },
                has_any_red_flag: {
                    $gt: [{ $size: { $ifNull: ['$red_flags', []] } }, 0],
                },
            },
        },
        {
            $group: {
                _id: '$contractor_id',
                contractor_name: { $first: '$contractor_name' },
                tenders_won: { $sum: 1 },
                total_value: { $sum: { $ifNull: ['$contract_value', 0] } },
                verified_count: {
                    $sum: {
                        $cond: [{ $gt: [{ $ifNull: ['$work_status.physical_progress_pct', 0] }, 0] }, 1, 0],
                    },
                },
                repeat_winner_flags: {
                    $sum: {
                        $cond: ['$has_repeat_winner_flag', 1, 0],
                    },
                },
                flagged_contracts: {
                    $sum: {
                        $cond: ['$has_any_red_flag', 1, 0],
                    },
                },
            },
        },
        { $match: { tenders_won: { $gte: minWins } } },
        {
            $project: {
                _id: 0,
                contractor_id: '$_id',
                contractor_name: 1,
                tenders_won: 1,
                total_value: 1,
                verified_count: 1,
                completion_rate_pct: {
                    $round: [
                        {
                            $multiply: [
                                {
                                    $cond: [{ $gt: ['$tenders_won', 0] }, { $divide: ['$verified_count', '$tenders_won'] }, 0],
                                },
                                100,
                            ],
                        },
                        0,
                    ],
                },
                repeat_winner_flags: 1,
                flagged_contracts: 1,
            },
        },
        { $sort: { repeat_winner_flags: -1, tenders_won: -1, total_value: -1 } },
        { $limit: limit },
    ]);
};

module.exports = {
    listRedFlags,
    getRedFlagSummary,
    getCriticalRedFlags,
    getRepeatWinners,
};
