const express = require('express');
const districtsController = require('../controllers/districts.controller');

const router = express.Router();

router.get('/', districtsController.listDistricts);
router.get('/:name', districtsController.getDistrictByName);

module.exports = router;
