import { createSelector } from '@reduxjs/toolkit';

const selectOfficialsState = (state) => state.officials;

const formatBdt = (value = 0) => `৳ ${Math.round(Number(value || 0)).toLocaleString('en-US')}`;

const formatCompactBdt = (value = 0) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
        return `৳${(amount / 10000000).toFixed(2)}Cr`;
    }

    if (amount >= 100000) {
        return `৳${(amount / 100000).toFixed(2)}L`;
    }

    return formatBdt(amount).replace(' ', '');
};

const formatDate = (value) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatDateCompact = (value) => {
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

const getInitials = (name = '') => {
    const parts = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return 'NA';
    }

    const initials = parts
        .filter((part) => part.length)
        .slice(0, 3)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return initials || 'NA';
};

const accountabilityLabel = (level = 'low') => {
    const normalized = String(level || '').toLowerCase();
    if (normalized === 'high') {
        return 'HIGH';
    }
    if (normalized === 'moderate') {
        return 'MODERATE';
    }
    return 'LOW';
};

const accountabilityPercent = (level = 'low') => {
    const normalized = String(level || '').toLowerCase();
    if (normalized === 'high') {
        return 85;
    }
    if (normalized === 'moderate') {
        return 50;
    }
    return 25;
};

const mapContractStatus = (contract) => {
    const flags = contract.red_flags || [];
    const hasImpossibleTimeline = flags.some((flag) => flag.flag_type === 'impossible_timeline');

    if (hasImpossibleTimeline) {
        return {
            status: 'Impossible Timeline',
            statusType: 'impossible',
            isAlert: true,
        };
    }

    if (contract.computed_status === 'overdue' || contract.computed_status === 'ghost') {
        return {
            status: 'Critical Delay',
            statusType: 'impossible',
            isAlert: true,
        };
    }

    if (contract.computed_status === 'completed') {
        return {
            status: 'Completed',
            statusType: 'completed',
            isAlert: false,
        };
    }

    if (contract.computed_status === 'ongoing') {
        return {
            status: 'In Progress',
            statusType: 'ongoing',
            isAlert: false,
        };
    }

    return {
        status: 'Pending',
        statusType: 'pending',
        isAlert: false,
    };
};

const mapPatterns = (patterns, contracts = []) => {
    const impossibleContracts = patterns?.impossible_timeline_contracts || [];
    const paymentGapContracts = patterns?.payment_gap_contracts || [];
    const singleBidderCount = Number(patterns?.single_bidder_contracts || 0);
    const overdueRate = Math.round(Number(patterns?.overdue_rate_pct || 0));

    return [
        {
            id: 1,
            type: 'high-risk',
            badge: 'High Risk Pattern',
            title: 'Impossible Timeline Flags',
            description:
                impossibleContracts.length > 0
                    ? `${impossibleContracts.length} contract(s) approved under this official include impossible timeline red flags.`
                    : 'No impossible timeline contracts detected in current records.',
            tag: impossibleContracts.length > 0 ? `Count: ${impossibleContracts.length}` : 'No active hit',
        },
        {
            id: 2,
            type: 'anomaly',
            badge: 'Financial Anomaly',
            title: 'Single Bidder Concentration',
            description:
                singleBidderCount > 0
                    ? `${singleBidderCount} contract(s) were marked with single-bidder anomalies under this official.`
                    : 'No single-bidder anomaly currently detected under this profile.',
            tag: `Overdue Rate: ${overdueRate}%`,
        },
        {
            id: 3,
            type: 'integrity',
            badge: 'Payment Integrity',
            title: 'Unverified Payment Exposure',
            description:
                paymentGapContracts.length > 0
                    ? `${paymentGapContracts.length} contract(s) have payment-gap risk indicators requiring manual verification.`
                    : 'No payment-gap contracts currently flagged in backend pattern analysis.',
            tag:
                contracts.length > 0
                    ? `Source: ${contracts[0]?.funding_source || 'Treasury'}`
                    : 'Source: Treasury',
        },
    ];
};

