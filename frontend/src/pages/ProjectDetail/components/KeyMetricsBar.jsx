function KeyMetricsBar({ metrics = [] }) {
    return (
        <section className="project-detail-metrics" aria-label="Project key metrics">
            {metrics.map((metric) => (
                <article key={metric.label} className="project-detail-metric-item">
                    <div className="project-detail-metric-label">{metric.label}</div>
                    <div className={`project-detail-metric-value project-detail-metric-value--${metric.tone || 'default'}`}>
                        {metric.value}
                    </div>
                </article>
            ))}
        </section>
    );
}

export default KeyMetricsBar;
