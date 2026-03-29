const toComparableNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

const areSameNumber = (a, b) => toComparableNumber(a) === toComparableNumber(b);

const detectStatusChange = ({ contract, nextWorkStatus, nextComputedStatus }) => {
    const prevWork = contract?.work_status || {};
    const previousStatus = contract?.computed_status || 'not_started';
    const previousPhysical = toComparableNumber(prevWork.physical_progress_pct);
    const previousFinancial = toComparableNumber(prevWork.financial_progress_pct);

    const newPhysical = toComparableNumber(nextWorkStatus?.physical_progress_pct);
    const newFinancial = toComparableNumber(nextWorkStatus?.financial_progress_pct);

    const statusChanged = previousStatus !== nextComputedStatus;
    const physicalChanged = !areSameNumber(previousPhysical, newPhysical);
    const financialChanged = !areSameNumber(previousFinancial, newFinancial);

    const changed = statusChanged || physicalChanged || financialChanged;
    const summaryParts = [];

    if (statusChanged) {
        summaryParts.push(`status: ${previousStatus} -> ${nextComputedStatus}`);
    }
    if (physicalChanged) {
        summaryParts.push(`physical: ${previousPhysical ?? '-'} -> ${newPhysical ?? '-'}`);
    }
    if (financialChanged) {
        summaryParts.push(`financial: ${previousFinancial ?? '-'} -> ${newFinancial ?? '-'}`);
    }

    return {
        changed,
        previous_status: previousStatus,
        new_status: nextComputedStatus,
        previous_physical_pct: previousPhysical,
        new_physical_pct: newPhysical,
        previous_financial_pct: previousFinancial,
        new_financial_pct: newFinancial,
        change_summary: summaryParts.join(' | ') || 'no_change',
    };
};

module.exports = {
    detectStatusChange,
};

