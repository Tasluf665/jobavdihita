import ProjectTableRow from './ProjectTableRow';
import ProjectPagination from './ProjectPagination';

const COLUMNS = ['#', 'Tender ID', 'Project Name', 'Contractor', 'Value', 'Dates', 'Progress', 'Days Overdue', 'Status'];

function ProjectTable({ rows = [], pagination, onPageChange }) {
    return (
        <section className="projects-table-wrap" aria-label="Projects table">
            <div className="projects-table-scroll">
                <table className="projects-table">
                    <thead>
                        <tr>
                            {COLUMNS.map((column) => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length ? (
                            rows.map((row) => <ProjectTableRow key={row.tenderId} row={row} />)
                        ) : (
                            <tr>
                                <td colSpan={COLUMNS.length} style={{ textAlign: 'center', padding: '20px 10px' }}>
                                    No projects found for the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ProjectPagination pagination={pagination} onPageChange={onPageChange} />
        </section>
    );
}

export default ProjectTable;
