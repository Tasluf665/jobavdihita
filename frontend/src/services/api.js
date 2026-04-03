const getApiBaseUrl = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (backendUrl) {
        // When provided (e.g. Docker/static deploy), call backend directly
        return `${backendUrl.replace(/\/$/, '')}/api`;
    }

    // Development fallback: use Vite proxy via relative /api path
    return import.meta.env.VITE_API_BASE_URL || '/api';
};

const API_BASE_URL = getApiBaseUrl();

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
