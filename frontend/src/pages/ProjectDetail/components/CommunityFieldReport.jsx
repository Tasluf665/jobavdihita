function CommunityFieldReport({ community }) {
    if (!community) {
        return null;
    }

    return (
        <section className="project-detail-community-card">
            <h3 className="project-detail-card-title">Community Field Report</h3>
            <div className="project-detail-community-score">{community.consensus}%</div>
            <div className="project-detail-community-label">Citizen Consensus</div>
            <div className="project-detail-community-verdict">{community.verdict}</div>
            <p className="project-detail-community-meta">{community.details}</p>
        </section>
    );
}

export default CommunityFieldReport;
