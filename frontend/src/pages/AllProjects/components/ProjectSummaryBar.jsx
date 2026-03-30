function ProjectSummaryBar({ items = [] }) {
    return (
        <section className="projects-summary-grid" aria-label="Projects summary">
            {items.map((item) => (
                <article key={item.label} className="projects-summary-card">
                    <div className="projects-summary-label">{item.label}</div>
                    <div className={`projects-summary-value projects-summary-value--${item.tone || 'default'}`}>
                        {item.value}
                    </div>
                </article>
            ))}
        </section>
    );
}

export default ProjectSummaryBar;
