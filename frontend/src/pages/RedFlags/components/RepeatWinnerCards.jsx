const PLACEHOLDER_IMAGE = 'https://www.figma.com/api/mcp/asset/b2e10abc-7b9f-406e-b223-fd7d923f4aa7';

function RepeatWinnerCards({ items = [] }) {
    return (
        <section className="red-flags-section">
            <h2>Repeat Winner Alerts</h2>

            <div className="red-flags-repeat-grid">
                {items.map((item) => (
                    <article key={item.name} className="red-flags-repeat-card">
                        <img src={PLACEHOLDER_IMAGE} alt="Contractor" />

                        <div className="red-flags-repeat-body">
                            <div className="red-flags-repeat-head">
                                <h3>{item.name}</h3>
                                <span>{item.risk}</span>
                            </div>

                            <p>{item.summary}</p>

                            <div className="red-flags-repeat-track">
                                <div>
                                    <span>Completion Track Record</span>
                                    <strong>{item.completion}</strong>
                                </div>
                                <div className="red-flags-repeat-bar">
                                    <div style={{ width: `${Math.max(0, Math.min(100, Number(item.completionPct || 0)))}%` }} />
                                </div>
                            </div>

                            <div className="red-flags-repeat-stats">
                                <div>
                                    <span>Total Value</span>
                                    <strong>{item.totalValue}</strong>
                                </div>
                                <div>
                                    <span>Tenders Won</span>
                                    <strong>{item.tendersWon}</strong>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RepeatWinnerCards;
