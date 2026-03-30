const SEGMENTS = [
    { label: 'Disbursed (65%)', width: 65, color: 'var(--success)' },
    { label: 'Pending (20%)', width: 20, color: 'var(--info)' },
    { label: 'Unaccounted (15%)', width: 15, color: 'var(--danger)' },
];

const LEGEND = [
    { label: 'Completed Works', color: 'var(--success)' },
    { label: 'Ongoing Construction', color: 'var(--info)' },
    { label: 'Missing Receipts/Audit', color: 'var(--danger)' },
];

function BudgetAllocationBar() {
    return (
        <section className="budget-section" aria-label="District budget allocation">
            <div className="budget-header">
                <div>
                    <h3 className="h3-section" style={{ margin: 0 }}>
                        District Budget Allocation
                    </h3>
                    <p className="budget-subtitle body-sm">Fiscal Year 2023-2024 Expenditure Tracking</p>
                </div>

                <div className="budget-total">
                    <div className="caps-xs budget-total__label">Total Utilized</div>
                    <div className="budget-total__value">৳ 4.82 Billion</div>
                </div>
            </div>

            <div className="allocation-bar">
                {SEGMENTS.map((segment) => (
                    <div
                        key={segment.label}
                        className="allocation-segment"
                        style={{ width: `${segment.width}%`, background: segment.color }}
                    >
                        {segment.label}
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
