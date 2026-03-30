function ContractorHeader({ breadcrumbs = [], title, subtitle, subtitle2 }) {
    return (
        <section className="contractors-header">
            <div className="contractors-breadcrumbs" aria-label="Breadcrumbs">
                {breadcrumbs.map((item, index) => (
                    <span key={item} className={index === breadcrumbs.length - 1 ? 'is-active' : ''}>
                        {item}
                    </span>
                ))}
            </div>

            <h1 className="contractors-title">{title}</h1>

            <p className="contractors-subtitle">{subtitle}</p>
            <p className="contractors-subtitle">{subtitle2}</p>
        </section>
    );
}

export default ContractorHeader;
