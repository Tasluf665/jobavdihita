import { createSelector } from '@reduxjs/toolkit';

const selectRedFlagsState = (state) => state.redFlags;

const formatBdt = (value = 0) => `৳${Math.round(Number(value || 0)).toLocaleString('en-US')}`;

const formatShortDate = (value) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

const selectCounterCards = createSelector(selectRedFlagsState, (redFlags) => {
    const summary = redFlags.summary || {};
    const totalFlags = Object.values(summary).reduce((sum, count) => sum + Number(count || 0), 0);
    const ghostCount = Number(summary.ghost_project || 0);
    const impossibleCount = Number(summary.impossible_timeline || 0);
    const repeatWinnerCount = Number(redFlags.repeatWinnerItems?.length || 0);

    const ghostPct = totalFlags ? Math.round((ghostCount / totalFlags) * 1000) / 10 : 0;
    const impossiblePct = totalFlags ? Math.round((impossibleCount / totalFlags) * 1000) / 10 : 0;

    return [
        {
            label: 'Total Flags',
            value: String(totalFlags),
            helper: `${ghostCount + impossibleCount} high-priority signals`,
            tone: 'danger',
        },
        {
            label: 'Ghost Projects',
            value: String(ghostCount),
            helper: `${ghostPct}% of flagged contracts`,
            tone: 'blue',
        },
        {
            label: 'Impossible Timelines',
            value: String(impossibleCount),
            helper: `${impossiblePct}% of flagged contracts`,
            tone: 'green',
        },
        {
            label: 'Repeat Winners',
            value: String(repeatWinnerCount).padStart(2, '0'),
            helper: 'Detected from recurring award patterns',
            tone: 'slate',
        },
    ];
});

const selectGhostRows = createSelector(selectRedFlagsState, (redFlags) => {
    return redFlags.items.slice(0, redFlags.limit).map((item) => {
        const physical = Number(item.work_status?.physical_progress_pct || 0);
        const financial = Number(item.work_status?.financial_progress_pct || 0);
        const years = (Number(item.days_overdue || 0) / 365).toFixed(1);
        const contractorId =
            typeof item.contractor_id === 'string'
                ? item.contractor_id
                : item.contractor_id?._id || item.contractor_id?.$oid || null;

        return {
            tenderId: `#${item.tender_id}`,
            projectName: item.description || 'Untitled project',
            contractor: item.contractor_name || item.procuring_entity || 'Unknown',
            contractorId,
            money: formatBdt(item.contract_value),
            overdueYears: `${years} Years`,
            financial,
            physical,
            tenderRef: item.tender_id,
        };
    });
});

const selectGhostPagination = createSelector(selectRedFlagsState, (redFlags) => {
    const page = Number(redFlags.pagination?.page || redFlags.page || 1);
    const limit = Number(redFlags.pagination?.limit || redFlags.limit || 5);
    const total = Number(redFlags.pagination?.total || 0);
    const shownEnd = Math.min(total, page * limit);
    const shownStart = total ? (page - 1) * limit + 1 : 0;
    const totalPages = Number(redFlags.pagination?.total_pages || Math.max(1, Math.ceil(total / limit)));

    return {
        page,
        total,
        shownStart,
        shownEnd,
        totalPages,
    };
});

const selectTimelineCards = createSelector(selectRedFlagsState, (redFlags) => {
    const source = redFlags.analyticsItems.length ? redFlags.analyticsItems : redFlags.items;

    return source
        .filter((item) => item.red_flags?.some((flag) => flag.flag_type === 'impossible_timeline'))
        .slice(0, 3)
        .map((item) => ({
            badge: item.red_flags?.find((flag) => flag.flag_type === 'impossible_timeline')?.flag_type
                ?.replaceAll('_', ' ')
                ?.toUpperCase() || 'TIMELINE ALERT',
            tenderRef: item.tender_id,
            title: item.description || 'Impossible timeline case',
            awarded: formatShortDate(item.notification_date),
            completed: formatShortDate(item.contract_end_date),
            summary:
                item.red_flags?.find((flag) => flag.flag_type === 'impossible_timeline')?.description ||
                'Timeline appears administratively impossible.',
        }));
});

const selectRepeatWinners = createSelector(selectRedFlagsState, (redFlags) => {
    return (redFlags.repeatWinnerItems || [])
        .slice(0, 2)
        .map((row) => {
            const tendersWon = Number(row.tenders_won || 0);
            const flaggedContracts = Number(row.flagged_contracts || 0);
            const repeatWinnerFlags = Number(row.repeat_winner_flags || 0);
            const completionRate = Number(row.completion_rate_pct || 0);

            return {
                contractorId:
                    typeof row.contractor_id === 'string'
                        ? row.contractor_id
                        : row.contractor_id?._id || row.contractor_id?.$oid || null,
                name: row.contractor_name || 'Unknown Contractor',
                risk: tendersWon >= 4 || repeatWinnerFlags >= 2 ? 'Critical High' : 'High Risk',
                summary:
                    repeatWinnerFlags > 0
                        ? `Awarded ${tendersWon} projects (${flaggedContracts} flagged, ${repeatWinnerFlags} repeat-winner signals).`
                        : `Awarded ${tendersWon} projects (${flaggedContracts} flagged).`,
                completion: `${completionRate}% Verified`,
                completionPct: completionRate,
                totalValue: formatBdt(row.total_value),
                tendersWon: String(tendersWon),
            };
        });
});

const selectRedFlagsViewModel = createSelector(
    selectRedFlagsState,
    selectCounterCards,
    selectGhostRows,
    selectGhostPagination,
    selectTimelineCards,
    selectRepeatWinners,
    (redFlags, counters, ghostRows, ghostPagination, timelineCards, repeatWinners) => ({
        isLoading: redFlags.isLoading,
        error: redFlags.error,
        counters,
        ghostRows,
        ghostPagination,
        timelineCards,
        repeatWinners,
    })
);

export { selectRedFlagsViewModel };
