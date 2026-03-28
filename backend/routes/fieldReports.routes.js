const express = require('express');
const fieldReportsController = require('../controllers/fieldReports.controller');
const validateQuery = require('../middleware/validateQuery');
const { fieldReportRateLimiter } = require('../middleware/rateLimiter');
const {
    validateCreateFieldReport,
    validatePhotoUpload,
} = require('../validators/fieldReport.validator');

const router = express.Router();

router.get('/:tender_id', fieldReportsController.getFieldReportsByTenderId);
router.post(
    '/',
    validateQuery(validateCreateFieldReport),
    fieldReportRateLimiter,
    fieldReportsController.createFieldReport
);
router.post(
    '/photo',
    validateQuery(validatePhotoUpload),
    fieldReportsController.uploadFieldReportPhoto
);

module.exports = router;
