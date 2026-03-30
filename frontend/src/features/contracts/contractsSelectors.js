import { createSelector } from '@reduxjs/toolkit';

const selectContractsState = (state) => state.contracts;

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

const findStatusCount = (rows, key) => {
    const match = rows.find((item) => item.status === key);
    return Number(match?.count || 0);
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

const selectFilterOptions = createSelector(selectContractsState, () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [{ label: 'All Years', value: '' }];

    for (let i = 0; i < 6; i += 1) {
        const year = currentYear - i;
        yearOptions.push({
            label: `${year}-${year + 1}`,
            value: String(year),
        });
    }

    return {
        yearOptions,
        statusOptions: [
            { label: 'All Status', value: '' },
            { label: 'Completed', value: 'completed' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Overdue', value: 'overdue' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Not Started', value: 'not_started' },
        ],
        sortOptions: [
            { label: 'Tender Value', value: 'contract_value' },
            { label: 'Days Overdue', value: 'days_overdue' },
            { label: 'Start Date', value: 'notification_date' },
        ],
    };
});

const selectProjectsSummaryItems = createSelector(selectContractsState, (contracts) => {
    const stats = contracts.summaryStats;
    const breakdown = contracts.statusBreakdown;
    const totalProjects = Number(contracts.pagination?.total || stats?.total_contracts || 0);

    return [
        {
            label: 'Total Projects',
            value: totalProjects.toLocaleString('en-US'),
        },
        {
            label: 'Total Value',
            value: formatCompactBdt(Number(stats?.total_contract_value || 0)),
            tone: 'primary',
        },
        {
            label: 'Completed',
            value: findStatusCount(breakdown, 'completed').toLocaleString('en-US'),
        },
        {
            label: 'Ongoing',
            value: findStatusCount(breakdown, 'ongoing').toLocaleString('en-US'),
        },
        {
            label: 'Overdue',
            value: findStatusCount(breakdown, 'overdue').toLocaleString('en-US'),
            tone: 'danger',
        },
    ];
});

const selectProjectsRows = createSelector(selectContractsState, (contracts) => {
    const currentPage = Number(contracts.pagination?.page || contracts.page || 1);
    const limit = Number(contracts.pagination?.limit || contracts.limit || 5);

    return contracts.items.map((item, index) => {
        const { label, tone } = toStatusMeta(item.computed_status);
        const daysOverdue = Number(item.days_overdue || 0);
        const physical = Math.max(0, Math.min(100, Number(item.work_status?.physical_progress_pct || 0)));
        const financial = Math.max(0, Math.min(100, Number(item.work_status?.financial_progress_pct || 0)));
        const danger = item.computed_status === 'ghost' || item.computed_status === 'overdue';

        return {
            id: String((currentPage - 1) * limit + index + 1).padStart(2, '0'),
            tenderId: item.tender_id,
            projectName: item.description || 'Untitled project',
            contractor: item.contractor_id?.company_name || item.contractor_name || 'Unknown Contractor',
            contractorId:
                typeof item.contractor_id === 'string'
                    ? item.contractor_id
                    : item.contractor_id?._id || item.contractor_id?.$oid || null,
            value: formatCompactBdt(Number(item.contract_value || 0)),
            dates: [
                `S: ${formatDate(item.contract_start_date || item.notification_date)}`,
                `E: ${formatDate(item.contract_end_date)}`,
            ],
            physical,
            financial,
            overdueDays: daysOverdue > 0 ? `${daysOverdue} DAYS` : '—',
            status: label,
            statusTone: tone,
            danger,
        };
    });
});

const selectProjectsPagination = createSelector(selectContractsState, selectProjectsRows, (contracts, rows) => {
    const page = Number(contracts.pagination?.page || contracts.page || 1);
    const limit = Number(contracts.pagination?.limit || contracts.limit || 5);
    const total = Number(contracts.pagination?.total || 0);
    const totalPages = Number(contracts.pagination?.total_pages || Math.max(1, Math.ceil(total / limit)));
    const hasSearch = Boolean(contracts.filters.searchTerm.trim());

    const shownStart = rows.length ? (page - 1) * limit + 1 : 0;
    const shownEnd = rows.length ? shownStart + rows.length - 1 : 0;

    return {
        page,
        limit,
        total,
        totalPages,
        shownStart,
        shownEnd,
        shownCount: rows.length,
        hasSearch,
    };
});

const selectContractsViewModel = createSelector(
    selectContractsState,
    selectFilterOptions,
    selectProjectsSummaryItems,
    selectProjectsRows,
    selectProjectsPagination,
    (contracts, options, summaryItems, rows, pagination) => ({
        district: contracts.district,
        isLoading: contracts.isLoading,
        error: contracts.error,
        requestedPage: contracts.page,
        summaryItems,
        rows,
        pagination,
        filters: contracts.filters,
        options,
    })
);

export { selectContractsViewModel };
