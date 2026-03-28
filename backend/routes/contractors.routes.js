const express = require('express');
const contractorsController = require('../controllers/contractors.controller');

const router = express.Router();

router.get('/', contractorsController.listContractors);
router.get('/search', contractorsController.searchContractors);
router.get('/:id/contracts', contractorsController.getContractorContracts);
router.get('/:id/red-flags', contractorsController.getContractorRedFlags);
router.get('/:id', contractorsController.getContractorById);

module.exports = router;
