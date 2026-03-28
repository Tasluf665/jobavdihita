const contractsService = require('../services/contracts.service');

const listContracts = async (req, res, next) => {
    try {
        const data = await contractsService.listContracts(req.query);
        res.json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};

const exportContracts = async (req, res, next) => {
    try {
        const csv = await contractsService.exportContractsCsv(req.query);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="contracts.csv"');
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};

const getContractByTenderId = async (req, res, next) => {
    try {
        const data = await contractsService.getContractByTenderId(req.params.tender_id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Contract not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

const getContractTimeline = async (req, res, next) => {
    try {
        const data = await contractsService.getContractTimeline(
            req.params.tender_id,
            req.query.weeks || 12
        );
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getContractRedFlags = async (req, res, next) => {
    try {
        const data = await contractsService.getContractRedFlags(req.params.tender_id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Contract not found' });
        }
        return res.json({ success: true, data: data.red_flags || [] });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    listContracts,
    exportContracts,
    getContractByTenderId,
    getContractTimeline,
    getContractRedFlags,
};
