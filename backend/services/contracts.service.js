const Contract = require('../models/contract.model');
const StatusHistory = require('../models/statusHistory.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const { toCsv } = require('../utils/csvExporter');

const buildContractsFilter = (query) => {
    const filter = {};

    if (query.district) {
        filter.district = query.district;
    }
    if (query.procuring_entity) {
        filter.procuring_entity = query.procuring_entity;
    }
    if (query.status) {
        filter.computed_status = query.status;
    }
    if (query.funding_source) {
        filter.funding_source = query.funding_source;
    }
    if (query.has_red_flags === 'true') {
        filter['red_flags.0'] = { $exists: true };
    }
    if (query.contractor_id) {
        filter.contractor_id = query.contractor_id;
    }
    if (query.official_id) {
        filter.official_id = query.official_id;
    }
    if (query.year) {
        const year = Number(query.year);
        filter.notification_date = {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        };
    }

    return filter;
};

const getSort = (query) => {
    const sortBy = query.sort_by || 'notification_date';
    const sortOrder = query.sort_order === 'asc' ? 1 : -1;
    return { [sortBy]: sortOrder };
};

const listContracts = async (query) => {
    const filter = buildContractsFilter(query);
    const { page, limit, skip } = parsePagination(query);
    const sort = getSort(query);

    const [items, total] = await Promise.all([
        Contract.find(filter)
            .select(
                'tender_id package_number description district procuring_entity contract_value computed_status days_overdue red_flags work_status notification_date'
            )
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Contract.countDocuments(filter),
    ]);

    return {
        items,
        pagination: buildPaginationMeta({ total, page, limit }),
    };
};

const getContractByTenderId = async (tenderId) =>
    Contract.findOne({ tender_id: tenderId })
        .populate('contractor_id', 'company_name risk_level tenderer_id')
        .populate('official_id', 'full_name designation accountability_level')
        .lean();

const getContractTimeline = async (tenderId, weeks = 12) => {
    const start = new Date();
    start.setDate(start.getDate() - Number(weeks) * 7);

    return StatusHistory.find({
        tender_id: tenderId,
        checked_at: { $gte: start },
    })
        .sort({ checked_at: 1 })
        .select(
            'week_number previous_physical_pct new_physical_pct previous_financial_pct new_financial_pct previous_status new_status changed checked_at'
        )
        .lean();
};

const getContractRedFlags = async (tenderId) => {
    const contract = await Contract.findOne({ tender_id: tenderId })
        .select('tender_id description red_flags')
        .lean();
    return contract;
};

const exportContractsCsv = async (query) => {
    const filter = buildContractsFilter(query);
    const sort = getSort(query);

    const contracts = await Contract.find(filter)
        .select(
            'tender_id package_number description district procuring_entity funding_source contract_value computed_status days_overdue notification_date'
        )
        .sort(sort)
        .lean();

    const headers = [
        { key: 'tender_id', label: 'Tender ID' },
        { key: 'package_number', label: 'Package Number' },
        { key: 'description', label: 'Description' },
        { key: 'district', label: 'District' },
        { key: 'procuring_entity', label: 'Procuring Entity' },
        { key: 'funding_source', label: 'Funding Source' },
        { key: 'contract_value', label: 'Contract Value' },
        { key: 'computed_status', label: 'Computed Status' },
        { key: 'days_overdue', label: 'Days Overdue' },
        { key: 'notification_date', label: 'Notification Date' },
    ];

    return toCsv(contracts, headers);
};

module.exports = {
    listContracts,
    getContractByTenderId,
    getContractTimeline,
    getContractRedFlags,
    exportContractsCsv,
};
