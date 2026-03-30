function SectionHeader({ icon, title, actionLabel }) {
    return (
        <div className="section-header">
            <div className="section-header__title">
                <span aria-hidden="true">{icon}</span>
                <h3 className="h3-section" style={{ margin: 0 }}>
                    {title}
                </h3>
            </div>
            <span className="section-header__link">{actionLabel}</span>
        </div>
    );
}

export default SectionHeader;
