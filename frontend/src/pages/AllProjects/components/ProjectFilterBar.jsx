function FilterSelect({ label, value, options = [], onChange }) {
    return (
        <label className="projects-filter-control">
            <span className="projects-filter-label">{label}</span>
            <select className="projects-select" value={value} onChange={(event) => onChange(event.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function ProjectFilterBar({
    filters,
    options,
    onYearChange,
    onStatusChange,
    onSortChange,
    onSearch,
    onReset,
}) {
    const handleSearch = () => {
        onSearch(filters.searchTerm.trim());
    };

    const handleReset = () => {
        onReset();
    };

    return (
        <section className="projects-filter-bar" aria-label="Project filters">
            <FilterSelect
                label="Fiscal Year"
                value={filters.year}
                options={options.yearOptions}
                onChange={onYearChange}
            />
            <FilterSelect
                label="Project Status"
                value={filters.status}
                options={options.statusOptions}
                onChange={onStatusChange}
            />
            <FilterSelect
                label="Sort By"
                value={filters.sortBy}
                options={options.sortOptions}
                onChange={onSortChange}
            />

            <div className="projects-filter-search-wrap">
                <label className="projects-filter-control projects-filter-control--grow">
                    <span className="projects-filter-label">Search Project / ID</span>
                    <div className="projects-filter-search-row">
                        <input
                            className="projects-search-input"
                            placeholder="Enter keywords..."
                            value={filters.searchTerm}
                            onChange={(event) => onSearch(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button className="btn btn--sm btn--primary" type="button" onClick={handleSearch}>
                            Search
                        </button>
                        <button className="btn btn--sm btn--secondary" type="button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </label>
            </div>
        </section>
    );
}

export default ProjectFilterBar;
