const { parseEprocureDate } = require('../../utils/dateHelpers');

const toSafeKey = (value) =>
    String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 48);

const normalizeContractorPayload = (contractorName) => {
    const normalized = String(contractorName || '')
        .replace(/\s+/g, ' ')
        .trim();

    if (!normalized) {
        return null;
    }

    const key = toSafeKey(normalized);

    return {
        tenderer_id: `unknown_${key}`,
        company_name: normalized,
        company_name_normalized: normalized.toLowerCase(),
    };
};

const mapScrapedRowToContractPayload = (row, detail = null) => ({
    tender_id: row.tender_id,
    description: row.description || null,
    package_number: detail?.package_number || null,
    district: row.district || 'Munshiganj',
    procuring_entity: row.procuring_entity || null,
    procurement_method: row.procurement_method || null,
    funding_source: detail?.funding_source || null,
    contract_value: detail?.contract_value_taka ?? row.contract_value_bdt ?? null,
    bidder_count: detail?.bidder_count ?? null,
    notification_date: parseEprocureDate(row.notification_date_text),
    signing_date: parseEprocureDate(detail?.signing_date_text),
    contract_start_date: parseEprocureDate(detail?.contract_start_date_text),
    contract_end_date: parseEprocureDate(detail?.contract_end_date_text),
    detail_url: row.detail_url || null,
    fetched_at: new Date(),
});

module.exports = {
    normalizeContractorPayload,
    mapScrapedRowToContractPayload,
};
