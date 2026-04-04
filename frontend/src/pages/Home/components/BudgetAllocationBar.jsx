const LEGEND = [
    { label: 'Completed Works', color: 'var(--success)' },
    { label: 'Ongoing Projects', color: 'var(--info)' },
    { label: 'Ghost / Overdue Projects', color: 'var(--danger)' },
];

function BudgetAllocationBar({ budget }) {
    if (!budget) {
        return null;
    }

    return (
        <section className="budget-section" aria-label="District budget allocation">
            <div className="budget-header">
                <div>
                    <h3 className="h3-section" style={{ margin: 0 }}>
                        District Budget Allocation
                    </h3>
                </div>

                <div className="budget-total">
                    <div className="caps-xs budget-total__label">Total Utilized</div>
                    <div className="budget-total__value">{budget.totalUtilized}</div>
                </div>
            </div>

            <div className="allocation-bar">
                {budget.segments.map((segment) => (
                    <div
                        key={segment.label}
                        className="allocation-segment"
                        style={{ width: `${segment.width}%`, background: segment.color }}
                        title={segment.label}
                    >
                        {segment.width >= 14 ? segment.label : ''}
                    </div>
                ))}
            </div>

            <div className="allocation-legend">
                {LEGEND.map((item) => (
                    <div className="legend-item" key={item.label}>
                        <span className="legend-dot" style={{ background: item.color }} />
                        {item.label}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BudgetAllocationBar;
