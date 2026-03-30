import { apiGet } from './api';

const fetchOfficials = async ({ page = 1, limit = 20, district, accountability_level } = {}) => {
    const response = await apiGet('/officials', {
        page,
        limit,
        district,
        accountability_level,
    });

    return {
        items: response.items || [],
        pagination: response.pagination || null,
    };
};

const fetchOfficialById = async (officialId) => {
    const response = await apiGet(`/officials/${officialId}`);
    return response.data || null;
};

const fetchOfficialContracts = async (
    officialId,
    { page = 1, limit = 20, status, sort_by = 'notification_date', sort_order = 'desc' } = {}
) => {
    const response = await apiGet(`/officials/${officialId}/contracts`, {
        page,
        limit,
        status,
        sort_by,
        sort_order,
    });

    return {
        official: response.official || null,
        items: response.items || [],
        pagination: response.pagination || null,
    };
};

const fetchOfficialPatterns = async (officialId) => {
    const response = await apiGet(`/officials/${officialId}/patterns`);
    return response.data || null;
};

const officialsApi = {
    fetchOfficials,
    fetchOfficialById,
    fetchOfficialContracts,
    fetchOfficialPatterns,
};

export default officialsApi;
