const express = require('express');
const searchController = require('../controllers/search.controller');
const validateQuery = require('../middleware/validateQuery');
const { validateGlobalSearchQuery } = require('../validators/search.validator');

const router = express.Router();

router.get('/', validateQuery(validateGlobalSearchQuery), searchController.globalSearch);

module.exports = router;
