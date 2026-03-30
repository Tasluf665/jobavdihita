function DataBlock({ label, value, hint }) {
    return (
        <div className="project-detail-data-block">
            <div className="project-detail-data-label">{label}</div>
            <div className="project-detail-data-value">{value}</div>
            {hint ? <div className="project-detail-data-hint">{hint}</div> : null}
        </div>
    );
}

function ContractDataPanel({ data }) {
    if (!data) {
        return null;
    }

    return (
        <section className="project-detail-card">
            <h3 className="project-detail-card-title">Official Contract Data Panel</h3>

            <div className="project-detail-data-grid">
                <div className="project-detail-data-column">
                    <DataBlock label="Contractor Entity" value={data.contractor} hint={data.contractorRisk} />
                    <DataBlock label="Approving Engineer" value={data.approvingEngineer} hint={data.office} />
                    <DataBlock label="Procurement Method" value={data.method} />
                </div>

                <aside className="project-detail-timeline">
                    <h4 className="project-detail-timeline-title">Temporal Anomaly</h4>
                    <div className="project-detail-timeline-node">
                        <span>Contract Start</span>
                        <strong>{data.startDate}</strong>
                    </div>
                    <div className="project-detail-timeline-node">
                        <span>Planned Completion</span>
                        <strong>{data.endDate}</strong>
                    </div>
                    <p className="project-detail-timeline-alert">{data.timelineAlert}</p>
                </aside>
            </div>
        </section>
    );
}

export default ContractDataPanel;
