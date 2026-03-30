import { useCallback, useEffect, useMemo, useState } from 'react';
import moneyApi from '../services/moneyApi';

const START_YEAR = 2017;

const formatBdt = (value = 0) => `৳ ${Math.round(Number(value || 0)).toLocaleString('en-IN')}`;
const formatCrore = (value = 0) => `৳ ${(Number(value || 0) / 10_000_000).toFixed(2)} Cr`;
const formatCroreCompact = (value = 0) => {
    const crore = Number(value || 0) / 10_000_000;
    if (crore >= 1000) {
        return `৳ ${Math.round(crore).toLocaleString('en-US')} Cr`;
    }

    return `৳ ${crore.toFixed(2)} Cr`;
};
const clampPercent = (value = 0) => Math.max(0, Math.min(100, Number(value || 0)));
const toWholePercent = (value = 0) => Math.round(clampPercent(value));

const toTitle = (value = '') =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const pickTopAlerts = (alerts = []) =>
    alerts.slice(0, 4).map((item) => item?.title || item?.flag_type || 'Transparency update available');

const normalizeSummary = (summary) => {
    const deliveredPct = clampPercent(summary?.delivered_pct);
    const ongoingPct = clampPercent(summary?.ongoing_pct);
    const notStartedPct = clampPercent(summary?.not_started_pct);
    const unverifiedPct = clampPercent(summary?.unverified_pct);
    const ratioTotal = deliveredPct + ongoingPct + notStartedPct + unverifiedPct || 1;

    return {
        totalAmount: formatBdt(summary?.total_allocated || 0),
        stats: [
            {
                label: 'Delivered',
                value: formatCrore(summary?.total_delivered || 0),
                meta: `${deliveredPct.toFixed(1)}% Verified`,
                color: 'var(--success)',
            },
            {
                label: 'Ongoing',
                value: formatCrore(summary?.total_ongoing || 0),
                meta: `${ongoingPct.toFixed(1)}% In Pipeline`,
                color: '#f59e0b',
            },
            {
                label: 'Not Started',
                value: formatCrore(summary?.total_not_started || 0),
                meta: `${notStartedPct.toFixed(1)}% Pending Kickoff`,
                color: '#0d6efd',
            },
            {
                label: 'Unverified',
                value: formatCrore(summary?.total_unverified || 0),
                meta: `${unverifiedPct.toFixed(1)}% Risk Exposure`,
                color: 'var(--danger)',
            },
        ],
        segments: [
            { label: 'Delivered', width: (deliveredPct / ratioTotal) * 100, color: 'var(--success)' },
            { label: 'Ongoing', width: (ongoingPct / ratioTotal) * 100, color: '#f59e0b' },
            { label: 'Not Started', width: (notStartedPct / ratioTotal) * 100, color: '#0d6efd' },
            { label: 'Unverified', width: (unverifiedPct / ratioTotal) * 100, color: 'var(--danger)' },
        ],
        note: `${formatBdt(summary?.total_unverified || 0)} unverified exposure`,
        riskRatio: toWholePercent(unverifiedPct),
        riskLegend: [
            { label: 'Delivered', value: toWholePercent(deliveredPct), color: 'var(--success)' },
            { label: 'Ongoing', value: toWholePercent(ongoingPct), color: '#f59e0b' },
            { label: 'Not Started', value: toWholePercent(notStartedPct), color: '#0d6efd' },
            { label: 'Unverified', value: toWholePercent(unverifiedPct), color: 'var(--danger)' },
        ],
    };
};

