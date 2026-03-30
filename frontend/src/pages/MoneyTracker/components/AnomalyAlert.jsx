function AnomalyAlert({ message }) {
    return (
        <div className="money-anomaly-alert" role="status" aria-live="polite">
            <span className="money-anomaly-alert__icon" aria-hidden="true">
                !
            </span>
            <p>
                <strong>Anomaly Detected:</strong> {message}
            </p>
        </div>
    );
}

export default AnomalyAlert;
