import SectionHeader from '../../../components/ui/SectionHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import truncateText from '../../../utils/truncateText';

function RecentCompletions({ items = [] }) {
    return (
        <section>
            <SectionHeader icon="🧷" title="Recent Completions" actionLabel="Full History" />

            <div className="issue-list">
                {items.map((item) => (
                    <article key={item.title} className="issue-item" style={{ borderLeftColor: 'var(--success)' }}>
                        <div className="issue-item__content">
                            <h4 className="issue-item__title" title={item.title}>
                                {truncateText(item.title)}
                            </h4>
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
