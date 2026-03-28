const express = require('express');
const overviewController = require('../controllers/overview.controller');

const router = express.Router();

router.get('/stats', overviewController.getStats);
router.get('/alerts', overviewController.getAlerts);
router.get('/status-breakdown', overviewController.getStatusBreakdown);
router.get('/recent-activity', overviewController.getRecentActivity);

module.exports = router;
