function ProgressStatusRow({ tiles = [] }) {
    return (
        <section className="project-detail-progress-tiles">
            {tiles.map((tile) => (
                <article key={tile.label} className={`project-detail-progress-tile project-detail-progress-tile--${tile.tone || 'default'}`}>
                    <div className="project-detail-progress-label">{tile.label}</div>
                    <div className="project-detail-progress-value">{tile.value}</div>
                </article>
            ))}
        </section>
    );
}

export default ProgressStatusRow;
