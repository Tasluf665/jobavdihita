import ProgressCell from './ProgressCell';

function ProjectTableRow({ row }) {
    return (
        <tr className="projects-table-row">
            <td>{row.id}</td>
            <td className="projects-tender-id">
                <a href={`/projects/${row.tenderId}`} className="projects-row-link">
                    {row.tenderId}
                </a>
            </td>
            <td>
                <a href={`/projects/${row.tenderId}`} className="projects-name-cell projects-row-link" title={row.projectName}>
                    {row.projectName}
                </a>
            </td>
            <td className={row.danger ? 'projects-text-danger' : ''}>
                {row.contractorId ? (
                    <a href={`/contractors/${row.contractorId}`} className="projects-row-link">
                        {row.contractor}
                    </a>
                ) : (
                    row.contractor
                )}
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
            <td className={row.danger ? 'projects-text-danger projects-overdue' : 'projects-overdue'}>{row.overdueDays}</td>
            <td>
                <span className={`projects-status-chip projects-status-chip--${row.statusTone}`}>{row.status}</span>
            </td>
        </tr>
    );
}

export default ProjectTableRow;
