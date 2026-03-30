import { alertIcon, checkIcon } from '../../../assets/icons';

function ForensicAuditSummary({ auditData, flags }) {
    const { accountabilityLevel, accountabilityPercent, completionRate, completionPercent } = auditData;

    return (
        <aside className="forensic-audit">
            <h3 className="forensic-audit__title">Forensic Audit Summary</h3>

            <div className="audit-items">
                {/* Accountability Level */}
                <div className="audit-item">
                    <p className="audit-item__label">Accountability Level</p>
                    <p className="audit-item__value" style={{ color: '#ffc107' }}>
                        {accountabilityLevel}
                    </p>
                </div>
                <div className="audit-progress">
                    <div
                        className="audit-progress__fill audit-progress__fill--moderate"
                        style={{ width: `${accountabilityPercent}%` }}
                    />
                </div>

                {/* Completion Rate */}
                <div className="audit-item">
                    <p className="audit-item__label">Completion Rate</p>
                    <p className="audit-item__value" style={{ color: '#dc3545' }}>
                        {completionRate}
                    </p>
                </div>
                <div className="audit-progress">
                    <div
                        className="audit-progress__fill audit-progress__fill--critical"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>

                {/* Flagged Issues */}
                {flags.map((flag) => (
                    <div key={flag.id} className={`audit-alert ${flag.type === 'success' ? 'audit-alert--success' : ''}`}>
                        <div className="audit-flag">
                            <img
                                src={flag.type === 'alert' ? alertIcon : checkIcon}
                                alt=""
                                className={flag.type === 'alert' ? 'audit-flag__icon' : 'audit-flag__success-icon'}
                            />
                            <div className="audit-flag__content">
                                <p className={`audit-flag__number audit-flag__alert-text ${flag.type === 'success' ? 'audit-flag__alert-text--success' : 'audit-flag__alert-text'}`}>
                                    {flag.number}
                                </p>
                                <p className="audit-flag__label">{flag.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export default ForensicAuditSummary;
