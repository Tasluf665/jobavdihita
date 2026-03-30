function ProjectLifecycleBar({ completedCount, inProgressCount, atRiskCount, lastUpdated, legendItems, note }) {
    const total = completedCount + inProgressCount + atRiskCount;
    const safeTotal = Math.max(1, total);

    return (
        <section className="project-lifecycle">
            <div className="project-lifecycle__header">
                <h3 className="project-lifecycle__title">Project Lifecycle Distribution</h3>
                <p className="project-lifecycle__date">Data updated: {lastUpdated}</p>
            </div>

            <div className="lifecycle-bar">
                {completedCount > 0 && (
                    <div
                        className="lifecycle-segment lifecycle-segment--completed"
                        style={{ width: `${(completedCount / safeTotal) * 100}%` }}
                    >
                        Completed ({completedCount})
                    </div>
                )}
                {inProgressCount > 0 && (
                    <div
                        className="lifecycle-segment lifecycle-segment--in-progress"
                        style={{ width: `${(inProgressCount / safeTotal) * 100}%` }}
                    >
                        In Progress ({inProgressCount})
                    </div>
                )}
                <div
                    className="lifecycle-segment lifecycle-segment--at-risk"
                    style={{ width: `${(atRiskCount / safeTotal) * 100}%` }}
                >
                    100% AT RISK ({atRiskCount} OVERDUE / {safeTotal - atRiskCount} PENDING)
                </div>
            </div>

            <div className="lifecycle-legend">
                {legendItems.map((item) => (
                    <div key={item.id} className="legend-item">
                        <div className={`legend-dot legend-dot--${item.type}`} />
                        {item.label} ({item.count})
                    </div>
                ))}
            </div>

            <div className="accountability-note">
                <p className="accountability-note__content">
                    ACCOUNTABILITY NOTE:
                    <span className="accountability-note__text"> {note}</span>
                </p>
            </div>
        </section>
    );
}

export default ProjectLifecycleBar;
