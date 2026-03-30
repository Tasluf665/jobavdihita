import SectionHeader from '../../../components/ui/SectionHeader';
import StatusBadge from '../../../components/ui/StatusBadge';

const COMPLETIONS = [
    {
        title: 'District Library Digital Wing',
        description: 'Delivered 12 days early. Verified by local NGO.',
    },
    {
        title: 'Rural Solar Grid Phase III',
        description: 'Budget spent accurately as per public records.',
    },
];

function RecentCompletions() {
    return (
        <section>
            <SectionHeader icon="🧷" title="Recent Completions" actionLabel="Full History" />

            <div className="issue-list">
                {COMPLETIONS.map((item) => (
                    <article key={item.title} className="issue-item" style={{ borderLeftColor: 'var(--success)' }}>
                        <div>
                            <h4 className="issue-item__title">{item.title}</h4>
                            <p className="issue-item__desc">{item.description}</p>
                        </div>
                        <StatusBadge tone="success">Success</StatusBadge>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RecentCompletions;
