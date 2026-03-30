function PhysicalAuditBar({ deliveredPct = 0, breachedPct = 0 }) {
    return (
        <section className="contractors-audit-card" aria-label="Physical completion audit">
            <div className="contractors-audit-head">
                <h3>Physical Completion Audit</h3>

                <div className="contractors-audit-legend" aria-hidden="true">
                    <span>
                        <i className="is-delivered" /> Delivered
                    </span>
                    <span>
                        <i className="is-breached" /> Breached/Delayed
                    </span>
                </div>
            </div>

            <div className="contractors-audit-bar" role="img" aria-label={`Delivered ${deliveredPct} percent, breached ${breachedPct} percent`}>
                <div className="is-delivered" style={{ width: `${deliveredPct}%` }} />
                <div className="is-breached" style={{ width: `${breachedPct}%` }} />
            </div>
        </section>
    );
}

export default PhysicalAuditBar;
