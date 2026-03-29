const Contract = require('../../models/contract.model');
const StatusHistory = require('../../models/statusHistory.model');
const SyncLog = require('../../models/syncLog.model');
const logger = require('../../utils/logger');
const { fetchExperienceByTenderId } = require('./experienceFetcher');
const { classifyStatus } = require('./statusClassifier');
const { detectStatusChange } = require('./changeDetector');
const { waitForNextRequest } = require('./rateLimiter');
const { refreshEntityStats } = require('../../services/statsRefresh.service');

const getWeekNumber = (date = new Date()) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const buildPipeline2RedFlags = ({
    existingFlags = [],
    computedStatus,
    paymentGapPct,
    daysOverdue = 0,
    completedOnTime = null,
    physicalProgressPct = null,
}) => {
    const preservedFlags = existingFlags.filter(
        (flag) =>
            !['payment_gap', 'ghost_project', 'impossible_timeline'].includes(
                flag.flag_type
            )
    );

    const generatedFlags = [];
    const normalizedGap = Number.isFinite(paymentGapPct) ? paymentGapPct : 0;
    const normalizedDaysOverdue = Number.isFinite(daysOverdue) ? daysOverdue : 0;

    if (normalizedGap >= 20) {
        generatedFlags.push({
            flag_type: 'payment_gap',
            severity: normalizedGap >= 35 ? 'critical' : 'warning',
            title: 'Large payment-progress gap',
            description:
                'Financial progress is significantly higher than physical progress.',
            evidence: {
                payment_gap_pct: normalizedGap,
            },
            detected_at: new Date(),
        });
    }

    if (computedStatus === 'overdue' && normalizedDaysOverdue > 0) {
        generatedFlags.push({
            flag_type: 'impossible_timeline',
            severity: normalizedDaysOverdue >= 30 ? 'critical' : 'warning',
            title: 'Project duration exceeded contract timeline',
            description:
                'Project is still not completed after the contract end date.',
            evidence: {
                computed_status: computedStatus,
                days_overdue: normalizedDaysOverdue,
            },
            detected_at: new Date(),
        });
    }

    if (computedStatus === 'completed' && completedOnTime === false) {
        generatedFlags.push({
            flag_type: 'impossible_timeline',
            severity: normalizedDaysOverdue >= 30 ? 'critical' : 'warning',
            title: 'Completed after contract deadline',
            description:
                'Project completion happened after the contractual end date.',
            evidence: {
                computed_status: computedStatus,
                days_overdue: normalizedDaysOverdue,
                completed_on_time: completedOnTime,
            },
            detected_at: new Date(),
        });
    }

    if (computedStatus === 'ghost') {
        generatedFlags.push({
            flag_type: 'ghost_project',
            severity: 'critical',
            title: 'Potential ghost project',
            description:
                'Project appears overdue with near-zero physical progress.',
            evidence: {
                computed_status: computedStatus,
                days_overdue: normalizedDaysOverdue,
                physical_progress_pct: Number.isFinite(physicalProgressPct)
                    ? physicalProgressPct
                    : null,
            },
            detected_at: new Date(),
        });
    }

    return [...preservedFlags, ...generatedFlags];
};

const processSingleContractStatus = async ({ contract, now = new Date() }) => {
    if (!contract || !contract._id || !contract.tender_id) {
        throw new Error('Invalid contract payload for status processing');
    }

    const experience = await fetchExperienceByTenderId(contract.tender_id);

    const {
        computed_status: computedStatus,
        days_overdue: daysOverdue,
        completed_on_time: completedOnTime,
    } = classifyStatus({
        experience,
        contractEndDate: contract.contract_end_date,
        now,
    });

    const physicalPct = Number(experience.physical_progress_pct);
    const financialPct = Number(experience.financial_progress_pct);
    const paymentGapPct =
        Number.isFinite(financialPct) && Number.isFinite(physicalPct)
            ? Math.max(0, financialPct - physicalPct)
            : 0;

    const nextWorkStatus = {
        status_label:
            experience.status_label || (experience.found ? 'Available' : 'Not Found'),
        physical_progress_pct: Number.isFinite(physicalPct) ? physicalPct : null,
        financial_progress_pct: Number.isFinite(financialPct) ? financialPct : null,
        payment_gap_pct: paymentGapPct,
        has_payment_gap_flag: paymentGapPct >= 20,
        latest_milestone_date: experience.latest_milestone_date || null,
        completion_certificate: Boolean(experience.completion_certificate),
        checked_at: now,
    };

    const change = detectStatusChange({
        contract,
        nextWorkStatus,
        nextComputedStatus: computedStatus,
    });

    const updatedRedFlags = buildPipeline2RedFlags({
        existingFlags: contract.red_flags || [],
        computedStatus,
        paymentGapPct,
        daysOverdue,
        completedOnTime,
        physicalProgressPct: Number.isFinite(physicalPct) ? physicalPct : null,
    });

    const updatePayload = {
        work_status: nextWorkStatus,
        computed_status: computedStatus,
        days_overdue: daysOverdue,
        red_flags: updatedRedFlags,
        last_synced_at: now,
    };

    if (!contract.contract_start_date && experience.contract_start_date) {
        updatePayload.contract_start_date = experience.contract_start_date;
    }
    if (!contract.contract_end_date && experience.contract_end_date) {
        updatePayload.contract_end_date = experience.contract_end_date;
    }

    await Contract.updateOne({ _id: contract._id }, { $set: updatePayload });

    await StatusHistory.create({
        contract_id: contract._id,
        tender_id: contract.tender_id,
        checked_at: now,
        week_number: getWeekNumber(now),
        previous_status: change.previous_status,
        new_status: change.new_status,
        previous_physical_pct: change.previous_physical_pct,
        new_physical_pct: change.new_physical_pct,
        previous_financial_pct: change.previous_financial_pct,
        new_financial_pct: change.new_financial_pct,
        changed: change.changed,
        change_summary: change.change_summary,
    });

    logger.info('pipeline2_contract_checked', {
        tender_id: contract.tender_id,
        computed_status: computedStatus,
        changed: change.changed,
    });

    return {
        tender_id: contract.tender_id,
        computed_status: computedStatus,
        changed: change.changed,
        updatePayload,
        change,
    };
};

