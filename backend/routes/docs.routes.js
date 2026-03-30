const express = require('express');
const docsController = require('../controllers/docs.controller');

const router = express.Router();

router.get('/', docsController.getApiDocumentation);

module.exports = router;
