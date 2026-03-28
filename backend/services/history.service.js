const StatusHistory = require('../models/statusHistory.model');

const getHistoryByTenderId = async (tenderId, weeks = 26) => {
    const start = new Date();
    start.setDate(start.getDate() - Number(weeks) * 7);

    return StatusHistory.find({
        tender_id: tenderId,
        checked_at: { $gte: start },
    })
        .sort({ checked_at: 1 })
        .lean();
};

const getChangesOnlyByTenderId = async (tenderId) =>
    StatusHistory.find({ tender_id: tenderId, changed: true })
        .sort({ checked_at: -1 })
        .lean();

module.exports = {
    getHistoryByTenderId,
    getChangesOnlyByTenderId,
};