const selectOfficialViewModel = createSelector(selectOfficialsState, (state) => {
    const profile = state.profile;
    const contracts = state.contracts || [];
    const stats = profile?.stats || {};
    const patterns = state.patterns || null;

    if (!profile) {
        return {
            isLoading: state.isLoading,
            error: state.error,
            hasData: false,
            official: null,
            stats: null,
            lifecycle: null,
            audit: null,
            contracts: [],
            patterns: [],
            totalCount: 0,
        };
    }

    const completedCount = Number(stats.completed_count || 0);
    const ongoingCount = Number(stats.ongoing_count || 0);
    const overdueCount = Number(stats.overdue_count || 0);
    const totalContracts = Number(stats.total_approvals || contracts.length || 0);

    const impossibleTimelineCount = Number(stats.impossible_timeline_count || patterns?.impossible_timeline_contracts?.length || 0);
    const paymentGapCount = Number(patterns?.payment_gap_contracts?.length || 0);

    const mappedContracts = contracts.map((contract) => {
        const statusMeta = mapContractStatus(contract);
        const daysOverdue = Number(contract.days_overdue || 0);
        const physical = Math.max(0, Math.min(100, Number(contract.work_status?.physical_progress_pct || 0)));
        const financial = Math.max(0, Math.min(100, Number(contract.work_status?.financial_progress_pct || 0)));

        return {
            tenderId: String(contract.tender_id || '—'),
            projectName: contract.description || 'Untitled contract',
            value: formatBdt(contract.contract_value || 0),
            dates: [
                `S: ${formatDateCompact(contract.contract_start_date || contract.notification_date)}`,
                `E: ${formatDateCompact(contract.contract_end_date)}`,
            ],
            physical,
            financial,
            overdueDays: daysOverdue > 0 ? `${daysOverdue} DAYS` : '—',
            status: statusMeta.status,
            statusTone: statusMeta.isAlert ? 'ghost' : statusMeta.statusType,
            danger: statusMeta.isAlert || daysOverdue > 0,
        };
    });

    const page = Number(state.contractsPagination?.page || state.page || 1);
    const limit = Number(state.contractsPagination?.limit || state.limit || 20);
    const total = Number(state.contractsPagination?.total || mappedContracts.length || 0);
    const totalPages = Number(state.contractsPagination?.total_pages || Math.max(1, Math.ceil(total / limit)));

    return {
        isLoading: state.isLoading,
        error: state.error,
        hasData: true,
        official: {
            id: profile._id,
            avatarInitials: getInitials(profile.full_name),
            name: profile.full_name || 'Unknown Official',
            title: 'Approving Engineer',
            designation: profile.designation || '—',
            officeCode: `${profile.district || 'Unknown District'}${profile.office ? ` (${profile.office})` : ''}`,
            procuringEntity: contracts[0]?.procuring_entity || profile.department || '—',
            officialRecordsUrl: '#',
        },
        stats: {
            approved: totalContracts,
            totalValue: formatCompactBdt(stats.total_value_approved || 0),
            completed: completedCount,
            ongoing: ongoingCount,
            overdue: overdueCount,
            rate: `${Math.round(Number(stats.completion_rate_pct || 0))}%`,
        },
        lifecycle: {
            completedCount,
            inProgressCount: ongoingCount,
            atRiskCount: overdueCount,
            lastUpdated: formatDate(profile.updated_at),
            legendItems: [
                { id: 1, type: 'completed', label: 'Completed', count: completedCount },
                { id: 2, type: 'in-progress', label: 'In Progress', count: ongoingCount },
                { id: 3, type: 'at-risk', label: 'Critical Delay', count: overdueCount },
            ],
            note:
                patterns?.impossible_timeline_contracts?.length > 0
                    ? `${patterns.impossible_timeline_contracts.length} contract(s) under this official were flagged for impossible timeline risks.`
                    : 'No impossible timeline red flags detected in current backend pattern analysis.',
        },
        audit: {
            accountabilityLevel: accountabilityLabel(profile.accountability_level),
            accountabilityPercent: accountabilityPercent(profile.accountability_level),
            completionRate: `${Math.round(Number(stats.completion_rate_pct || 0))}%`,
            completionPercent: Math.max(1, 100 - Math.round(Number(stats.completion_rate_pct || 0))),
            flags: [
                {
                    id: 1,
                    type: impossibleTimelineCount > 0 ? 'alert' : 'success',
                    number: String(impossibleTimelineCount).padStart(2, '0'),
                    label: 'Impossible Timelines',
                },
                {
                    id: 2,
                    type: paymentGapCount > 0 ? 'alert' : 'success',
                    number: String(paymentGapCount).padStart(2, '0'),
                    label: 'Unverified Payments',
                },
            ],
        },
        contracts: mappedContracts,
        ledgerPagination: {
            page,
            total,
            totalPages,
            shownStart: mappedContracts.length ? (page - 1) * limit + 1 : 0,
            shownEnd: mappedContracts.length ? (page - 1) * limit + mappedContracts.length : 0,
        },
        patterns: mapPatterns(patterns, contracts),
        totalCount: Number(state.contractsPagination?.total || mappedContracts.length),
    };
});

export { selectOfficialViewModel };