const normalizeYearlyBars = (rows = []) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - START_YEAR + 1 }, (_, index) => START_YEAR + index);
    const byYear = new Map(rows.map((row) => [Number(row?.year ?? row?._id), row]));

    const merged = years.map((year) => {
        const row = byYear.get(year);
        return {
            year,
            allocated: Number(row?.total_allocated || 0),
            delivered: Number(row?.delivered_amount || 0),
            ongoing: Number(row?.ongoing_amount || 0),
            notStarted: Number(row?.not_started_amount || 0),
            unverified: Number(row?.unverified_amount || 0),
        };
    });

    const peakAllocated = Math.max(...merged.map((row) => row.allocated), 1);

    const bars = merged.map((row) => {
        const allocatedHeight = Math.max(2, (row.allocated / peakAllocated) * 100);
        const deliveredRatio = row.allocated ? row.delivered / row.allocated : 0;
        const ongoingRatio = row.allocated ? row.ongoing / row.allocated : 0;

        const deliveredHeight = Math.max(0, allocatedHeight * deliveredRatio);
        const ongoingHeight = Math.max(0, allocatedHeight * ongoingRatio);
        const gapHeight = Math.max(0, allocatedHeight - deliveredHeight - ongoingHeight);

        return {
            year: String(row.year),
            allocatedHeight,
            deliveredHeight,
            ongoingHeight,
            gapHeight,
            allocatedLabel: formatCroreCompact(row.allocated),
            tooltip: [
                `Year: ${row.year}`,
                `Allocated: ${formatBdt(row.allocated)}`,
                `Delivered: ${formatBdt(row.delivered)}`,
                `Ongoing: ${formatBdt(row.ongoing)}`,
                `Not Started: ${formatBdt(row.notStarted)}`,
                `Unverified: ${formatBdt(row.unverified)}`,
            ].join(' | '),
            unverifiedRatio: row.allocated ? row.unverified / row.allocated : 0,
        };
    });

    const anomaly = bars.reduce(
        (acc, bar) => (bar.unverifiedRatio > acc.unverifiedRatio ? bar : acc),
        { year: String(currentYear), unverifiedRatio: 0 }
    );

    return {
        bars: bars.map((bar) => ({
            ...bar,
            isAnomaly: bar.year === anomaly.year,
        })),
        anomalyMessage:
            anomaly.unverifiedRatio > 0
                ? `${anomaly.year} represents the fiscal peak for unverified spending, with over ${Math.round(anomaly.unverifiedRatio * 100)}% of allocated capital currently lacking verified delivery documentation. Immediate audit suggested.`
                : 'No high-severity anomaly detected in the selected audit window.',
    };
};

const normalizeFundingSources = (sources = []) =>
    sources.slice(0, 8).map((source) => ({
        title: toTitle(source?.funding_source || 'Unknown Source'),
        amount: formatCrore(source?.total_allocated || 0),
        contracts: Number(source?.total_contracts || 0).toLocaleString('en-US'),
        completed: Number(source?.completed_count || 0).toLocaleString('en-US'),
        overdue: Number(source?.overdue_count || 0).toLocaleString('en-US'),
        deliveryRate: clampPercent(source?.delivery_rate_pct || 0),
    }));

const createInitialState = () => ({
    district: 'Munshiganj',
    alerts: ['No active alerts currently'],
    isLoading: true,
    error: null,
    hasData: false,
    summary: {
        totalAmount: formatBdt(0),
        stats: [],
        segments: [],
        note: '৳ 0 unverified exposure',
    },
    riskRatio: 0,
    riskLegend: [],
    yearlyBars: [],
    anomalyMessage: 'No high-severity anomaly detected in the selected audit window.',
    fundingSources: [],
});

function useMoneyTracker(district = 'Munshiganj') {
    const [state, setState] = useState(createInitialState);

    const load = useCallback(async () => {
        setState((prev) => ({ ...prev, district, isLoading: true, error: null }));

        try {
            const [summary, yearlySpending, fundingSources, alerts] = await Promise.all([
                moneyApi.fetchMoneySummary(district),
                moneyApi.fetchYearlySpending({ district, fromYear: START_YEAR }),
                moneyApi.fetchFundingSources(district),
                moneyApi.fetchTopAlerts({ district, limit: 10 }),
            ]);

            const summaryView = normalizeSummary(summary);
            const yearlyView = normalizeYearlyBars(yearlySpending);

            setState({
                district,
                alerts: pickTopAlerts(alerts),
                isLoading: false,
                error: null,
                hasData: true,
                summary: {
                    totalAmount: summaryView.totalAmount,
                    stats: summaryView.stats,
                    segments: summaryView.segments,
                    note: summaryView.note,
                },
                riskRatio: summaryView.riskRatio,
                riskLegend: summaryView.riskLegend,
                yearlyBars: yearlyView.bars,
                anomalyMessage: yearlyView.anomalyMessage,
                fundingSources: normalizeFundingSources(fundingSources),
            });
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: error?.message || 'Failed to load money tracker data',
            }));
        }
    }, [district]);

    useEffect(() => {
        load();
    }, [load]);

    return useMemo(
        () => ({
            ...state,
            reload: load,
        }),
        [state, load]
    );
}

export default useMoneyTracker;
