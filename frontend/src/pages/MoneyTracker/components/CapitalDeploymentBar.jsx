function CapitalDeploymentBar({ segments = [], note }) {
    return (
        <div className="money-progress-wrap">
            <div className="money-progress-track" role="img" aria-label="Capital deployment progress">
                {segments.map((segment) => (
                    <span
                        key={segment.label}
                        className="money-progress-segment"
                        style={{ width: `${segment.width}%`, background: segment.color }}
                        title={`${segment.label}: ${Math.round(segment.width)}%`}
                    />
                ))}
            </div>

            <div className="money-progress-meta">
                <span>Capital Deployment Progress</span>
                <span>{note}</span>
            </div>
        </div>
    );
}

export default CapitalDeploymentBar;
