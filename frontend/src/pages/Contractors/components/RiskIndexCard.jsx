function RiskIndexCard({ profile }) {
    const riskFillWidth = Math.max(0, Math.min(profile.risk.scoreValue, 100));

    return (
        <section className="contractors-identity-card" aria-label="Contractor identity card">
            <div className="contractors-risk-tag">{profile.risk.tag}</div>

            <div className="contractors-identity-grid">
                <div className="contractors-identity-main">
                    <div className="contractors-avatar">{profile.initial}</div>

                    <div className="contractors-identity-content">
                        <div className="contractors-name-row">
                            <h2 className="contractors-name">{profile.name}</h2>
                            <span className="contractors-red-flag-pill">{profile.redFlags} Red Flags</span>
                        </div>
                    </div>
                </div>

                <aside className="contractors-risk-panel" aria-label="Risk metrics">
                    <div className="contractors-risk-score-row">
                        <span className="contractors-meta-label">{profile.risk.scoreLabel}</span>
                        <strong className="contractors-risk-score">{profile.risk.scoreValue}/100</strong>
                    </div>

                    <div className="contractors-risk-progress">
                        <div className="contractors-risk-progress-fill" style={{ width: `${riskFillWidth}%` }} />
                    </div>

                    <div className="contractors-risk-row">
                        <span>Completion Rate</span>
                        <strong>{profile.risk.completionRate}</strong>
                    </div>

                    <div className="contractors-risk-row">
                        <span>Unverified Payments</span>
                        <strong className="is-danger">{profile.risk.unverifiedPayments}</strong>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default RiskIndexCard;
