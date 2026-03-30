import { apiGet } from './api';

const fetchContracts = async ({
    district,
    page = 1,
    limit = 5,
    status,
    year,
    sortBy = 'contract_value',
    sortOrder = 'desc',
} = {}) => {
    const response = await apiGet('/contracts', {
        district,
        page,
        limit,
        status,
        year,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    return {
        items: response.items || [],
        pagination: response.pagination || null,
    };
};

const fetchOverviewStats = async (district) => {
    const response = await apiGet('/overview/stats', { district });
    return response.data;
};

const fetchStatusBreakdown = async (district) => {
    const response = await apiGet('/overview/status-breakdown', { district });
    return response.data;
};

const contractsApi = {
    fetchContracts,
    fetchOverviewStats,
    fetchStatusBreakdown,
};

export default contractsApi;
