const { postForm, getHtml } = require('./httpClient');
const { parseContractListPage } = require('./parser/contractListParser');
const { parseContractDetailPage } = require('./parser/contractDetailParser');

const ADV_SEARCH_URL =
    'https://www.eprocure.gov.bd/resources/common/AdvSearchNOA.jsp';
const ADV_SEARCH_SERVLET_URL = 'https://www.eprocure.gov.bd/AdvSearchNOAServlet';

const fetchContractsPage = async ({ stateName = 'Munshiganj', pageNo = 1, size = 10 }) => {
    const html = await postForm(ADV_SEARCH_URL, {
        stateName,
        pageNo: String(pageNo),
        size: String(size),
    });

    const parsed = parseContractListPage(html);
    if (parsed.rows.length > 0 && pageNo !== 1) {
        return parsed;
    }

    const servletHtml = await postForm(ADV_SEARCH_SERVLET_URL, {
        keyword: '',
        officeId: '',
        contractAwardTo: '',
        noaDt: '',
        stateName,
        departmentId: '',
        tenderId: '',
        contractNo: '',
        contractDtFrom: '',
        contractDtTo: '',
        tenderRefNo: '',
        contractAmount: '',
        cpvCode: '',
        advDt: '',
        procurementMethod: '',
        isFrame: '0',
        pageNo: String(pageNo),
        size: String(size),
    });

    const parsedServlet = parseContractListPage(servletHtml);
    const mergedTotalPages = Math.max(
        Number(parsed.totalPages) || 0,
        Number(parsedServlet.totalPages) || 0,
        1
    );

    return {
        totalPages: mergedTotalPages,
        rows: parsed.rows.length ? parsed.rows : parsedServlet.rows,
    };
};

const fetchContractDetail = async (detailUrl) => {
    if (!detailUrl) {
        return null;
    }

    const html = await getHtml(detailUrl);
    return parseContractDetailPage(html);
};

module.exports = {
    fetchContractsPage,
    fetchContractDetail,
};
