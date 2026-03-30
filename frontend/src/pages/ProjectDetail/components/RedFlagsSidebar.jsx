function RedFlagsSidebar({ redFlags = [], evidence = [] }) {
    return (
        <aside className="project-detail-sidebar">
            <section>
                <h3 className="project-detail-card-title">Red Flags Detected</h3>
                <div className="project-detail-red-flag-list">
                    {redFlags.map((flag) => (
                        <article key={flag.title} className="project-detail-red-flag-item">
                            <h4>{flag.title}</h4>
                            <p>{flag.description}</p>
                            <div className="project-detail-red-flag-meta">
                                <span>Type: {flag.flagType}</span>
                                <span>Severity: {flag.severity}</span>
                                <span>Detected: {flag.detectedAt}</span>
                            </div>
                            {flag.evidence ? (
                                <ul className="project-detail-red-flag-evidence">
                                    {Object.entries(flag.evidence).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {String(value)}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </article>
                    ))}
                </div>
            </section>

            <section className="project-detail-evidence-card">
                <h3 className="project-detail-card-title">Official Source Evidence</h3>
                <ul>
                    {evidence.length ? (
                        evidence.map((item) => (
                            <li key={item.url}>
                                <a href={item.url} target="_blank" rel="noreferrer">
                                    {item.label}
                                </a>
                                <span aria-hidden="true">↗</span>
                            </li>
                        ))
                    ) : (
                        <li>
                            <span>Not available</span>
                        </li>
                    )}
                </ul>
            </section>
        </aside>
    );
}

export default RedFlagsSidebar;
