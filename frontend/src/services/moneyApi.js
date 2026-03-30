import { apiGet } from './api';

const fetchMoneySummary = async (district) => {
    const response = await apiGet('/money/summary', { district });
    return response.data;
};

const fetchFundingSources = async (district) => {
    const response = await apiGet('/money/by-funding-source', { district });
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

const fetchTopAlerts = async ({ district, limit = 8 } = {}) => {
    const response = await apiGet('/overview/alerts', { district, limit });
    return response.data;
};

const moneyApi = {
    fetchMoneySummary,
    fetchFundingSources,
    fetchYearlySpending,
    fetchTopAlerts,
};

export default moneyApi;
