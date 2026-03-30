function FieldReportForm() {
    return (
        <section className="project-detail-field-form">
            <h3 className="project-detail-card-title">Submit Field Verification</h3>

            <div className="project-detail-form-statuses">
                <button type="button" className="is-selected">
                    Not Done
                </button>
                <button type="button">Partial</button>
                <button type="button">Done</button>
            </div>

            <textarea placeholder="Describe site conditions (optional)..." />

            <div className="project-detail-form-extra">
                <button type="button" className="project-detail-upload-box">
                    Upload Photo Evidence
                </button>
                <div className="project-detail-upload-note">
                    Submissions are cryptographically signed. Metadata (GPS and timestamp) is used to verify
                    authenticity.
                </div>
            </div>

            <button type="button" className="project-detail-commit-btn">
                Commit Report to Ledger
            </button>
        </section>
    );
}

export default FieldReportForm;
