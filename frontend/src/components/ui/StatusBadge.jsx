function StatusBadge({ tone = 'critical', children }) {
    return <span className={`status-badge status-badge--${tone}`}>{children}</span>;
}

export default StatusBadge;
