const officialsService = require('../services/officials.service');

const listOfficials = async (req, res, next) => {
    try {
        const data = await officialsService.listOfficials(req.query);
        res.json({ success: true, ...data });
    } catch (error) {
        next(error);
    }
};

const searchOfficials = async (req, res, next) => {
    try {
        const data = await officialsService.searchOfficials(req.query.q);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getOfficialById = async (req, res, next) => {
    try {
        const data = await officialsService.getOfficialById(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Official not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

const getOfficialContracts = async (req, res, next) => {
    try {
        const data = await officialsService.getOfficialContracts(req.params.id, req.query);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Official not found' });
        }
        return res.json({ success: true, ...data });
    } catch (error) {
        return next(error);
    }
};

const getOfficialPatterns = async (req, res, next) => {
    try {
        const data = await officialsService.getOfficialPatterns(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Official not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    listOfficials,
    searchOfficials,
    getOfficialById,
    getOfficialContracts,
    getOfficialPatterns,
};
