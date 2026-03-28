const Contract = require('../models/contract.model');
const Contractor = require('../models/contractor.model');
const Official = require('../models/official.model');

const searchAll = async ({ q, type, limit = 5 }) => {
    const regex = new RegExp(q, 'i');
    const max = Number(limit) || 5;

    const result = {
        contracts: [],
        contractors: [],
        officials: [],
    };

    if (!type || type === 'contracts') {
        result.contracts = await Contract.find({
            $or: [{ tender_id: regex }, { description: regex }],
        })
            .select('tender_id description district computed_status')
            .limit(max)
            .lean();
    }

    if (!type || type === 'contractors') {
        result.contractors = await Contractor.find({ $text: { $search: q } })
            .select('company_name tenderer_id district risk_level')
            .limit(max)
            .lean();
    }

    if (!type || type === 'officials') {
        result.officials = await Official.find({ $text: { $search: q } })
            .select('full_name designation district accountability_level')
            .limit(max)
            .lean();
    }

    return result;
};

module.exports = {
    searchAll,
};
