function RedFlagDossier({ cards = [] }) {
    return (
        <section className="contractors-dossier" aria-label="Red flag evidence dossier">
            <header className="contractors-dossier-head">
                <h2>
                    <span aria-hidden="true">⛑</span> Red Flag Evidence Dossier
                </h2>
            </header>

            <div className="contractors-dossier-grid">
                {cards.map((card) => (
                    <article key={card.title} className="contractors-dossier-card">
                        <h3>{card.title}</h3>
                        {card.body.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                        <a href={card.linkUrl || '#'} onClick={(event) => (!card.linkUrl ? event.preventDefault() : null)}>
                            {card.linkLabel} ↗
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RedFlagDossier;
