const overviewService = require('../services/overview.service');

const getStats = async (req, res, next) => {
    try {
        const data = await overviewService.getOverviewStats(req.query.district || 'Munshiganj');
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getAlerts = async (req, res, next) => {
    try {
        const data = await overviewService.getOverviewAlerts(req.query);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getStatusBreakdown = async (req, res, next) => {
    try {
        const data = await overviewService.getStatusBreakdown(req.query.district || 'Munshiganj');
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getRecentActivity = async (req, res, next) => {
    try {
        const data = await overviewService.getRecentActivity(req.query.limit || 5);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats,
    getAlerts,
    getStatusBreakdown,
    getRecentActivity,
};
