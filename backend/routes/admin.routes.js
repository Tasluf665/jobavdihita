const express = require('express');
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');
const validateQuery = require('../middleware/validateQuery');
const { validateTriggerJob } = require('../validators/admin.validator');

const router = express.Router();

router.use(adminAuth);

router.get('/sync-logs', adminController.listSyncLogs);
router.get('/sync-logs/latest', adminController.getLatestSyncLogs);
router.get('/sync-logs/:id', adminController.getSyncLogById);
router.post('/jobs/trigger', validateQuery(validateTriggerJob), adminController.triggerJob);
router.get('/db-stats', adminController.getDbStats);

module.exports = router;
