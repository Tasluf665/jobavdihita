const validateGlobalSearchQuery = (req) => {
    const { q, type, limit } = req.query;

    if (!q || String(q).trim().length < 2) {
        return 'q must be at least 2 characters';
    }

    if (type && !['contracts', 'contractors', 'officials'].includes(type)) {
        return 'type must be contracts, contractors, or officials';
    }

    if (limit && (Number(limit) < 1 || Number(limit) > 50)) {
        return 'limit must be between 1 and 50';
    }

    return null;
};

module.exports = {
    validateGlobalSearchQuery,
};
