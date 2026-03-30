const express = require('express');
const redFlagsController = require('../controllers/redFlags.controller');

const router = express.Router();

router.get('/', redFlagsController.listRedFlags);
router.get('/summary', redFlagsController.getSummary);
router.get('/critical', redFlagsController.getCritical);
router.get('/repeat-winners', redFlagsController.getRepeatWinners);

module.exports = router;
