const cheerio = require('cheerio');

const BASE_URL = 'https://www.eprocure.gov.bd';

const normalizeText = (value) =>
    String(value || '')
        .replace(/\s+/g, ' ')
        .trim();

const parseContractValueToBdt = (valueText) => {
    const num = Number(String(valueText || '').replace(/[^\d.]/g, ''));
    if (!Number.isFinite(num)) {
        return null;
    }

    return Math.round(num * 10000000); // crore BDT -> BDT
};

const parseSerialNumber = (valueText) => {
    const value = Number(String(valueText || '').replace(/[^\d]/g, ''));
    return Number.isFinite(value) && value > 0 ? value : null;
};

const parseTenderText = (cell) => {
    const line = normalizeText(cell.find('p').first().text());
    const tenderIdFromText = line.match(/(\d{5,})/)?.[1] || null;

    return {
        tender_id_from_text: tenderIdFromText,
        tender_ref_no: line,
    };
};

const parseTotalPages = ($) => {
    const candidateValues = [];

    const spanText = normalizeText($('#pageTot').text());
    const spanValue = Number(spanText);
    if (Number.isFinite(spanValue) && spanValue > 0) {
        candidateValues.push(spanValue);
    }

    $('input#totalPages').each((_, el) => {
        const value = Number($(el).val());
        if (Number.isFinite(value) && value > 0) {
            candidateValues.push(value);
        }
    });

    if (candidateValues.length) {
        return Math.max(...candidateValues);
    }

    return 1;
};

const parseContractListPage = (html) => {
    let $ = cheerio.load(html);
    if ($('tr').length === 0 && String(html).includes('<tr')) {
        $ = cheerio.load(`<table id="resultTable">${html}</table>`);
    }
    const rows = [];

    const resultTableAllRows = $('#resultTable tr').toArray();
    const hasHeaderRow = resultTableAllRows.length
        ? $(resultTableAllRows[0]).find('th').length > 0
        : false;
    const resultTableRows = hasHeaderRow
        ? resultTableAllRows.slice(1)
        : resultTableAllRows;
    const fallbackRows = $('tr')
        .filter((_, row) =>
            $(row).find('a[href*="ViewAwardedContracts.jsp"]').length > 0
        )
        .toArray();

    const sourceRows = resultTableRows.length ? resultTableRows : fallbackRows;

    sourceRows.forEach((row) => {
        const cells = $(row).find('td');
        if (cells.length < 8) {
            return;
        }

        const tenderCell = $(cells[2]);
        const procuringCell = $(cells[3]);

        const detailPath = tenderCell.find('a').attr('href') || '';
        const detail_url = detailPath.startsWith('http')
            ? detailPath
            : `${BASE_URL}${detailPath}`;

        const tenderIdFromQuery = detail_url.match(/[?&]tenderid=(\d+)/i)?.[1] || null;
        const parsedTender = parseTenderText(tenderCell);

        const procuringCellChunks = normalizeText(procuringCell.text())
            .split(' ')
            .filter(Boolean);

        const procurement_method =
            procuringCellChunks[procuringCellChunks.length - 1] || null;
        const procuring_entity = normalizeText(procuringCell.text()).replace(
            new RegExp(`${procurement_method}$`),
            ''
        ).trim();

        const description = normalizeText(
            tenderCell
                .clone()
                .find('p')
                .remove()
                .end()
                .text()
        );

        rows.push({
            serial_no: parseSerialNumber($(cells[0]).text()),
            ministry_division: normalizeText($(cells[1]).text()),
            tender_id: tenderIdFromQuery || parsedTender.tender_id_from_text,
            tender_ref_no: parsedTender.tender_ref_no,
            description,
            detail_url,
            procuring_entity,
            procurement_method,
            district: normalizeText($(cells[4]).text()),
            notification_date_text: normalizeText($(cells[5]).text()),
            contractor_name: normalizeText($(cells[6]).text()),
            contract_value_cr_text: normalizeText($(cells[7]).text()),
            contract_value_bdt: parseContractValueToBdt($(cells[7]).text()),
        });
    });

    return {
        totalPages: parseTotalPages($),
        rows,
    };
};

module.exports = {
    parseContractListPage,
};
