function ContractorStatBar({ items = [] }) {
    return (
        <section className="contractors-stat-grid" aria-label="Contractor scorecard">
            {items.map((item) => (
                <article key={item.label} className="contractors-stat-card">
                    <p className="contractors-stat-label">{item.label}</p>
                    <p className={`contractors-stat-value ${item.tone ? `is-${item.tone}` : ''}`.trim()}>{item.value}</p>
                </article>
            ))}
        </section>
    );
}

export default ContractorStatBar;
