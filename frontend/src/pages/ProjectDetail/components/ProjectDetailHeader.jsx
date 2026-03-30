function ProjectDetailHeader({ breadcrumbs = [], hero }) {
    if (!hero) {
        return null;
    }

    return (
        <section className="project-detail-hero">
            <div className="project-detail-breadcrumbs" aria-label="Breadcrumbs">
                {breadcrumbs.map((item, index) => (
                    <span key={item} className={index === breadcrumbs.length - 1 ? 'is-active' : ''}>
                        {item}
                    </span>
                ))}
            </div>

            <div className="project-detail-hero__top">
                <div>
                    <div className="project-detail-status-pill">{hero.statusTag}</div>
                    <h1 className="project-detail-title">{hero.title}</h1>
                    <p className="project-detail-subtitle">{hero.subtitle}</p>
                    <p className="project-detail-subtitle">{hero.subtitle2}</p>
                </div>

                <div className="project-detail-actions">
                    <p className="project-detail-hash">System Hash: {hero.hash}</p>
                </div>
            </div>
        </section>
    );
}

export default ProjectDetailHeader;
