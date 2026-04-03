import { createSelector } from '@reduxjs/toolkit';

const selectDashboardState = (state) => state.dashboard;

const formatCompactBdt = (value = 0) => {
    if (!Number.isFinite(value)) {
        return '৳ 0';
    }

    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) {
        return `৳ ${(value / 1_000_000_000).toFixed(2)} Billion`;
    }
    if (abs >= 1_000_000) {
        return `৳ ${(value / 1_000_000).toFixed(2)} Million`;
    }

    return `৳ ${Math.round(value).toLocaleString('en-US')}`;
};

const getYearValue = (row = {}) => {
    const raw = row.year ?? row._id;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const selectHeroStats = createSelector(selectDashboardState, (dashboard) => {
    const stats = dashboard.stats;
    const overdueCount = Number(stats?.overdue_count || 0);

    if (!stats) {
        return [];
    }

    return [
        {
            icon: '📊',
            title: 'Total Projects',
            value: Number(stats.total_contracts || 0).toLocaleString('en-US'),
            trend: `${Math.round(stats.completed_pct || 0)}% completed`,
            trendColor: 'var(--success)',
            iconBg: '#e9f1ff',
        },
        {
            icon: '✅',
            title: 'Completed',
            value: Number(stats.completed_count || 0).toLocaleString('en-US'),
            trend: 'Verified',
            trendColor: 'var(--success)',
            iconBg: '#e8f7ef',
        },
        {
            icon: '⏱️',
            title: 'Overdue Projects',
            value: overdueCount.toLocaleString('en-US'),
            trend: `${Math.round(stats.overdue_pct || 0)}% of total`,
            trendColor: overdueCount > 0 ? 'var(--danger)' : 'var(--success)',
            iconBg: '#fdeeee',
        },
    ];
});

const selectAlertItems = createSelector(selectDashboardState, (dashboard) => {
    if (!dashboard.alerts.length) {
        return ['No active alerts currently'];
    }

    return dashboard.alerts.slice(0, 3).map((alert) => alert.title || alert.flag_type || 'Alert');
});

const selectBudgetSummary = createSelector(selectDashboardState, (dashboard) => {
    const summary = dashboard.moneySummary;
    const stats = dashboard.stats;
    const breakdown = dashboard.statusBreakdown || [];

    if (!summary || !stats) {
        return null;
    }

    const findPct = (status) => {
        const row = breakdown.find((item) => item.status === status);
        return Math.max(0, Math.round(row?.percentage || 0));
    };

    const completedPctFromBreakdown = findPct('completed');
    const ongoingPctFromBreakdown = findPct('ongoing');
    const ghostPctFromBreakdown = findPct('ghost');
    const overduePctFromBreakdown = findPct('overdue');

    const totalContracts = Number(stats.total_contracts || 0);
    const ghostPctFromStats = totalContracts
        ? Math.round((Number(stats.ghost_count || 0) / totalContracts) * 100)
        : 0;
    const overduePctFromStats = Math.round(stats.overdue_pct || 0);

    const completedPct = completedPctFromBreakdown || Math.round(stats.completed_pct || 0);
    const ongoingPct = ongoingPctFromBreakdown;
    const riskPct = ghostPctFromBreakdown + overduePctFromBreakdown || ghostPctFromStats + overduePctFromStats;

    const normalizedOngoing = Math.max(0, Math.min(100, ongoingPct || 100 - completedPct - riskPct));
    const normalizedRisk = Math.max(0, Math.min(100, 100 - completedPct - normalizedOngoing));

    const completedLabelPct = completedPct;
    const ongoingLabelPct = normalizedOngoing;
    const riskLabelPct = normalizedRisk;

    return {
        totalUtilized: formatCompactBdt(summary.total_allocated),
        segments: [
            {
                label: `Completed (${completedLabelPct}%)`,
                width: completedPct,
                color: 'var(--success)',
            },
            {
                label: `Ongoing (${ongoingLabelPct}%)`,
                width: normalizedOngoing,
                color: 'var(--info)',
            },
            {
                label: `Ghost/Overdue (${riskLabelPct}%)`,
                width: normalizedRisk,
                color: 'var(--danger)',
            },
        ],
    };
});

const selectCriticalPreview = createSelector(selectDashboardState, (dashboard) =>
    dashboard.criticalFlags.slice(0, 2).map((flag) => ({
        tenderId: flag.tender_id,
        title: flag.description || `Project #${flag.tender_id}`,
        description: `${flag.flag_title || 'Critical issue'}${flag.contractor_name ? ` — ${flag.contractor_name}` : ''}`,
    }))
);

const selectRecentCompletions = createSelector(selectDashboardState, (dashboard) => {
    const completed = dashboard.recentActivity.filter((row) => row.computed_status === 'completed');
    const source = completed.length ? completed : dashboard.recentActivity;

    return source.slice(0, 2).map((row) => ({
        tenderId: row.tender_id,
        title: row.description || `Project #${row.tender_id}`,
        description: `Tender #${row.tender_id}`,
    }));
});

const selectYearlyAudit = createSelector(selectDashboardState, (dashboard) =>
    dashboard.yearlySpending.map((row) => {
        const total = row.total_allocated || 1;
        const deliveredPct = Math.round(((row.delivered_amount || 0) / total) * 100);
        const ongoingPct = Math.round(((row.ongoing_amount || 0) / total) * 100);
        const gapPct = Math.round(((row.unverified_amount || 0) / total) * 100);
        const year = getYearValue(row);

        return {
            year,
            value: formatCompactBdt(row.total_allocated),
            allocated: 10 + Math.min(90, Math.round(Math.log10(total + 1) * 18)),
            delivered: deliveredPct,
            ongoing: ongoingPct,
            gap: gapPct > 0,
        };
    })
        .sort((a, b) => (a.year || 0) - (b.year || 0))
);

const selectDashboardViewModel = createSelector(
    selectDashboardState,
    selectHeroStats,
    selectAlertItems,
    selectBudgetSummary,
    selectCriticalPreview,
    selectRecentCompletions,
    selectYearlyAudit,
    (dashboard, heroStats, alerts, budget, redFlags, recentCompletions, yearlyAudit) => ({
        district: dashboard.district,
        isLoading: dashboard.isLoading,
        error: dashboard.error,
        heroStats,
        alerts,
        budget,
        redFlags,
        recentCompletions,
        yearlyAudit,
    })
);

export { selectDashboardViewModel };
