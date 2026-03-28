const express = require('express');
const moneyController = require('../controllers/money.controller');

const router = express.Router();

router.get('/summary', moneyController.getSummary);
router.get('/by-funding-source', moneyController.getByFundingSource);
router.get('/yearly-spending', moneyController.getYearlySpending);
router.get('/budget-vs-actual', moneyController.getBudgetVsActual);
router.get('/world-bank', moneyController.getWorldBank);

module.exports = router;
