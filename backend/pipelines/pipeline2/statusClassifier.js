const toDate = (value) => {
    if (!value) {
        return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (value) => {
    const d = toDate(value);
    if (!d) {
        return null;
    }

    const normalized = new Date(d);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

const getDaysOverdue = (contractEndDate, now = new Date()) => {
    const end = startOfDay(contractEndDate);
    if (!end) {
        return 0;
    }

    const startOfToday = startOfDay(now);

    const diffDays = Math.floor(
        (startOfToday.getTime() - end.getTime()) / (24 * 60 * 60 * 1000)
    );

    return diffDays > 0 ? diffDays : 0;
};

const getCompletionDate = (experience, now) =>
    toDate(experience?.latest_milestone_date) || startOfDay(now);

const classifyStatus = ({ experience, contractEndDate, now = new Date() }) => {
    const effectiveEndDate = toDate(experience?.contract_end_date) || toDate(contractEndDate);
    const overdueDays = getDaysOverdue(effectiveEndDate, now);

    if (!experience?.found) {
        return {
            computed_status: overdueDays > 0 ? 'overdue' : 'not_started',
            days_overdue: overdueDays,
            completed_on_time: null,
        };
    }

    const physicalPct = Number(experience.physical_progress_pct);
    const statusLabel = String(experience.status_label || '').toLowerCase();
    const inferredCompleted =
        (Number.isFinite(physicalPct) && physicalPct >= 100) ||
        Boolean(experience.completion_certificate) ||
        /completed/.test(statusLabel);

    if (inferredCompleted) {
        const completionDate = getCompletionDate(experience, now);
        const completedOnTime =
            !effectiveEndDate || !completionDate
                ? true
                : startOfDay(completionDate).getTime() <= startOfDay(effectiveEndDate).getTime();

        return {
            computed_status: 'completed',
            days_overdue: completedOnTime ? 0 : overdueDays,
            completed_on_time: completedOnTime,
        };
    }

    if (overdueDays > 0) {
        const isGhost = Number.isFinite(physicalPct) ? physicalPct < 5 : true;
        return {
            computed_status: isGhost ? 'ghost' : 'overdue',
            days_overdue: overdueDays,
            completed_on_time: null,
        };
    }

    return {
        computed_status: 'ongoing',
        days_overdue: 0,
        completed_on_time: null,
    };
};

module.exports = {
    classifyStatus,
};

