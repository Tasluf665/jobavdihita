const { fetchContractsPage } = require('../../scrapers/eContractScraper');

const requestContractsPage = async ({ stateName, pageNo, size }) =>
    fetchContractsPage({ stateName, pageNo, size });

module.exports = {
    requestContractsPage,
};
