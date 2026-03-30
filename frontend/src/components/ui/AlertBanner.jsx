import PageWrapper from '../layout/PageWrapper';

function AlertBanner({ alerts = [] }) {
    return (
        <section className="top-alert" aria-label="Active alerts">
            <PageWrapper>
                <div className="top-alert__track">
                    {alerts.map((alert) => (
                        <span key={alert} className="top-alert__item">
                            <span className="top-alert__dot" />
                            {alert}
                        </span>
                    ))}
                </div>
            </PageWrapper>
        </section>
    );
}

export default AlertBanner;
