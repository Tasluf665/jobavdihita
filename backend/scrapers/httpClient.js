const axios = require('axios');
const http = require('http');
const https = require('https');

const httpClient = axios.create({
    timeout: 30000,
    maxRedirects: 5,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
});

const RETRYABLE_ERROR_CODES = new Set([
    'ECONNRESET',
    'ECONNABORTED',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'ENOTFOUND',
    'EPIPE',
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableNetworkError = (error) => {
    const code = error?.code;
    const message = String(error?.message || '').toLowerCase();

    if (RETRYABLE_ERROR_CODES.has(code)) {
        return true;
    }

    return (
        message.includes('socket hang up') ||
        message.includes('network error') ||
        message.includes('timeout')
    );
};

const withRetry = async (requestFn, maxRetries = 3) => {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;
            const shouldRetry = isRetryableNetworkError(error) && attempt < maxRetries;
            if (!shouldRetry) {
                throw error;
            }

            const backoffMs = 400 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
            await sleep(backoffMs);
        }
    }

    throw lastError;
};

const postForm = async (url, payload) => {
    const body = new URLSearchParams(payload);
    const response = await withRetry(() =>
        httpClient.post(url, body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Origin: 'https://www.eprocure.gov.bd',
                Referer: 'https://www.eprocure.gov.bd/resources/common/AdvSearchNOA.jsp',
            },
        })
    );
    return response.data;
};

const getHtml = async (url) => {
    const response = await withRetry(() => httpClient.get(url));
    return response.data;
};

module.exports = {
    postForm,
    getHtml,
};
