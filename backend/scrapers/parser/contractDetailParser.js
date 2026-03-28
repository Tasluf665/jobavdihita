const cheerio = require('cheerio');

const normalizeText = (value) =>
    String(value || '')
        .replace(/\s+/g, ' ')
        .trim();

const parseNumber = (value) => {
    const cleaned = String(value || '').replace(/[^\d.]/g, '');
    if (!cleaned) {
        return null;
    }

    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
};

const findFieldValue = (fields, patterns) => {
    const keys = Object.keys(fields);
    const matchedKey = keys.find((key) =>
        patterns.some((pattern) => pattern.test(key))
    );
    return matchedKey ? fields[matchedKey] : null;
};

const parseContractDetailPage = (html) => {
    const $ = cheerio.load(html);
    const fields = {};

    $('tr').each((_, row) => {
        const cells = $(row).find('th,td');
        if (cells.length < 2) {
            return;
        }

        const key = normalizeText($(cells[0]).text()).replace(/:$/, '');
        const value = normalizeText($(cells[1]).text());
        if (!key || !value) {
            return;
        }

        fields[key] = value;
    });

    const fundingSource = findFieldValue(fields, [
        /budget\s*and\s*source\s*of\s*funds?/i,
        /funding\s*source/i,
    ]);

    const officialName = findFieldValue(fields, [
        /name\s*of\s*authori[sz]ed\s*officer/i,
        /approving\s*engineer/i,
        /approving\s*authority/i,
        /engineer/i,
    ]);

    const tendersReceived = parseNumber(
        findFieldValue(fields, [
            /no\.??\s*of\s*tenders?\/proposals?\s*received/i,
            /tenders?\/proposals?\s*received/i,
            /no\.??\s*of\s*bids?\s*received/i,
        ])
    );

    const tendersResponsive = parseNumber(
        findFieldValue(fields, [
            /tenders?\/proposals?\s*responsive/i,
        ])
    );

    const tendersSold = parseNumber(
        findFieldValue(fields, [
            /no\.??\s*of\s*tenders?\/proposals?\s*sold/i,
        ])
    );

    const bidderCount = tendersSold ?? null;

    return {
        bidder_count: bidderCount,
        tenders_sold: tendersSold,
        tenders_received: tendersReceived,
        tenders_responsive: tendersResponsive,
        funding_source: fundingSource,
        document_sale_period: findFieldValue(fields, [/document\s*sale/i]),
        package_number: findFieldValue(fields, [
            /tender\/proposal\s*package\s*no/i,
            /package\s*no/i,
        ]),
        signing_date_text: findFieldValue(fields, [/date\s*of\s*contract\s*signing/i]),
        contract_start_date_text: findFieldValue(fields, [
            /proposed\s*date\s*of\s*contract\s*start/i,
            /contract\s*start/i,
        ]),
        contract_end_date_text: findFieldValue(fields, [
            /proposed\s*date\s*of\s*contract\s*completion/i,
            /contract\s*completion/i,
            /contract\s*end/i,
        ]),
        official_name: officialName,
        contract_value_taka: parseNumber(
            findFieldValue(fields, [/contract\s*value\s*\(\s*taka\s*\)/i, /contract\s*value/i])
        ),
        raw_fields: fields,
    };
};

module.exports = {
    parseContractDetailPage,
};
