import SectionHeader from '../../../components/ui/SectionHeader';
import StatusBadge from '../../../components/ui/StatusBadge';

const RED_FLAGS = [
    {
        title: 'Munshiganj Bridge Connector #4',
        description: '142 days overdue. Contractor unresponsive since July.',
    },
    {
        title: 'Upazila Health Complex Renovation',
        description: 'Materials quality audit failed 3 times.',
    },
];

function RedFlagPreview() {
    return (
        <section>
            <SectionHeader icon="🚩" title="Red Flag Projects" actionLabel="View All" />

            <div className="issue-list">
                {RED_FLAGS.map((item) => (
                    <article key={item.title} className="issue-item" style={{ borderLeftColor: 'var(--danger)' }}>
                        <div>
                            <h4 className="issue-item__title">{item.title}</h4>
                            <p className="issue-item__desc">{item.description}</p>
                        </div>
                        <StatusBadge tone="critical">Critical</StatusBadge>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RedFlagPreview;
