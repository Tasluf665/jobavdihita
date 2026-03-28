const axios = require('axios');

const httpClient = axios.create({
    timeout: 30000,
    maxRedirects: 5,
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
});

const postForm = async (url, payload) => {
    const body = new URLSearchParams(payload);
    const response = await httpClient.post(url, body.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://www.eprocure.gov.bd',
            Referer: 'https://www.eprocure.gov.bd/resources/common/AdvSearchNOA.jsp',
        },
    });
    return response.data;
};

const getHtml = async (url) => {
    const response = await httpClient.get(url);
    return response.data;
};

module.exports = {
    postForm,
    getHtml,
};
