const express = require('express');
const contractsController = require('../controllers/contracts.controller');
const validateQuery = require('../middleware/validateQuery');
const { validateListContractsQuery } = require('../validators/contracts.validator');

const router = express.Router();

router.get('/', validateQuery(validateListContractsQuery), contractsController.listContracts);
router.get('/export', validateQuery(validateListContractsQuery), contractsController.exportContracts);
router.get('/:tender_id/timeline', contractsController.getContractTimeline);
router.get('/:tender_id/red-flags', contractsController.getContractRedFlags);
router.get('/:tender_id', contractsController.getContractByTenderId);

module.exports = router;
