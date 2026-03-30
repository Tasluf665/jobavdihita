import StatCard from '../../../components/ui/StatCard';

const STATS = [
    {
        icon: '📊',
        title: 'Total Projects',
        value: '1,248',
        trend: '+12% vs LY',
        trendColor: 'var(--success)',
        iconBg: '#e9f1ff',
    },
    {
        icon: '✅',
        title: 'Completed',
        value: '842',
        trend: 'Verified',
        trendColor: 'var(--success)',
        iconBg: '#e8f7ef',
    },
    {
        icon: '◇',
        title: 'Critical Issues',
        value: '42',
        trend: 'Action Required',
        trendColor: 'var(--danger)',
        iconBg: '#fdeeee',
    },
];

function HeroStats() {
    return (
        <section className="hero-stats-grid" aria-label="Key statistics">
            {STATS.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </section>
    );
}

export default HeroStats;
