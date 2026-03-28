const allowedStatuses = ['completed', 'ongoing', 'overdue', 'ghost', 'not_started'];
const allowedSortBy = [
    'contract_value',
    'days_overdue',
    'contract_end_date',
    'notification_date',
];

const validateListContractsQuery = (req) => {
    const { page, limit, status, sort_by, sort_order } = req.query;

    if (page && Number(page) < 1) {
        return 'page must be >= 1';
    }

    if (limit && (Number(limit) < 1 || Number(limit) > 100)) {
        return 'limit must be between 1 and 100';
    }

    if (status && !allowedStatuses.includes(status)) {
        return 'Invalid status filter';
    }

    if (sort_by && !allowedSortBy.includes(sort_by)) {
        return 'Invalid sort_by value';
    }

    if (sort_order && !['asc', 'desc'].includes(sort_order)) {
        return 'sort_order must be asc or desc';
    }

    return null;
};

module.exports = {
    validateListContractsQuery,
};
