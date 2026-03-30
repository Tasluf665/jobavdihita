const getVisiblePages = (page, totalPages) => {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    if (page <= 3) {
        return [1, 2, 3, 4, '…', totalPages];
    }

    if (page >= totalPages - 2) {
        return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '…', page - 1, page, page + 1, '…', totalPages];
};

function ProjectPagination({ pagination, onPageChange }) {
    const page = pagination?.page || 1;
    const totalPages = Math.max(1, pagination?.totalPages || 1);
    const total = pagination?.total || 0;
    const shownStart = pagination?.shownStart || 0;
    const shownEnd = pagination?.shownEnd || 0;
    const pageItems = getVisiblePages(page, totalPages);

    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;

    return (
        <div className="projects-pagination">
            <p className="projects-pagination-text">
                Showing {shownStart} to {shownEnd} of {total} projects
            </p>
            <div className="projects-pagination-controls" aria-label="Table pagination">
                <button
                    className="projects-page-btn"
                    type="button"
                    disabled={!canGoPrev}
                    onClick={() => canGoPrev && onPageChange(page - 1)}
                >
                    ‹
                </button>

                {pageItems.map((item, index) => {
                    if (item === '…') {
                        return (
                            <button key={`ellipsis-${index}`} className="projects-page-btn" type="button" aria-hidden="true">
                                …
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item}
                            className={`projects-page-btn ${item === page ? 'projects-page-btn--active' : ''}`}
                            type="button"
                            onClick={() => onPageChange(item)}
                        >
                            {item}
                        </button>
                    );
                })}

                <button
                    className="projects-page-btn"
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => canGoNext && onPageChange(page + 1)}
                >
                    ›
                </button>
            </div>
        </div>
    );
}

export default ProjectPagination;
