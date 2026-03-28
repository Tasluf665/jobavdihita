const env = require('../config/env');

const adminAuth = (req, res, next) => {
    if (!env.adminKey) {
        return res.status(503).json({
            success: false,
            message: 'Admin routes are not configured',
        });
    }

    const headerKey = req.header('x-admin-key');

    if (!headerKey || headerKey !== env.adminKey) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    return next();
};

module.exports = adminAuth;
