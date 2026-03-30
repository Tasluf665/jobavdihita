function ProgressCell({ physical = 0, financial = 0, tone = 'ongoing' }) {
    const fillPct = Math.max(physical, financial);
    const toneClass = tone === 'ghost' ? 'projects-progress-fill--danger' : 'projects-progress-fill--info';

    return (
        <div className="projects-progress-cell">
            <div className="projects-progress-meta">
                <span>P: {physical}%</span>
                <span>F: {financial}%</span>
            </div>
            <div className="projects-progress-track">
                <div className={`projects-progress-fill ${toneClass}`} style={{ width: `${fillPct}%` }} />
            </div>
        </div>
    );
}

export default ProgressCell;
