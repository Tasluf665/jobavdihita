function StatCard({ icon, trend, trendColor = 'var(--success)', title, value, iconBg = '#eaf2ff' }) {
    return (
        <article className="stat-card">
            <div className="stat-card__top">
                <div className="stat-card__icon" style={{ background: iconBg }}>
                    <span aria-hidden="true">{icon}</span>
                </div>
                <span className="caps-xs" style={{ color: trendColor }}>
                    {trend}
                </span>
            </div>

            <div className="caps-xs stat-card__title">{title}</div>
            <div className="stat-card__value">{value}</div>
        </article>
    );
}

export default StatCard;
