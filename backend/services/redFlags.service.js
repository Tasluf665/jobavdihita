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
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    tender_id: 1,
                    description: 1,
                    district: 1,
                    contract_value: 1,
                    days_overdue: 1,
                    red_flags: 1,
                    red_flags_count: 1,
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

module.exports = {
    listRedFlags,
    getRedFlagSummary,
    getCriticalRedFlags,
};
