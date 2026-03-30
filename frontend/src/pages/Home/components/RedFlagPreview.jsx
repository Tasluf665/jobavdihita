import SectionHeader from '../../../components/ui/SectionHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import truncateText from '../../../utils/truncateText';

function RedFlagPreview({ items = [] }) {
    return (
        <section>
            <SectionHeader icon="🚩" title="Red Flag Projects" actionLabel="View All" />

            <div className="issue-list">
                {items.map((item) => (
                    <article key={item.title} className="issue-item" style={{ borderLeftColor: 'var(--danger)' }}>
                        <div className="issue-item__content">
                            <h4 className="issue-item__title" title={item.title}>
                                {truncateText(item.title)}
                            </h4>
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
