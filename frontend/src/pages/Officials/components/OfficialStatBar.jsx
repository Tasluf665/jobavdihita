function OfficialStatBar({ stats }) {
    const { approved, totalValue, completed, ongoing, overdue, rate } = stats;

    return (
        <div className="official-stat-bar">
            <div className="stat-box">
                <p className="stat-box__label">Approved</p>
                <p className="stat-box__value">{approved}</p>
            </div>

            <div className="stat-box">
                <p className="stat-box__label">Total Value</p>
                <p className="stat-box__value">{totalValue}</p>
            </div>

            <div className="stat-box">
                <p className="stat-box__label">Completed</p>
                <p className="stat-box__value" style={{ color: '#424655' }}>
                    {completed}
                </p>
            </div>

            <div className="stat-box">
                <p className="stat-box__label">Ongoing</p>
                <p className="stat-box__value" style={{ color: 'var(--info)' }}>
                    {ongoing}
                </p>
            </div>

            <div className="stat-box stat-box--overdue">
                <p className="stat-box__label">Overdue</p>
                <p className="stat-box__value">{overdue}</p>
            </div>

            <div className="stat-box stat-box--inactive">
                <p className="stat-box__label">Rate</p>
                <p className="stat-box__value">{rate}</p>
            </div>
        </div>
    );
}

export default OfficialStatBar;
