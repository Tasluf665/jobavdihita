const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const buildQueryString = (query = {}) => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        params.set(key, String(value));
    });

    const result = params.toString();
    return result ? `?${result}` : '';
};

const apiGet = async (path, query) => {
    const response = await fetch(`${API_BASE_URL}${path}${buildQueryString(query)}`);
    const payload = await response.json();

    if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || 'Request failed');
    }

    return payload;
};

export { apiGet };
