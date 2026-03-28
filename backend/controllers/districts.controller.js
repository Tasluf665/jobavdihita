const districtsService = require('../services/districts.service');

const listDistricts = async (req, res, next) => {
    try {
        const isActive =
            req.query.is_active === undefined
                ? true
                : req.query.is_active === 'true';
        const data = await districtsService.listDistricts(isActive);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getDistrictByName = async (req, res, next) => {
    try {
        const data = await districtsService.getDistrictByName(req.params.name);
        if (!data) {
            return res.status(404).json({ success: false, message: 'District not found' });
        }
        return res.json({ success: true, data });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    listDistricts,
    getDistrictByName,
};
