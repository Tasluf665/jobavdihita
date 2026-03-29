const cron = require('node-cron');
const env = require('../config/env');
const { runPipeline1 } = require('../pipelines');
const SyncLog = require('../models/syncLog.model');
const { requestContractsPage } = require('../pipelines/pipeline1/searchRequester');
const logger = require('../utils/logger');

const HARVEST_PAGE_SIZE = 10;
let weeklyHarvestRunning = false;

const getWebsiteTotalContracts = async (stateName) => {
    const firstPage = await requestContractsPage({
        stateName,
        pageNo: 1,
        size: HARVEST_PAGE_SIZE,
    });

    const totalPagesOnWebsite = Number(firstPage.totalPages) || 1;
    const lastPage =
        totalPagesOnWebsite === 1
            ? firstPage
            : await requestContractsPage({
                stateName,
                pageNo: totalPagesOnWebsite,
                size: HARVEST_PAGE_SIZE,
            });

    const lastRowSerialNumber = Math.max(
        ...lastPage.rows
            .map((row) => Number(row.serial_no))
            .filter((value) => Number.isFinite(value) && value > 0),
        0
    );

    const totalContractsOnWebsite =
        lastRowSerialNumber ||
        (totalPagesOnWebsite - 1) * HARVEST_PAGE_SIZE + (lastPage.rows?.length || 0);

    return {
        totalContractsOnWebsite,
        totalPagesOnWebsite,
        lastRowSerialNumber,
    };
};

const shouldSkipHarvestForThisWeek = async (stateName) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const latestWeeklySync = await SyncLog.findOne({
        pipeline_name: 'econtract_harvest',
        status: { $in: ['completed', 'partial'] },
        started_at: { $gte: weekAgo },
    })
        .sort({ started_at: -1 })
        .lean();

    console.log("Latest Weekly Sync:", latestWeeklySync);

    if (!latestWeeklySync) {
        return { skip: false, reason: 'no_sync_in_last_week' };
    }

    const {
        totalContractsOnWebsite,
        totalPagesOnWebsite,
        lastRowSerialNumber,
    } = await getWebsiteTotalContracts(stateName);

    const scanned = Number(latestWeeklySync.contracts_scanned) || 0;
    const skip = scanned === totalContractsOnWebsite;

    console.log("Harvest Check - Scanned:", scanned, "Total on Website:", totalContractsOnWebsite, "Skip:", skip);

    return {
        skip,
        reason: skip
            ? 'already_scanned_full_website_this_week'
            : 'website_has_more_contracts',
        scanned,
        totalContractsOnWebsite,
        totalPagesOnWebsite,
        lastRowSerialNumber,
        latestSyncStartedAt: latestWeeklySync.started_at,
    };
};

const runWeeklyHarvestIfNeeded = async (trigger) => {
    if (weeklyHarvestRunning) {
        logger.info('weekly_harvest_skipped', {
            trigger,
            reason: 'already_running',
        });
        return;
    }

    weeklyHarvestRunning = true;
    try {
        const check = await shouldSkipHarvestForThisWeek(env.autoHarvestStateName);
        if (check.skip) {
            logger.info('weekly_harvest_skipped', {
                trigger,
                ...check,
            });
            return;
        }

        logger.info('weekly_harvest_triggered', {
            trigger,
            stateName: env.autoHarvestStateName,
            forceRefresh: false,
        });

        const result = await runPipeline1({
            stateName: env.autoHarvestStateName,
            forceRefresh: false,
            size: HARVEST_PAGE_SIZE,
        });

        logger.info('weekly_harvest_finished', {
            trigger,
            ...result,
        });
    } catch (error) {
        logger.error('weekly_harvest_failed', {
            trigger,
            message: error.message,
            stack: error.stack,
        });
    } finally {
        weeklyHarvestRunning = false;
    }
};

const startWeeklyHarvestScheduler = () => {
    runWeeklyHarvestIfNeeded('startup').catch((error) => {
        logger.error('weekly_harvest_failed', {
            trigger: 'startup',
            message: error.message,
            stack: error.stack,
        });
    });

    cron.schedule(
        env.autoHarvestCron,
        () => {
            runWeeklyHarvestIfNeeded('cron').catch((error) => {
                logger.error('weekly_harvest_failed', {
                    trigger: 'cron',
                    message: error.message,
                    stack: error.stack,
                });
            });
        },
        { timezone: env.autoHarvestTimezone }
    );

    logger.info('weekly_harvest_scheduler_started', {
        cron: env.autoHarvestCron,
        timezone: env.autoHarvestTimezone,
        stateName: env.autoHarvestStateName,
    });
};

module.exports = {
    startWeeklyHarvestScheduler,
    runWeeklyHarvestIfNeeded,
};
