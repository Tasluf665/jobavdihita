const SATELLITE_IMAGE =
    'https://www.figma.com/api/mcp/asset/444934db-e18a-45c9-98aa-64cdbfa45fcc';

function LocationMap({ location }) {
    if (!location) {
        return null;
    }

    return (
        <section className="project-detail-location-grid">
            <article className="project-detail-location-card">
                <h3 className="project-detail-card-title">Location Intel</h3>
                <div className="project-detail-location-block">
                    <span>Ward</span>
                    <strong>{location.ward}</strong>
                </div>
                <div className="project-detail-location-block">
                    <span>Primary Landmark</span>
                    <strong>{location.landmark}</strong>
                </div>
                <div className="project-detail-location-block">
                    <span>Coordinates</span>
                    <strong className="is-link">{location.coordinates}</strong>
                </div>
            </article>

            <article className="project-detail-map-card">
                <img src={SATELLITE_IMAGE} alt="Satellite location overview" />
                <div className="project-detail-map-pin" aria-hidden="true">
                    ●
                </div>
                <div className="project-detail-map-caption">Live Sentinel Overlay: No Structure Detected</div>
            </article>
        </section>
    );
}

export default LocationMap;
