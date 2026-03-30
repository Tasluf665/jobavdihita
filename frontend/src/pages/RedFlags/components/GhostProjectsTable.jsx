import ProjectPagination from '../../AllProjects/components/ProjectPagination';

const COLUMNS = ['Tender ID', 'Project Name', 'Contractor', 'Money Allocated', 'Years Overdue', 'Progress'];

function ProgressRows({ financial, physical }) {
    return (
        <div className="red-flags-progress-wrap">
            <div className="red-flags-progress-meta">
                <span>FIN</span>
                <span>{financial}%</span>
            </div>
            <div className="red-flags-progress-track">
                <div className="red-flags-progress-fill red-flags-progress-fill--fin" style={{ width: `${financial}%` }} />
            </div>
            <div className="red-flags-progress-meta">
                <span>PHY</span>
                <span>{physical}%</span>
            </div>
            <div className="red-flags-progress-track">
                <div className="red-flags-progress-fill red-flags-progress-fill--phy" style={{ width: `${physical}%` }} />
            </div>
        </div>
    );
}

function GhostProjectsTable({ rows = [], pagination, onPageChange }) {
    return (
        <section className="red-flags-section">
            <div className="red-flags-section-head">
                <h2>Ghost Projects</h2>
                <span className="red-flags-risk-pill">High Risk Contracts</span>
            </div>

            <div className="projects-table-wrap" aria-label="Ghost projects table">
                <div className="projects-table-scroll">
                    <table className="projects-table red-flags-table">
                        <thead>
                            <tr>
                                {COLUMNS.map((column) => (
                                    <th key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length ? (
                                rows.map((row) => (
                                    <tr key={row.tenderId}>
                                        <td className="red-flags-tender">{row.tenderId}</td>
                                        <td className="red-flags-project">
                                            <a className="red-flags-project-link" href={`/projects/${row.tenderRef}`}>
                                                {row.projectName}
                                            </a>
                                        </td>
                                        <td>
                                            <a
                                                className="red-flags-project-link"
                                                href={row.contractorId ? `/contractors/${row.contractorId}` : '/contractors'}
                                            >
                                                {row.contractor}
                                            </a>
                                        </td>
                                        <td className="red-flags-money">{row.money}</td>
                                        <td className="red-flags-overdue">{row.overdueYears}</td>
                                        <td>
                                            <ProgressRows financial={row.financial} physical={row.physical} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={COLUMNS.length} style={{ textAlign: 'center', padding: '20px 10px' }}>
                                        No ghost projects found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <ProjectPagination pagination={pagination} onPageChange={onPageChange} />
            </div>
        </section>
    );
}

export default GhostProjectsTable;
