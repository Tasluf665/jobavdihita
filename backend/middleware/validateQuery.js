const validateQuery = (validatorFn) => (req, res, next) => {
    const error = validatorFn(req);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error,
        });
    }

    return next();
};

module.exports = validateQuery;
