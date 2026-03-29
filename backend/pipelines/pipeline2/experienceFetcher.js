const cheerio = require('cheerio');
const { getHtml, postForm } = require('../../scrapers/httpClient');
const { parseEprocureDate } = require('../../utils/dateHelpers');

const BASE_URL = 'https://www.eprocure.gov.bd';
const ECMS_LIST_URL = 'https://www.eprocure.gov.bd/AdvSearcheCMSServlet';

const normalizeText = (value) =>
    String(value || '')
        .replace(/\s+/g, ' ')
        .trim();

const parseNumber = (value) => {
    const cleaned = String(value || '').replace(/[^\d.]/g, '');
    if (!cleaned) {
        return null;
    }

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
};

const findField = (fields, patterns) => {
    const key = Object.keys(fields).find((candidate) =>
        patterns.some((pattern) => pattern.test(candidate))
    );
    return key ? fields[key] : null;
};

const buildNotFoundResult = (url = null) => ({
    found: false,
    status_label: null,
    physical_progress_pct: null,
    financial_progress_pct: null,
    latest_milestone_date: null,
    completion_certificate: false,
    contract_start_date: null,
    contract_end_date: null,
    contract_value_bdt: null,
    raw_fields: {},
    url,
});

const parseExperienceListResult = (html) => {
    let $ = cheerio.load(html);
    if ($('tr').length === 0 && String(html).includes('<tr')) {
        $ = cheerio.load(`<table id="eCmsResultTable">${html}</table>`);
    }

    const noRecordCell = $('#noRecordFound').first();
    if (noRecordCell.length > 0 || /No\s+Record\s+Found/i.test(normalizeText($.text()))) {
        return {
            found: false,
            detail_url: null,
            status_label: null,
            contract_start_date: null,
            contract_end_date: null,
            contract_value_bdt: null,
        };
    }

    const row =
        $('tr')
            .filter((_, el) => $(el).find('a[href*="VieweCmsDetails.jsp"]').length > 0)
            .first() || null;

    if (!row || row.length === 0) {
        return {
            found: false,
            detail_url: null,
            status_label: null,
            contract_start_date: null,
            contract_end_date: null,
            contract_value_bdt: null,
        };
    }

    const cells = row.find('td');
    const detailHref = normalizeText($(cells[3]).find('a').attr('href') || '');
    const detail_url = detailHref
        ? detailHref.startsWith('http')
            ? detailHref
            : `${BASE_URL}${detailHref}`
        : null;

    const statusLabel = normalizeText($(cells[9]).text()) || null;
    const contractValue = parseNumber($(cells[7]).text());

    const dateText = normalizeText($(cells[8]).text());
    const dateMatches = String(dateText).match(/\d{1,2}-[A-Za-z]{3}-\d{4}/g) || [];
    const contractStartDate = dateMatches[0] ? parseEprocureDate(dateMatches[0]) : null;
    const contractEndDate = dateMatches[1] ? parseEprocureDate(dateMatches[1]) : null;

    return {
        found: true,
        detail_url,
        status_label: statusLabel,
        contract_start_date: contractStartDate,
        contract_end_date: contractEndDate,
        contract_value_bdt: contractValue,
    };
};

const parseExperienceDetailPage = (html) => {
    const $ = cheerio.load(html);
    const fields = {};

    $('tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 2) {
            return;
        }

        for (let i = 0; i < cells.length - 1; i += 2) {
            const key = normalizeText($(cells[i]).text()).replace(/\s*:\s*$/, '');
            const value = normalizeText($(cells[i + 1]).text());
            if (!key || !value) {
                continue;
            }
            fields[key] = value;
        }
    });

    const statusLabel = findField(fields, [/work\s*completion\s*status/i]);
    const physicalPct = parseNumber(
        findField(fields, [/physical\s*progress\s*\(%\)/i, /physical\s*progress/i])
    );
    const financialPct = parseNumber(
        findField(fields, [/financial\s*progress\s*\(%\)/i, /financial\s*progress/i])
    );

    const physicalDate = parseEprocureDate(
        findField(fields, [/date\s*of\s*physical\s*progress/i])
    );
    const financialDate = parseEprocureDate(
        findField(fields, [/date\s*of\s*financial\s*progress/i])
    );

    const latestMilestoneDate = [physicalDate, financialDate]
        .filter(Boolean)
        .sort((a, b) => b.getTime() - a.getTime())[0] || null;

    const completionCertificate = Boolean(
        statusLabel && /completed/i.test(statusLabel)
    );

    return {
        found: Object.keys(fields).length > 0,
        status_label: statusLabel || null,
        physical_progress_pct: physicalPct,
        financial_progress_pct: financialPct,
        latest_milestone_date: latestMilestoneDate,
        completion_certificate: completionCertificate,
        contract_start_date: parseEprocureDate(
            findField(fields, [/contract\s*start\s*date/i])
        ),
        contract_end_date: parseEprocureDate(
            findField(fields, [/contract\s*end\s*date/i])
        ),
        contract_value_bdt: parseNumber(
            findField(fields, [
                /contract\s*value\s*\(\s*equivalent\s*in\s*bdt\s*\)/i,
                /contract\s*value/i,
            ])
        ),
        raw_fields: fields,
    };
};

const fetchExperienceByTenderId = async (tenderId) => {
    const safeId = String(tenderId || '').trim();
    if (!safeId) {
        return buildNotFoundResult();
    }

    const listHtml = await postForm(ECMS_LIST_URL, {
        action: 'geteCMSList',
        keyword: '',
        officeId: 0,
        contractAwardTo: '',
        contractStartDtFrom: '',
        contractStartDtTo: '',
        contractEndDtFrom: '',
        contractEndDtTo: '',
        departmentId: '',
        tenderId: safeId,
        procurementMethod: '',
        procurementNature: '',
        contAwrdSearchOpt: 'Contains',
        exCertSearchOpt: 'Contains',
        exCertificateNo: '',
        tendererId: '',
        procType: '',
        statusTab: 'All',
        pageNo: 1,
        size: 10,
        workStatus: 'All'
    });

    const listResult = parseExperienceListResult(listHtml);
    if (!listResult.found) {
        return buildNotFoundResult();
    }

    if (!listResult.detail_url) {
        return {
            ...buildNotFoundResult(),
            found: true,
            status_label: listResult.status_label,
            contract_start_date: listResult.contract_start_date,
            contract_end_date: listResult.contract_end_date,
            contract_value_bdt: listResult.contract_value_bdt,
        };
    }

    try {
        const html = await getHtml(listResult.detail_url);
        const parsed = parseExperienceDetailPage(html);

        return {
            ...parsed,
            status_label: parsed.status_label || listResult.status_label,
            contract_start_date:
                parsed.contract_start_date || listResult.contract_start_date,
            contract_end_date: parsed.contract_end_date || listResult.contract_end_date,
            contract_value_bdt:
                parsed.contract_value_bdt ?? listResult.contract_value_bdt ?? null,
            url: listResult.detail_url,
        };
    } catch (error) {
        const statusCode = Number(error?.response?.status);
        if (statusCode === 404 || statusCode === 500) {
            return {
                ...buildNotFoundResult(listResult.detail_url),
                found: true,
                status_label: listResult.status_label,
                contract_start_date: listResult.contract_start_date,
                contract_end_date: listResult.contract_end_date,
                contract_value_bdt: listResult.contract_value_bdt,
            };
        }

        throw error;
    }
};

module.exports = {
    fetchExperienceByTenderId,
};

