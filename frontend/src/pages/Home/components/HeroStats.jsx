import StatCard from '../../../components/ui/StatCard';

function HeroStats({ stats = [] }) {
    return (
        <section className="hero-stats-grid" aria-label="Key statistics">
            {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </section>
    );
}

export default HeroStats;
