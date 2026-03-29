const cron = require('node-cron');
const env = require('../config/env');
const Contract = require('../models/contract.model');
const SyncLog = require('../models/syncLog.model');
const { runPipeline2 } = require('../pipelines');
const logger = require('../utils/logger');

let weeklyStatusCheckRunning = false;

const getTotalContractsForStatusCheck = async (district) => {
    const totalContractsInDb = await Contract.countDocuments({ district });
    return { totalContractsInDb };
};

const shouldSkipStatusCheckForThisWeek = async (district) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const latestWeeklySync = await SyncLog.findOne({
        pipeline_name: 'experience_check',
        status: { $in: ['completed', 'partial'] },
        started_at: { $gte: weekAgo },
    })
        .sort({ started_at: -1 })
        .lean();

    if (!latestWeeklySync) {
        return { skip: false, reason: 'no_sync_in_last_week' };
    }

    const { totalContractsInDb } = await getTotalContractsForStatusCheck(district);
    const scanned = Number(latestWeeklySync.contracts_scanned) || 0;
    const skip = scanned >= totalContractsInDb;

    return {
        skip,
        reason: skip
            ? 'already_scanned_all_contracts_this_week'
            : 'contracts_remaining_for_status_check',
        scanned,
        totalContractsInDb,
        latestSyncStartedAt: latestWeeklySync.started_at,
    };
};

const runWeeklyStatusCheckIfNeeded = async (trigger) => {
    if (weeklyStatusCheckRunning) {
        logger.info('weekly_status_check_skipped', {
            trigger,
            reason: 'already_running',
        });
        return;
    }

    weeklyStatusCheckRunning = true;
    try {
        const district = env.autoStatusDistrict || env.autoHarvestStateName;
        const check = await shouldSkipStatusCheckForThisWeek(district);

        if (check.skip) {
            logger.info('weekly_status_check_skipped', {
                trigger,
                district,
                ...check,
            });
            return;
        }

        logger.info('weekly_status_check_triggered', {
            trigger,
            district,
            forceRefresh: false,
        });

        const result = await runPipeline2({
            district,
            forceRefresh: false,
            requestDelayMs: env.autoStatusDelayMs,
        });

        logger.info('weekly_status_check_finished', {
            trigger,
            district,
            ...result,
        });
    } catch (error) {
        logger.error('weekly_status_check_failed', {
            trigger,
            message: error.message,
            stack: error.stack,
        });
    } finally {
        weeklyStatusCheckRunning = false;
    }
};

const startWeeklyStatusScheduler = () => {
    runWeeklyStatusCheckIfNeeded('startup').catch((error) => {
        logger.error('weekly_status_check_failed', {
            trigger: 'startup',
            message: error.message,
            stack: error.stack,
        });
    });

    cron.schedule(
        env.autoStatusCron,
        () => {
            runWeeklyStatusCheckIfNeeded('cron').catch((error) => {
                logger.error('weekly_status_check_failed', {
                    trigger: 'cron',
                    message: error.message,
                    stack: error.stack,
                });
            });
        },
        { timezone: env.autoStatusTimezone }
    );

    logger.info('weekly_status_scheduler_started', {
        cron: env.autoStatusCron,
        timezone: env.autoStatusTimezone,
        district: env.autoStatusDistrict || env.autoHarvestStateName,
    });
};

module.exports = {
    startWeeklyStatusScheduler,
    runWeeklyStatusCheckIfNeeded,
};
