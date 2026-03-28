const historyService = require('../services/history.service');

const getHistory = async (req, res, next) => {
    try {
        const data = await historyService.getHistoryByTenderId(
            req.params.tender_id,
            req.query.weeks || 26
        );
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getChangesOnly = async (req, res, next) => {
    try {
        const data = await historyService.getChangesOnlyByTenderId(req.params.tender_id);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHistory,
    getChangesOnly,
};
