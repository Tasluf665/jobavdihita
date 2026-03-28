const express = require('express');
const overviewRoutes = require('./overview.routes');
const contractsRoutes = require('./contracts.routes');
const redFlagsRoutes = require('./redFlags.routes');
const contractorsRoutes = require('./contractors.routes');
const officialsRoutes = require('./officials.routes');
const moneyRoutes = require('./money.routes');
const fieldReportsRoutes = require('./fieldReports.routes');
const historyRoutes = require('./history.routes');
const districtsRoutes = require('./districts.routes');
const searchRoutes = require('./search.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'API is running',
    });
});

router.get('/health', (_req, res) => {
    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

router.use('/overview', overviewRoutes);
router.use('/contracts', contractsRoutes);
router.use('/red-flags', redFlagsRoutes);
router.use('/contractors', contractorsRoutes);
router.use('/officials', officialsRoutes);
router.use('/money', moneyRoutes);
router.use('/field-reports', fieldReportsRoutes);
router.use('/history', historyRoutes);
router.use('/districts', districtsRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
