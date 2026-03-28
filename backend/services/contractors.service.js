const mongoose = require('mongoose');
const Contractor = require('../models/contractor.model');
const Contract = require('../models/contract.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

const findContractorFilter = (query) => ({
    ...(query.risk_level ? { risk_level: query.risk_level } : {}),
    ...(query.district ? { district: query.district } : {}),
});

const listContractors = async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const filter = findContractorFilter(query);
    const sortBy = query.sort_by || 'updated_at';
    const sortOrder = query.sort_order === 'asc' ? 1 : -1;
    const sort = { [sortBy.includes('.') ? sortBy : sortBy]: sortOrder };

    const [items, total] = await Promise.all([
        Contractor.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Contractor.countDocuments(filter),
    ]);

    return {
        items,
        pagination: buildPaginationMeta({ total, page, limit }),
    };
};

const searchContractors = async (q) =>
    Contractor.find({ $text: { $search: q } })
        .select('company_name tenderer_id district risk_level stats')
        .limit(10)
        .lean();

const getContractorById = async (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return Contractor.findById(id).lean();
    }
    return Contractor.findOne({ tenderer_id: id }).lean();
};

const getContractorContracts = async (id, query) => {
    const contractor = await getContractorById(id);
    if (!contractor) {
        return null;
    }

    const { page, limit, skip } = parsePagination(query);
    const filter = { contractor_id: contractor._id };
    if (query.status) {
        filter.computed_status = query.status;
    }

    const sortBy = query.sort_by || 'notification_date';
    const sortOrder = query.sort_order === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
        Contract.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean(),
        Contract.countDocuments(filter),
    ]);

    return {
        contractor,
        items,
        pagination: buildPaginationMeta({ total, page, limit }),
    };
};

const getContractorRedFlags = async (id) => {
    const contractor = await getContractorById(id);
    if (!contractor) {
        return null;
    }

    const contracts = await Contract.find({ contractor_id: contractor._id, 'red_flags.0': { $exists: true } })
        .select('tender_id description red_flags')
        .lean();

    return contracts.flatMap((contract) =>
        contract.red_flags.map((flag) => ({
            tender_id: contract.tender_id,
            description: contract.description,
            ...flag,
        }))
    );
};

module.exports = {
    listContractors,
    searchContractors,
    getContractorById,
    getContractorContracts,
    getContractorRedFlags,
};
