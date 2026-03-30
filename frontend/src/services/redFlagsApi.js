import { apiGet } from './api';

const fetchRedFlags = async ({ page = 1, limit = 5, sortBy = 'days_overdue' } = {}) => {
    const response = await apiGet('/red-flags', {
        page,
        limit,
        sort_by: sortBy,
    });

    return {
        items: response.items || [],
        pagination: response.pagination || null,
    };
};

const fetchRedFlagsSummary = async () => {
    const response = await apiGet('/red-flags/summary');
    return response.data || {};
};

const redFlagsApi = {
    fetchRedFlags,
    fetchRedFlagsSummary,
};

export default redFlagsApi;
