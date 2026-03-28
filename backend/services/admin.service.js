const SyncLog = require('../models/syncLog.model');
const Contract = require('../models/contract.model');
const Contractor = require('../models/contractor.model');
const Official = require('../models/official.model');
const StatusHistory = require('../models/statusHistory.model');
const FieldReport = require('../models/fieldReport.model');
const District = require('../models/district.model');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

const listSyncLogs = async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const filter = {
        ...(query.pipeline_name ? { pipeline_name: query.pipeline_name } : {}),
        ...(query.status ? { status: query.status } : {}),
    };

    const [items, total] = await Promise.all([
        SyncLog.find(filter)
            .sort({ started_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        SyncLog.countDocuments(filter),
    ]);

    return {
        items,
        pagination: buildPaginationMeta({ total, page, limit }),
    };
};

const getLatestSyncLogs = async () => {
    const pipelineNames = ['econtract_harvest', 'experience_check', 'red_flag_detector'];
    const docs = await Promise.all(
        pipelineNames.map((name) =>
            SyncLog.findOne({ pipeline_name: name }).sort({ started_at: -1 }).lean()
        )
    );

    return {
        econtract_harvest: docs[0],
        experience_check: docs[1],
        red_flag_detector: docs[2],
    };
};

const getSyncLogById = async (id) => SyncLog.findById(id).lean();

const triggerJob = async (pipelineName) => ({
    queued: true,
    pipeline_name: pipelineName,
    message: 'Pipeline trigger acknowledged. Integrate this with jobs queue.',
});

const getDbStats = async () => {
    const [
        contractsCount,
        contractorsCount,
        officialsCount,
        statusHistoryCount,
        fieldReportsCount,
        syncLogsCount,
        districtsCount,
        lastContract,
        lastStatusSync,
        lastContractor,
        lastOfficial,
    ] = await Promise.all([
        Contract.countDocuments(),
        Contractor.countDocuments(),
        Official.countDocuments(),
        StatusHistory.countDocuments(),
        FieldReport.countDocuments(),
        SyncLog.countDocuments(),
        District.countDocuments(),
        Contract.findOne().sort({ fetched_at: -1 }).select('fetched_at').lean(),
        Contract.findOne().sort({ last_synced_at: -1 }).select('last_synced_at').lean(),
        Contractor.findOne().sort({ updated_at: -1 }).select('updated_at').lean(),
        Official.findOne().sort({ updated_at: -1 }).select('updated_at').lean(),
    ]);

    return {
        collections: {
            contracts: contractsCount,
            contractors: contractorsCount,
            officials: officialsCount,
            status_history: statusHistoryCount,
            field_reports: fieldReportsCount,
            sync_logs: syncLogsCount,
            districts: districtsCount,
        },
        last_fetched_at: lastContract?.fetched_at || null,
        last_last_synced_at: lastStatusSync?.last_synced_at || null,
        contractors_last_updated_at: lastContractor?.updated_at || null,
        officials_last_updated_at: lastOfficial?.updated_at || null,
    };
};

module.exports = {
    listSyncLogs,
    getLatestSyncLogs,
    getSyncLogById,
    triggerJob,
    getDbStats,
};
