const contractorsService = require('../services/contractors.service');

const listContractors = async (req, res, next) => {
    try {
        const data = await contractorsService.listContractors(req.query);
        res.json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};

const searchContractors = async (req, res, next) => {
    try {
        const data = await contractorsService.searchContractors(req.query.q);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getContractorById = async (req, res, next) => {
    try {
        const data = await contractorsService.getContractorById(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

const getContractorContracts = async (req, res, next) => {
    try {
        const data = await contractorsService.getContractorContracts(req.params.id, req.query);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }
        return res.json({ success: true, ...data });
    } catch (error) {
        return next(error);
    }
};

const getContractorRedFlags = async (req, res, next) => {
    try {
        const data = await contractorsService.getContractorRedFlags(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    listContractors,
    searchContractors,
    getContractorById,
    getContractorContracts,
    getContractorRedFlags,
};
