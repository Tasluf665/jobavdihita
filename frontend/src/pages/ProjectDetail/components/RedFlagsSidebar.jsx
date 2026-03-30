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
                        </article>
                    ))}
                </div>
            </section>

            <section className="project-detail-evidence-card">
                <h3 className="project-detail-card-title">Official Source Evidence</h3>
                <ul>
                    {evidence.map((item) => (
                        <li key={item}>
                            <span>{item}</span>
                            <span aria-hidden="true">↗</span>
                        </li>
                    ))}
                </ul>
            </section>
        </aside>
    );
}

export default RedFlagsSidebar;
