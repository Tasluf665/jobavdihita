const moneyService = require('../services/money.service');

const getSummary = async (req, res, next) => {
    try {
        const data = await moneyService.getMoneySummary(req.query.district);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getByFundingSource = async (req, res, next) => {
    try {
        const data = await moneyService.getByFundingSource(req.query.district);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getYearlySpending = async (req, res, next) => {
    try {
        const nowYear = new Date().getFullYear();
        const fromYear = Number(req.query.from_year) || 2017;
        const toYear = Number(req.query.to_year) || nowYear;
        const data = await moneyService.getYearlySpending(req.query.district, fromYear, toYear);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getBudgetVsActual = async (req, res, next) => {
    try {
        const data = await moneyService.getBudgetVsActual(req.query);
        res.json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};

const getWorldBank = async (req, res, next) => {
    try {
        const data = await moneyService.getWorldBankStats(req.query.district);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary,
    getByFundingSource,
    getYearlySpending,
    getBudgetVsActual,
    getWorldBank,
};
