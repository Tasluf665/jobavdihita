const adminService = require('../services/admin.service');

const listSyncLogs = async (req, res, next) => {
    try {
        const data = await adminService.listSyncLogs(req.query);
        res.json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};

const getLatestSyncLogs = async (_req, res, next) => {
    try {
        const data = await adminService.getLatestSyncLogs();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getSyncLogById = async (req, res, next) => {
    try {
        const data = await adminService.getSyncLogById(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Sync log not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

const triggerJob = async (req, res, next) => {
    try {
        const data = await adminService.triggerJob(req.body.pipeline_name);
        res.status(202).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getDbStats = async (_req, res, next) => {
    try {
        const data = await adminService.getDbStats();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listSyncLogs,
    getLatestSyncLogs,
    getSyncLogById,
    triggerJob,
    getDbStats,
};
