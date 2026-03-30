import Button from '../../../components/ui/Button';

const BARS = [
    { year: 2017, value: '৳1.45B', allocated: 21, delivered: 16 },
    { year: 2018, value: '৳1.98B', allocated: 29, delivered: 21 },
    { year: 2019, value: '৳3.76B', allocated: 52, delivered: 24 },
    { year: 2020, value: '৳2.64B', allocated: 37, delivered: 22 },
    { year: 2021, value: '৳3.95B', allocated: 54, delivered: 19 },
    { year: 2022, value: '৳3.20B', allocated: 47, delivered: 6, gap: true },
    { year: 2023, value: '৳4.84B', allocated: 65, delivered: 3, gap: true },
    { year: 2024, value: '৳6.13B', allocated: 81, delivered: 0, gap: true },
    { year: 2025, value: '৳6.81B', allocated: 90, ongoing: 2 },
    { year: 2026, value: '৳3.77B', allocated: 52 },
];

const LEGEND = [
    { label: 'Total Allocated', color: 'rgba(13, 110, 253, 0.3)' },
    { label: 'Delivered Amount', color: 'var(--success)' },
    { label: 'Ongoing', color: '#f59e0b' },
    { label: 'Delivery Gap', color: '#fdf2f2', gap: true },
];

function AnnualBudgetChart() {
    return (
        <section className="audit-section" aria-label="Annual Budget Audit">
            <div className="audit-header">
                <div>
                    <h3 className="h3-section" style={{ margin: 0 }}>
                        Annual Budget Audit (2017-2026)
                    </h3>
                    <p className="body-sm">Historical comparison of allocated funds vs. verified project delivery.</p>
                </div>

                <div className="audit-actions">
                    <Button variant="secondary">Download Archive</Button>
                    <Button variant="primary">Audit Details</Button>
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
                    {BARS.map((bar) => (
                        <div className="chart-bar-wrap" key={bar.year}>
                            <div className="chart-bar-value">{bar.value}</div>
                            <div
                                className="chart-bar"
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
                            <div className="chart-bar-year">{bar.year}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AnnualBudgetChart;
