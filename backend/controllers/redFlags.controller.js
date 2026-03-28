const redFlagsService = require('../services/redFlags.service');

const listRedFlags = async (req, res, next) => {
    try {
        const data = await redFlagsService.listRedFlags(req.query);
        res.json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};

const getSummary = async (_req, res, next) => {
    try {
        const data = await redFlagsService.getRedFlagSummary();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getCritical = async (req, res, next) => {
    try {
        const data = await redFlagsService.getCriticalRedFlags(req.query.limit || 10);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listRedFlags,
    getSummary,
    getCritical,
};
