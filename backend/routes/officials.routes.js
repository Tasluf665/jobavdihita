const express = require('express');
const officialsController = require('../controllers/officials.controller');

const router = express.Router();

router.get('/', officialsController.listOfficials);
router.get('/search', officialsController.searchOfficials);
router.get('/:id/contracts', officialsController.getOfficialContracts);
router.get('/:id/patterns', officialsController.getOfficialPatterns);
router.get('/:id', officialsController.getOfficialById);

module.exports = router;
