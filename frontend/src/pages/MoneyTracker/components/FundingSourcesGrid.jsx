const getRateTone = (rate) => {
    if (rate >= 45) {
        return 'success';
    }

    if (rate >= 25) {
        return 'warning';
    }

    return 'danger';
};

function FundingSourceCard({ source }) {
    const tone = getRateTone(source.deliveryRate);
    const roundedRate = source.deliveryRate.toFixed(2);

    return (
        <article className="money-source-card">
            <p className="money-source-card__title">{source.title}</p>

            <div className="money-source-card__amount-wrap">
                <p className="money-source-card__amount">{source.amount}</p>
                <p className="money-source-card__contracts">{source.contracts} Contracts</p>
            </div>

            <div className="money-source-card__counts">
                <span className={Number(source.completed) ? 'is-success' : 'is-muted'}>{source.completed} Completed</span>
                <span className={Number(source.overdue) ? 'is-danger' : 'is-muted'}>{source.overdue} Overdue</span>
            </div>

            <div className="money-source-card__rate">
                <div className="money-source-card__rate-head">
                    <span>Delivery Rate</span>
                    <span className={`is-${tone}`}>{roundedRate}%</span>
                </div>

                <div className="money-source-card__rate-track">
                    <span className={`money-source-card__rate-fill is-${tone}`} style={{ width: `${source.deliveryRate}%` }} />
                </div>
            </div>
        </article>
    );
}

function FundingSourcesGrid({ sources = [] }) {
    return (
        <div className="money-source-grid">
            {sources.map((source) => (
                <FundingSourceCard key={`${source.title}-${source.amount}`} source={source} />
            ))}
        </div>
    );
}

export default FundingSourcesGrid;
