const fieldReportsService = require('../services/fieldReports.service');

const getFieldReportsByTenderId = async (req, res, next) => {
    try {
        const data = await fieldReportsService.getFieldReportsByTenderId(
            req.params.tender_id,
            req.query
        );

        if (!data) {
            return res.status(404).json({ success: false, message: 'Contract not found' });
        }

        return res.json({ success: true, ...data });
    } catch (error) {
        return next(error);
    }
};

const createFieldReport = async (req, res, next) => {
    try {
        const data = await fieldReportsService.createFieldReport(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const uploadFieldReportPhoto = async (req, res, next) => {
    try {
        const data = await fieldReportsService.attachPhotoToReport(req.body);
        res.json({ success: true, data: { photo_url: data.photo_url } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFieldReportsByTenderId,
    createFieldReport,
    uploadFieldReportPhoto,
};
