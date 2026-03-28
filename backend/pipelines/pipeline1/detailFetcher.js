const { fetchContractDetail } = require('../../scrapers/eContractScraper');

const fetchDetailForRow = async (row) => {
    try {
        if (!row?.detail_url) {
            return null;
        }
        return await fetchContractDetail(row.detail_url);
    } catch (_error) {
        return null;
    }
};

module.exports = {
    fetchDetailForRow,
};
