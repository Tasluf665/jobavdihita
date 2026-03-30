import { createSelector } from '@reduxjs/toolkit';

const selectContractorsState = (state) => state.contractors;

const formatBdt = (value = 0) => `৳ ${Math.round(Number(value || 0)).toLocaleString('en-US')}`;

const formatCompactBdt = (value = 0) => {
    if (!Number.isFinite(value)) {
        return '৳ 0';
    }

    const abs = Math.abs(value);

    if (abs >= 10_000_000) {
        return `৳ ${(value / 10_000_000).toFixed(2)} Cr`;
    }

    if (abs >= 100_000) {
        return `৳ ${(value / 100_000).toFixed(2)} L`;
    }

    return `৳ ${Math.round(value).toLocaleString('en-US')}`;
};

const formatDate = (value) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = date
        .toLocaleString('en-US', { month: 'short' })
        .toUpperCase();
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
};

const formatBdtCrOrL = (value = 0) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
        return `৳ ${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
        return `৳ ${(amount / 100000).toFixed(2)} L`;
    }

    return formatBdt(amount);
};

const toTitleCase = (value = '') =>
    value
        .split('_')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const riskScoreFromProfile = (profile, redFlags = []) => {
    const base =
        profile?.risk_level === 'high' ? 78 : profile?.risk_level === 'medium' ? 56 : profile?.risk_level === 'low' ? 30 : 48;

    const flagFactor = Math.min(22, Number(profile?.total_red_flags || redFlags.length || 0) * 2);
    return Math.max(0, Math.min(100, base + flagFactor));
};

const riskTagFromScore = (score) => {
    if (score >= 75) {
        return 'High Risk Detected';
    }
    if (score >= 50) {
        return 'Moderate Risk Detected';
    }
    return 'Low Risk Detected';
};

const toStatusMeta = (status) => {
    switch (status) {
        case 'completed':
            return { label: 'Completed', tone: 'completed' };
        case 'ongoing':
            return { label: 'Ongoing', tone: 'ongoing' };
        case 'overdue':
            return { label: 'Overdue', tone: 'overdue' };
        case 'ghost':
            return { label: 'Ghost Project', tone: 'ghost' };
        default:
            return { label: 'Pending Start', tone: 'pending' };
    }
};

const summarizeTimeline = (contract, redFlagsByTender) => {
    const physical = Number(contract?.work_status?.physical_progress_pct || 0);
    const financial = Number(contract?.work_status?.financial_progress_pct || 0);
    const daysOverdue = Number(contract?.days_overdue || 0);
    const hasImpossibleTimeline = (redFlagsByTender.get(contract.tender_id) || []).some(
        (flag) => flag.flag_type === 'impossible_timeline'
    );

    if (hasImpossibleTimeline) {
        return {
            timelinePct: 100,
            timelineLabel: 'Impossible Timeline',
            timelineTone: 'danger',
            auditStatus: 'Impossible Timeline',
            auditTone: 'danger',
        };
    }

    if (contract.computed_status === 'completed') {
        return {
            timelinePct: 100,
            timelineLabel: daysOverdue > 0 ? 'Completed (Delayed)' : 'Completed',
            timelineTone: 'success',
            auditStatus: daysOverdue > 0 ? 'Delayed Delivery' : 'Delivered',
            auditTone: daysOverdue > 0 ? 'danger' : 'success',
        };
    }

    if (daysOverdue > 0) {
        return {
            timelinePct: Math.max(10, Math.min(95, Math.round((daysOverdue / 365) * 100))),
            timelineLabel: `${Math.round((daysOverdue / 365) * 100)}% Overdue`,
            timelineTone: 'muted',
            auditStatus: 'Funds Disbursed',
            auditTone: 'danger',
        };
    }

    return {
        timelinePct: Math.max(physical, financial),
        timelineLabel: `${Math.round(physical)}% Physical / ${Math.round(financial)}% Financial`,
        timelineTone: 'success',
        auditStatus: 'In Progress',
        auditTone: 'success',
    };
};

const selectContractorViewModel = createSelector(selectContractorsState, (state) => {
    const profile = state.profile;
    const contracts = state.contracts || [];
    const redFlags = state.redFlags || [];

    if (!profile) {
        return {
            isLoading: state.isLoading,
            error: state.error,
            hasData: false,
            header: {
                breadcrumbs: ['Registry', 'Contractor Profile'],
                title: 'Contractor Insights',
                subtitle: 'Cross-referencing e-GP records with physical delivery audits. Forensic analysis of',
                subtitle2: "Munshiganj's procurement ecosystem.",
            },
            profile: null,
            scorecardItems: [],
            audit: { deliveredPct: 0, breachedPct: 0 },
            ledgerRows: [],
            dossierCards: [],
        };
    }

    const scoreValue = riskScoreFromProfile(profile, redFlags);
    const completionRate = Number(profile.stats?.completion_rate_pct || 0);
    const totalContracts = Number(profile.stats?.total_contracts || contracts.length || 0);
    const completedCount = Number(profile.stats?.completed_count || 0);
    const overdueCount = Number(profile.stats?.overdue_count || 0);
    const onTimeCount = Math.max(0, completedCount - overdueCount);
    const redFlagCount = Number(profile.total_red_flags || redFlags.length || 0);
    const redFlagsByTender = new Map();
    redFlags.forEach((flag) => {
        const key = String(flag.tender_id || '');
        if (!redFlagsByTender.has(key)) {
            redFlagsByTender.set(key, []);
        }
        redFlagsByTender.get(key).push(flag);
    });

    const ledgerRows = contracts.map((contract) => {
        const timelineSummary = summarizeTimeline(contract, redFlagsByTender);
        const { label, tone } = toStatusMeta(contract.computed_status);
        const daysOverdue = Number(contract.days_overdue || 0);
        const physical = Math.max(0, Math.min(100, Number(contract.work_status?.physical_progress_pct || 0)));
        const financial = Math.max(0, Math.min(100, Number(contract.work_status?.financial_progress_pct || 0)));
        const danger = contract.computed_status === 'ghost' || contract.computed_status === 'overdue';

        return {
            tenderId: String(contract.tender_id || '—'),
            projectName: contract.description || 'Untitled contract',
            value: formatCompactBdt(Number(contract.contract_value || 0)),
            dates: [
                `S: ${formatDate(contract.contract_start_date || contract.notification_date)}`,
                `E: ${formatDate(contract.contract_end_date)}`,
            ],
            physical,
            financial,
            overdueDays: daysOverdue > 0 ? `${daysOverdue} DAYS` : '—',
            status: label,
            statusTone: tone,
            danger,
            ...timelineSummary,
            evidenceUrl: `/projects/${contract.tender_id}`,
        };
    });

    const dossierCards = redFlags.slice(0, 3).map((flag) => ({
        title: flag.title || toTitleCase(flag.flag_type || 'red_flag'),
        body: [flag.description || 'Potential anomaly detected for this contractor.'],
        linkLabel: 'View Evidence',
        linkUrl: `/projects/${flag.tender_id}`,
    }));

    return {
        isLoading: state.isLoading,
        error: state.error,
        hasData: true,
        header: {
            breadcrumbs: ['Registry', 'Contractor Profile'],
            title: 'Contractor Insights',
            subtitle: 'Cross-referencing e-GP records with physical delivery audits. Forensic analysis of',
            subtitle2: "Munshiganj's procurement ecosystem.",
        },
        profile: {
            initial: String(profile.company_name || 'U').charAt(0).toUpperCase(),
            name: profile.company_name || 'Unknown Contractor',
            redFlags: redFlagCount,
            risk: {
                scoreLabel: 'Risk Index',
                scoreValue,
                completionRate: `${Math.round(completionRate)}%`,
                unverifiedPayments: formatBdt(profile.stats?.total_unverified_payments || 0),
                tag: riskTagFromScore(scoreValue),
            },
        },
        scorecardItems: [
            { label: 'Contracts Won', value: String(totalContracts).padStart(2, '0') },
            { label: 'Total Value', value: formatCompactBdt(profile.stats?.total_contract_value || 0) },
            { label: 'Completed', value: String(completedCount).padStart(2, '0'), tone: 'success' },
            {
                label: 'On-time',
                value: completedCount ? `${Math.round((onTimeCount / completedCount) * 100)}%` : '0%',
            },
            { label: 'Failed', value: String(overdueCount).padStart(2, '0'), tone: 'danger' },
            { label: 'Red Flags', value: String(redFlagCount).padStart(2, '0'), tone: 'danger' },
        ],
        ledgerPagination: {
            page: Number(state.contractPagination?.page || state.page || 1),
            total: Number(state.contractPagination?.total || 0),
            totalPages: Number(
                state.contractPagination?.total_pages ||
                Math.max(
                    1,
                    Math.ceil(
                        Number(state.contractPagination?.total || ledgerRows.length || 0) /
                        Number(state.contractPagination?.limit || state.limit || 10)
                    )
                )
            ),
            shownStart: ledgerRows.length
                ? (Number(state.contractPagination?.page || state.page || 1) - 1) *
                Number(state.contractPagination?.limit || state.limit || 10) +
                1
                : 0,
            shownEnd: ledgerRows.length
                ? (Number(state.contractPagination?.page || state.page || 1) - 1) *
                Number(state.contractPagination?.limit || state.limit || 10) +
                ledgerRows.length
                : 0,
        },
        audit: {
            deliveredPct: Math.max(0, Math.min(100, Math.round(completionRate))),
            breachedPct: Math.max(0, Math.min(100, 100 - Math.round(completionRate))),
        },
        ledgerRows,
        dossierCards,
    };
});

export { selectContractorViewModel };
