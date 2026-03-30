const buildDonutGradient = (items = []) => {
    if (!items.length) {
        return '#e5e9ed';
    }

    let cursor = 0;
    const pieces = items.map((item) => {
        const start = cursor;
        cursor += Number(item.value || 0);
        return `${item.color} ${start}% ${cursor}%`;
    });

    return `conic-gradient(${pieces.join(', ')})`;
};

function RiskRatioDonut({ ratio = 0, items = [] }) {
    return (
        <article className="money-card money-card--risk" aria-label="Risk ratio donut chart">
            <div className="money-risk-donut" style={{ background: buildDonutGradient(items) }}>
                <div className="money-risk-donut__inner">
                    <p className="money-risk-donut__value">{ratio}%</p>
                    <p className="money-risk-donut__label">Risk Ratio</p>
                </div>
            </div>

            <div className="money-risk-legend">
                {items.map((item) => (
                    <div key={item.label} className="money-risk-legend__row">
                        <div className="money-risk-legend__label">
                            <span className="money-risk-legend__swatch" style={{ background: item.color }} />
                            <span>{item.label}</span>
                        </div>
                        <span>{item.value}%</span>
                    </div>
                ))}
            </div>
        </article>
    );
}

export default RiskRatioDonut;
