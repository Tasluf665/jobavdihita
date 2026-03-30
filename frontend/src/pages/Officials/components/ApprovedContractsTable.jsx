import ProjectPagination from '../../AllProjects/components/ProjectPagination';
import ProgressCell from '../../AllProjects/components/ProgressCell';

const COLUMNS = ['Tender ID', 'Project Name', 'Value', 'Dates', 'Progress', 'Days Overdue', 'Status'];

function ApprovedContractsTable({ contracts = [], totalCount, pagination, onPageChange }) {
    return (
        <section className="contracts-section">
            <article className="contractors-ledger-wrap" aria-label="Official contract ledger">
                <header className="contractors-ledger-head">
                    <h3>Ledger of Approved Contracts ({totalCount})</h3>
                </header>

                <div className="contractors-ledger-scroll">
                    <table className="projects-table contractors-ledger-table">
                        <thead>
                            <tr>
                                {COLUMNS.map((column) => (
                                    <th key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.length ? (
                                contracts.map((row) => (
                                    <tr key={row.tenderId} className="projects-table-row">
                                        <td className="projects-tender-id">
                                            <a href={`/projects/${row.tenderId}`} className="projects-row-link">
                                                {row.tenderId}
                                            </a>
                                        </td>
                                        <td>
                                            <a
                                                href={`/projects/${row.tenderId}`}
                                                className="projects-name-cell projects-row-link"
                                                title={row.projectName}
                                            >
                                                {row.projectName}
                                            </a>
                                        </td>
                                        <td className="projects-value-cell">{row.value}</td>
                                        <td>
                                            <div className="projects-date-cell">
                                                <span>{row.dates[0]}</span>
                                                <span>{row.dates[1]}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <ProgressCell
                                                physical={row.physical}
                                                financial={row.financial}
                                                tone={row.statusTone === 'ghost' ? 'ghost' : 'ongoing'}
                                            />
                                        </td>
                                        <td className={row.danger ? 'projects-text-danger projects-overdue' : 'projects-overdue'}>
                                            {row.overdueDays}
                                        </td>
                                        <td>
                                            <span className={`projects-status-chip projects-status-chip--${row.statusTone}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={COLUMNS.length} style={{ textAlign: 'center', padding: '20px 10px' }}>
                                        No contracts found for this official.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination ? <ProjectPagination pagination={pagination} onPageChange={onPageChange} /> : null}
            </article>
        </section>
    );
}

export default ApprovedContractsTable;
