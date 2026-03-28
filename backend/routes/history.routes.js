const express = require('express');
const historyController = require('../controllers/history.controller');

const router = express.Router();

router.get('/:tender_id/changes-only', historyController.getChangesOnly);
router.get('/:tender_id', historyController.getHistory);

module.exports = router;
