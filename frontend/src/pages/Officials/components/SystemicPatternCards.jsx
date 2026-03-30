function SystemicPatternCards({ patterns }) {
    return (
        <section className="patterns-section">
            <div className="patterns-header">
                <h3 className="patterns-title">Systemic Pattern Analysis</h3>
                <div className="patterns-divider" />
            </div>

            <div className="patterns-grid">
                {patterns.map((pattern) => (
                    <article key={pattern.id} className={`pattern-card pattern-card--${pattern.type}`}>
                        <span className={`pattern-badge pattern-badge--${pattern.type}`}>{pattern.badge}</span>
                        <h4 className="pattern-title">{pattern.title}</h4>
                        <p className="pattern-description">{pattern.description}</p>
                        <div className={`pattern-tag pattern-tag--${pattern.type}`}>{pattern.tag}</div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default SystemicPatternCards;
