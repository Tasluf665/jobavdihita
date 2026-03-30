function OfficialHeader({ official }) {
    const { avatarInitials, name, title, officeCode, procuringEntity } = official;

    return (
        <article className="official-header">
            <div className="official-header__container">
                <div className="official-avatar">{avatarInitials}</div>

                <div className="official-info">
                    <div className="official-header-top">
                        <h1 className="official-name">{name}</h1>
                        <span className="official-role-badge">{title}</span>
                    </div>

                    <div className="official-details">
                        <div className="official-detail-item">
                            <p className="detail-label">Office / LGED Code</p>
                            <p className="detail-value">{officeCode}</p>
                        </div>
                        <div className="official-detail-item">
                            <p className="detail-label">Procuring Entity</p>
                            <p className="detail-value">{procuringEntity}</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default OfficialHeader;
