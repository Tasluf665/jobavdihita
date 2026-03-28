const Contract = require('../../models/contract.model');
const Contractor = require('../../models/contractor.model');
const Official = require('../../models/official.model');
const SyncLog = require('../../models/syncLog.model');
const { requestContractsPage } = require('./searchRequester');
const { buildPageList } = require('./paginationHandler');
const { fetchDetailForRow } = require('./detailFetcher');
const {
    normalizeContractorPayload,
    mapScrapedRowToContractPayload,
} = require('./rowParser');
const { getExistingTenderIdSet, filterNewRows } = require('./deduplicator');
const logger = require('../../utils/logger');

const toNormalizedName = (value) =>
    String(value || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

const upsertContractorFromName = async (contractorName, district) => {
    const contractorPayload = normalizeContractorPayload(contractorName);
    if (!contractorPayload) {
        return null;
    }

    return Contractor.findOneAndUpdate(
        { company_name_normalized: contractorPayload.company_name_normalized },
        {
            $setOnInsert: {
                tenderer_id: contractorPayload.tenderer_id,
                company_name: contractorPayload.company_name,
                company_name_normalized: contractorPayload.company_name_normalized,
                district: district || null,
            },
            $set: {
                last_active_date: new Date(),
                updated_at: new Date(),
            },
        },
        { upsert: true, new: true }
    );
};

const upsertOfficialFromName = async (officialName, district) => {
    const fullName = String(officialName || '').replace(/\s+/g, ' ').trim();
    if (!fullName) {
        return null;
    }

    const normalized = toNormalizedName(fullName);
    return Official.findOneAndUpdate(
        { name_normalized: normalized },
        {
            $setOnInsert: {
                full_name: fullName,
                name_normalized: normalized,
                district: district || null,
            },
            $set: {
                updated_at: new Date(),
            },
        },
        { upsert: true, new: true }
    );
};

const runPipeline1 = async ({ stateName = 'Munshiganj', maxPages = null, size = 10, forceRefresh = false } = {}) => {
    const syncLog = await SyncLog.create({
        pipeline_name: 'econtract_harvest',
        status: 'running',
        started_at: new Date(),
    });

    const startedMs = Date.now();
    let contractsScanned = 0;
    let contractsNew = 0;
    let contractsUpdated = 0;
    let pagesScraped = 0;
    const errors = [];
    let lastProcessedTenderId = null;

    try {
        // Step 1: Fetch first page to determine total contracts available
        logger.info('pipeline1_checking_total', { stateName });
        const firstPage = await requestContractsPage({ stateName, pageNo: 1, size });
        const totalPagesOnWebsite = firstPage.totalPages;

        // Correct total contracts calculation: go to last page and read last contract serial number
        const lastPage =
            totalPagesOnWebsite === 1
                ? firstPage
                : await requestContractsPage({
                    stateName,
                    pageNo: totalPagesOnWebsite,
                    size,
                });

        const lastRowSerialNumber = Math.max(
            ...lastPage.rows
                .map((row) => Number(row.serial_no))
                .filter((value) => Number.isFinite(value) && value > 0),
            0
        );

        const totalContractsOnWebsite =
            lastRowSerialNumber ||
            (totalPagesOnWebsite - 1) * size + (lastPage.rows?.length || 0);
        const totalContractsInDb = await Contract.countDocuments({ district: stateName });

        logger.info('pipeline1_count_check', {
            totalPagesOnWebsite,
            lastRowSerialNumber,
            totalContractsOnWebsite,
            totalContractsInDb,
            forceRefresh,
        });

        // Step 2: Skip if counts match and not forced
        if (totalContractsOnWebsite === totalContractsInDb && !forceRefresh) {
            logger.info('pipeline1_skipped', {
                reason: 'no_new_contracts',
                totalContractsOnWebsite,
                totalContractsInDb,
            });

            await SyncLog.findByIdAndUpdate(syncLog._id, {
                status: 'completed',
                completed_at: new Date(),
                duration_minutes: Math.round((Date.now() - startedMs) / 60000),
                reason: 'no_new_contracts',
                contracts_scanned: 0,
                contracts_new: 0,
                contracts_updated: 0,
                pages_scraped: 0,
                errors: [],
                error_count: 0,
            });

            return {
                success: true,
                contractsScanned: 0,
                contractsNew: 0,
                contractsUpdated: 0,
                pagesScraped: 0,
                errors: [],
                skipped: true,
                reason: 'no_new_contracts',
            };
        }

        // Step 3: Fetch all contracts from website and save them (list stage)
        logger.info('pipeline1_fetching_all_contracts', {
            stateName,
            totalPagesOnWebsite,
            totalContractsOnWebsite,
        });

        const pages = buildPageList(firstPage.totalPages, maxPages);
        let existingContractsSeen = 0;

        for (const pageNo of pages) {
            const pageResult =
                pageNo === 1
                    ? firstPage
                    : await requestContractsPage({ stateName, pageNo, size });

            pagesScraped += 1;
            contractsScanned += pageResult.rows.length;

            const existingSet = await getExistingTenderIdSet(
                pageResult.rows.map((row) => row.tender_id)
            );

            const newRows = filterNewRows(pageResult.rows, existingSet);
            existingContractsSeen += pageResult.rows.length - newRows.length;

            logger.info('pipeline1_page_fetched', {
                pageNo,
                rows: pageResult.rows.length,
                newRows: newRows.length,
            });

            // Fetch details only for missing contracts, then insert
            for (const row of newRows) {
                try {
                    const detail = await fetchDetailForRow(row);
                    const contractor = await upsertContractorFromName(
                        row.contractor_name,
                        row.district
                    );
                    const official = await upsertOfficialFromName(
                        detail?.official_name,
                        row.district
                    );

                    const payload = {
                        ...mapScrapedRowToContractPayload(row, detail),
                        contractor_id: contractor?._id || null,
                        official_id: official?._id || null,
                        last_synced_at: new Date(),
                    };

                    if (!payload.tender_id) {
                        throw new Error('Missing tender_id in payload');
                    }

                    await Contract.create(payload);
                    const isInserted = true;
                    if (isInserted) {
                        contractsNew += 1;
                    } else {
                        contractsUpdated += 1;
                    }
                    lastProcessedTenderId = row.tender_id;

                    logger.info('pipeline1_contract_detail_fetched', {
                        tender_id: row.tender_id,
                        inserted: isInserted,
                        updated: !isInserted,
                        contractsNew,
                        contractsUpdated,
                    });
                } catch (error) {
                    if (error?.code === 11000) {
                        // Duplicate tender_id created in parallel run/process. Skip safely.
                        contractsUpdated += 1;
                        continue;
                    }

                    errors.push(
                        `[page:${pageNo}] [tender:${row.tender_id || 'unknown'}] ${error.message}`
                    );
                }
            }

            logger.info('pipeline1_page_processed', {
                pageNo,
                rows: pageResult.rows.length,
                newRows: newRows.length,
                existingRows: pageResult.rows.length - newRows.length,
                contractsNew,
            });
        }

        logger.info('pipeline1_details_fetching_completed', {
            contractsNew,
            contractsUpdated,
            existingContractsSeen,
            errors: errors.length,
        });

        const durationMinutes = Math.round((Date.now() - startedMs) / 60000);

        await SyncLog.findByIdAndUpdate(syncLog._id, {
            status: errors.length ? 'partial' : 'completed',
            completed_at: new Date(),
            duration_minutes: durationMinutes,
            contracts_scanned: contractsScanned,
            contracts_new: contractsNew,
            contracts_updated: contractsUpdated,
            last_processed_tender_id: lastProcessedTenderId,
            pages_scraped: pagesScraped,
            errors,
            error_count: errors.length,
        });

        return {
            success: true,
            contractsScanned,
            contractsNew,
            contractsUpdated,
            pagesScraped,
            errors,
            skipped: false,
        };
    } catch (error) {
        const durationMinutes = Math.round((Date.now() - startedMs) / 60000);
        errors.push(error.message);

        await SyncLog.findByIdAndUpdate(syncLog._id, {
            status: 'failed',
            completed_at: new Date(),
            duration_minutes: durationMinutes,
            contracts_scanned: contractsScanned,
            contracts_new: contractsNew,
            contracts_updated: contractsUpdated,
            last_processed_tender_id: lastProcessedTenderId,
            pages_scraped: pagesScraped,
            errors,
            error_count: errors.length,
        });

        throw error;
    }
};

module.exports = {
    runPipeline1,
};
