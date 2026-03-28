const searchService = require('../services/search.service');

const globalSearch = async (req, res, next) => {
    try {
        const data = await searchService.searchAll(req.query);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    globalSearch,
};
