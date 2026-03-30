import CapitalDeploymentBar from './CapitalDeploymentBar';

function FinancialOverviewCard({ title, totalAmount, stats = [], segments = [], note }) {
    return (
        <article className="money-card money-card--summary" aria-label="Financial distribution overview">
            <p className="money-card__kicker">{title}</p>
            <p className="money-card__total">{totalAmount}</p>

            <div className="money-stat-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className="money-stat-box" style={{ borderLeftColor: stat.color }}>
                        <p className="money-stat-box__label">{stat.label}</p>
                        <p className="money-stat-box__value">{stat.value}</p>
                        <p className="money-stat-box__meta" style={{ color: stat.color }}>
                            {stat.meta}
                        </p>
                    </div>
                ))}
            </div>

            <CapitalDeploymentBar segments={segments} note={note} />
        </article>
    );
}

export default FinancialOverviewCard;
