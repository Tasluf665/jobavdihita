const Contract = require('../../models/contract.model');

const getExistingTenderIdSet = async (tenderIds) => {
    const uniqueIds = [...new Set(tenderIds.filter(Boolean))];
    if (!uniqueIds.length) {
        return new Set();
    }

    const existing = await Contract.find({ tender_id: { $in: uniqueIds } })
        .select('tender_id')
        .lean();

    return new Set(existing.map((item) => item.tender_id));
};

const filterNewRows = (rows, existingTenderIdSet) =>
    rows.filter((row) => row.tender_id && !existingTenderIdSet.has(row.tender_id));

module.exports = {
    getExistingTenderIdSet,
    filterNewRows,
};
