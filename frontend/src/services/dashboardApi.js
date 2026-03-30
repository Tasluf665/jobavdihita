import { apiGet } from './api';

const fetchOverviewStats = async (district) => {
    const response = await apiGet('/overview/stats', { district });
    return response.data;
};

const fetchOverviewAlerts = async ({ district, limit = 10, severity } = {}) => {
    const response = await apiGet('/overview/alerts', { district, limit, severity });
    return response.data;
};

const fetchStatusBreakdown = async (district) => {
    const response = await apiGet('/overview/status-breakdown', { district });
    return response.data;
};

const fetchRecentActivity = async ({ limit = 8 } = {}) => {
    const response = await apiGet('/overview/recent-activity', { limit });
    return response.data;
};

const fetchCriticalFlags = async ({ limit = 10 } = {}) => {
    const response = await apiGet('/red-flags/critical', { limit });
    return response.data;
};

const fetchMoneySummary = async (district) => {
    const response = await apiGet('/money/summary', { district });
    return response.data;
};

const fetchYearlySpending = async ({ district, fromYear = 2017, toYear } = {}) => {
    const currentYear = new Date().getFullYear();
    const response = await apiGet('/money/yearly-spending', {
        district,
        from_year: fromYear,
        to_year: toYear || currentYear,
    });
    return response.data;
};

const dashboardApi = {
    fetchOverviewStats,
    fetchOverviewAlerts,
    fetchStatusBreakdown,
    fetchRecentActivity,
    fetchCriticalFlags,
    fetchMoneySummary,
    fetchYearlySpending,
};

export default dashboardApi;
