function RedFlagCounterBar({ counters = [] }) {
    return (
        <section className="red-flags-counter-grid" aria-label="Red flags summary">
            {counters.map((counter) => (
                <article key={counter.label} className={`red-flags-counter-card red-flags-counter-card--${counter.tone}`}>
                    <p className="red-flags-counter-label">{counter.label}</p>
                    <p className="red-flags-counter-value">{counter.value}</p>
                    <p className="red-flags-counter-helper">{counter.helper}</p>
                </article>
            ))}
        </section>
    );
}

export default RedFlagCounterBar;
