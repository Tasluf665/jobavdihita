function ImpossibleTimelineCards({ cards = [] }) {
    return (
        <section className="red-flags-section">
            <h2>Impossible Timeline</h2>

            <div className="red-flags-timeline-grid">
                {cards.map((card) => (
                    <article key={card.title} className="red-flags-timeline-card">
                        <div className="red-flags-timeline-badge">{card.badge}</div>
                        <h3>
                            <a className="red-flags-project-link" href={`/projects/${card.tenderRef}`}>
                                {card.title}
                            </a>
                        </h3>
                        <div className="red-flags-timeline-item">
                            <span>Awarded</span>
                            <strong>{card.awarded}</strong>
                        </div>
                        <div className="red-flags-timeline-item">
                            <span>Completed</span>
                            <strong>{card.completed}</strong>
                        </div>
                        <p>{card.summary}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ImpossibleTimelineCards;
