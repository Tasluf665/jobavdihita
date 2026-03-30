const LEGEND = [
    { label: 'Delivered', className: 'is-delivered' },
    { label: 'Ongoing', className: 'is-ongoing' },
    { label: 'Delivery Gap', className: 'is-gap' },
];

function AnnualSpendingChart({ bars = [] }) {
    return (
        <article className="money-card money-card--annual" aria-label="Annual spending audit chart">
            <div className="money-annual-head">
                <div>
                    <h2 className="h3-section" style={{ margin: 0 }}>
                        Annual Spending Audit (2017-2025)
                    </h2>
                    <p className="body-sm">Historical comparison of allocated funds vs. verified project delivery.</p>
                </div>

                <div className="money-annual-legend">
                    {LEGEND.map((item) => (
                        <span key={item.label}>
                            <i className={item.className} aria-hidden="true" />
                            {item.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="money-annual-chart" role="img" aria-label="Annual spending bars by year">
                {bars.map((bar) => (
                    <div key={bar.year} className="money-annual-bar-col">
                        <p className="money-annual-bar__amount">{bar.allocatedLabel}</p>

                        <div
                            className={`money-annual-bar ${bar.isAnomaly ? 'is-anomaly' : ''}`}
                            title={bar.tooltip}
                            aria-label={bar.tooltip}
                        >
                            <div className="money-annual-bar__gap" style={{ height: `${bar.allocatedHeight}%` }} />
                            <div className="money-annual-bar__delivered" style={{ height: `${bar.deliveredHeight}%` }} />
                            <div className="money-annual-bar__ongoing" style={{ height: `${bar.ongoingHeight}%` }} />
                            {bar.isAnomaly ? <span className="money-annual-bar__alert">⚠</span> : null}
                        </div>

                        <p className={`money-annual-bar__year ${bar.isAnomaly ? 'is-anomaly' : ''}`}>{bar.year}</p>
                    </div>
                ))}
            </div>
        </article>
    );
}

export default AnnualSpendingChart;