const runPipeline2 = async ({
    district = 'Munshiganj',
    limit = null,
    requestDelayMs = 1200,
    forceRefresh = false,
} = {}) => {
    const syncLog = await SyncLog.create({
        pipeline_name: 'experience_check',
        status: 'running',
        started_at: new Date(),
    });

    const startedMs = Date.now();
    const errors = [];
    let contractsScanned = 0;
    let contractsUpdated = 0;
    let changesLogged = 0;
    let lastProcessedTenderId = null;

    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const query = { district };
        const batchSize = 100;
        let lastSeenId = null;

        if (!forceRefresh) {
            query.$or = [
                { 'work_status.checked_at': { $exists: false } },
                { 'work_status.checked_at': null },
                { 'work_status.checked_at': { $lt: weekAgo } },
            ];
        }

        while (true) {
            if (limit && contractsScanned >= limit) {
                break;
            }

            const batchQuery = { ...query };
            if (lastSeenId) {
                batchQuery._id = { $gt: lastSeenId };
            }

            const remaining = limit ? Math.max(0, limit - contractsScanned) : batchSize;
            const currentLimit = Math.min(batchSize, remaining || batchSize);

            const contracts = await Contract.find(batchQuery)
                .sort({ _id: 1 })
                .limit(currentLimit)
                .lean();

            if (!contracts.length) {
                break;
            }

            for (const contract of contracts) {
                contractsScanned += 1;
                lastProcessedTenderId = contract.tender_id;

                try {
                    const result = await processSingleContractStatus({ contract, now: new Date() });
                    contractsUpdated += 1;

                    if (result.changed) {
                        changesLogged += 1;
                    }
                } catch (error) {
                    errors.push(
                        `[tender:${contract.tender_id || 'unknown'}] ${error.message}`
                    );
                }

                await waitForNextRequest(requestDelayMs);

                if (limit && contractsScanned >= limit) {
                    break;
                }
            }

            lastSeenId = contracts[contracts.length - 1]._id;
        }

        const statsRefresh = await refreshEntityStats({ district });
        logger.info('pipeline2_stats_refreshed', {
            district,
            ...statsRefresh,
        });

        const durationMinutes = Math.round((Date.now() - startedMs) / 60000);
        await SyncLog.findByIdAndUpdate(syncLog._id, {
            status: errors.length ? 'partial' : 'completed',
            completed_at: new Date(),
            duration_minutes: durationMinutes,
            contracts_scanned: contractsScanned,
            contracts_updated: contractsUpdated,
            contracts_new: 0,
            last_processed_tender_id: lastProcessedTenderId,
            pages_scraped: 0,
            errors,
            error_count: errors.length,
        });

        return {
            success: true,
            contractsScanned,
            contractsUpdated,
            changesLogged,
            errors,
        };
    } catch (error) {
        const durationMinutes = Math.round((Date.now() - startedMs) / 60000);
        errors.push(error.message);

        await SyncLog.findByIdAndUpdate(syncLog._id, {
            status: 'failed',
            completed_at: new Date(),
            duration_minutes: durationMinutes,
            contracts_scanned: contractsScanned,
            contracts_updated: contractsUpdated,
            contracts_new: 0,
            last_processed_tender_id: lastProcessedTenderId,
            pages_scraped: 0,
            errors,
            error_count: errors.length,
        });

        throw error;
    }
};

module.exports = {
    runPipeline2,
    processSingleContractStatus,
    buildPipeline2RedFlags,
};

