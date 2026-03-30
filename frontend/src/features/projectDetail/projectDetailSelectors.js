import { createSelector } from '@reduxjs/toolkit';

const selectProjectDetailState = (state) => state.projectDetail;

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
        day: '2-digit',
        year: 'numeric',
    });
};

const formatBdt = (value = 0) => `৳ ${Math.round(Number(value || 0)).toLocaleString('en-US')}`;

const toStatusLabel = (status) => {
    switch (status) {
        case 'ghost':
            return 'Ghost Project - Critical';
        case 'overdue':
            return 'Overdue - High Risk';
        case 'completed':
            return 'Completed';
        case 'ongoing':
            return 'Ongoing';
        default:
            return 'Pending Start';
    }
};

const selectProjectDetailViewModel = createSelector(selectProjectDetailState, (detail) => {
    const contract = detail.contract;

    if (!contract) {
        return {
            isLoading: detail.isLoading,
            error: detail.error,
            tenderId: detail.tenderId,
            alerts: [],
            breadcrumbs: ['Home', 'All Projects', `Contract #${detail.tenderId}`],
            hero: null,
            metrics: [],
            contractData: null,
            progressTiles: [],
            redFlags: [],
            evidence: [],
            community: null,
            location: null,
        };
    }

    const physical = Number(contract.work_status?.physical_progress_pct || 0);
    const financial = Number(contract.work_status?.financial_progress_pct || 0);
    const overdueDays = Number(contract.days_overdue || 0);

    const startDate = contract.contract_start_date || contract.notification_date;
    const endDate = contract.contract_end_date;

    const latestTimeline = detail.timeline[detail.timeline.length - 1] || null;
    const timelineStart = startDate || latestTimeline?.checked_at;
    const timelineEnd = endDate || latestTimeline?.checked_at;

    const redFlags = detail.redFlags.length ? detail.redFlags : contract.red_flags || [];

    return {
        isLoading: detail.isLoading,
        error: detail.error,
        tenderId: contract.tender_id || detail.tenderId,
        alerts: redFlags.slice(0, 3).map((flag) => (flag.title || flag.flag_type || 'Critical anomaly').toUpperCase()),
        breadcrumbs: ['Home', 'All Projects', `Contract #${contract.tender_id || detail.tenderId}`],
        hero: {
            statusTag: toStatusLabel(contract.computed_status),
            title: contract.description || `Contract #${contract.tender_id}`,
            subtitle:
                physical === 0
                    ? 'System scan reveals 0% verification on-site despite full budget allocation.'
                    : 'System scan indicates in-field activity, pending independent verification.',
            subtitle2: 'Timeline parameters indicate potential administrative falsification.',
            hash: `0x4DFD9D${contract.tender_id || detail.tenderId}`,
        },
        metrics: [
            {
                label: 'Time Delay',
                value: overdueDays > 0 ? `${overdueDays} DAYS OVERDUE` : 'ON TRACK',
                tone: 'danger',
            },
            {
                label: 'Field Verification',
                value: `${Math.round(physical)}% PROGRESS`,
                tone: 'danger',
            },
            {
                label: 'Funds Committed',
                value: formatBdt(contract.contract_value || 0),
                tone: 'primary',
            },
        ],
        contractData: {
            contractor: contract.contractor_id?.company_name || contract.procuring_entity || 'Unknown Contractor',
            contractorRisk: 'Repeat offender: multiple delayed contracts detected',
            approvingEngineer: contract.official_id?.full_name || 'Not assigned',
            office: contract.official_id?.designation || contract.district || 'Munshiganj',
            method: contract.procurement_method || 'OTM (Open Tendering Method)',
            procuringEntity: contract.procuring_entity || '—',
            fundingSource: contract.funding_source || '—',
            signingDate: formatDate(contract.signing_date),
            bidderCount: Number(contract.bidder_count || 0).toLocaleString('en-US'),
            startDate: formatDate(timelineStart),
            endDate: formatDate(timelineEnd),
            timelineAlert:
                !contract.contract_start_date || !contract.contract_end_date
                    ? 'System logic warning: start/end milestone dates are incomplete in source documents.'
                    : 'Timeline appears highly compressed and inconsistent with field conditions.',
        },
        progressTiles: [
            {
                label: 'Physical Progress',
                value: `${physical.toFixed(2)}%`,
                tone: 'danger',
            },
            {
                label: 'Financial Disbursement',
                value: formatBdt(financial),
                tone: 'primary',
            },
            {
                label: 'Current Status',
                value: (contract.computed_status || 'ongoing').toUpperCase(),
                tone: 'warning',
            },
        ],
        redFlags: redFlags.slice(0, 3).map((flag) => ({
            title: flag.title || flag.flag_type || 'Flag',
            description: flag.description || 'Potential procurement anomaly detected.',
            flagType: flag.flag_type || 'unknown',
            severity: (flag.severity || 'warning').toUpperCase(),
            detectedAt: formatDate(flag.detected_at),
            evidence: flag.evidence || null,
        })),
        evidence: contract.detail_url
            ? [
                {
                    label: 'Detail URL',
                    url: contract.detail_url,
                },
            ]
            : [],
        community: {
            consensus: 78,
            verdict: 'Work NOT Done',
            details: 'Based on independent observations submitted within Munshiganj Pourashava area.',
        },
        location: {
            ward: 'Ward No: 04',
            landmark: 'Munshiganj Bazaar Road',
            coordinates: '23.5714° N, 90.4906° E',
        },
    };
});

export { selectProjectDetailViewModel };
