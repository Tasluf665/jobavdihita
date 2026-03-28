const logger = require('../utils/logger');

const errorHandler = (err, _req, res, _next) => {
    logger.error('unhandled_error', {
        message: err.message,
        stack: err.stack,
    });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
};

module.exports = errorHandler;
