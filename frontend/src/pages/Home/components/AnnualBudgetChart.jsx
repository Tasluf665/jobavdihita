const LEGEND = [
    { label: 'Total Allocated', color: 'rgba(13, 110, 253, 0.3)' },
    { label: 'Delivered Amount', color: 'var(--success)' },
    { label: 'Ongoing', color: '#f59e0b' },
    { label: 'Delivery Gap', color: '#fdf2f2', gap: true },
];

const getBarTooltip = (bar) => {
    const year = bar.year ?? 'Unknown';
    const delivered = Number(bar.delivered || 0);
    const ongoing = Number(bar.ongoing || 0);
    const pending = Math.max(0, 100 - delivered - ongoing);

    return [
        `Year: ${year}`,
        `Allocated: ${bar.value || 'N/A'}`,
        `Delivered: ${delivered}%`,
        `Ongoing: ${ongoing}%`,
        `Pending/Gap: ${pending}%`,
    ].join(' • ');
};

function AnnualBudgetChart({ bars = [] }) {
    if (!bars.length) {
        return null;
    }

    return (
        <section className="audit-section" aria-label="Annual Budget Audit">
            <div className="audit-header">
                <div>
                    <h3 className="h3-section" style={{ margin: 0 }}>
                        Annual Budget Audit (2017-2026)
                    </h3>
                    <p className="body-sm">Historical comparison of allocated funds vs. verified project delivery.</p>
                </div>
            </div>

            <div className="chart-area">
                <div className="chart-legend">
                    {LEGEND.map((item) => (
                        <div className="legend-item" key={item.label}>
                            <span
                                className="legend-dot"
                                style={{
                                    background: item.color,
                                    borderRadius: item.gap ? '2px' : '999px',
                                    border: item.gap ? '1px solid rgba(186, 26, 26, 0.2)' : 'none',
                                }}
                            />
                            <span className="caps-xs" style={{ color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="chart-bars">
                    {bars.map((bar, index) => (
                        <div className="chart-bar-wrap" key={bar.year ?? index} title={getBarTooltip(bar)}>
                            <div className="chart-bar-value">{bar.value}</div>
                            <div
                                className="chart-bar"
                                role="img"
                                aria-label={getBarTooltip(bar)}
                                tabIndex={0}
                                style={{
                                    background: bar.gap
                                        ? 'none'
                                        : bar.allocated
                                            ? 'rgba(13, 110, 253, 0.3)'
                                            : 'transparent',
                                }}
                            >
                                {bar.gap ? <div className="chart-bar__gap" style={{ height: `${bar.allocated}%` }} /> : null}
                                {bar.delivered ? (
                                    <div className="chart-bar__delivered" style={{ height: `${bar.delivered}%` }} />
                                ) : null}
                                {bar.ongoing ? (
                                    <div className="chart-bar__ongoing" style={{ height: `${bar.ongoing}%` }} />
                                ) : null}
                            </div>
                            <div className="chart-bar-year">{bar.year ?? '—'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AnnualBudgetChart;
