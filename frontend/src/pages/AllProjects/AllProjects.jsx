import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useContracts from '../../hooks/useContracts';
import ProjectSummaryBar from './components/ProjectSummaryBar';
import ProjectFilterBar from './components/ProjectFilterBar';
import ProjectTable from './components/ProjectTable';

function AllProjects() {
    const {
        isLoading,
        error,
        summaryItems,
        rows,
        pagination,
        filters,
        options,
        setYearFilter,
        setStatusFilter,
        setSortBy,
        setSearchTerm,
        resetFilters,
        setPage,
        reload,
    } = useContracts();

    return (
        <>
            <Navbar activeRoute="/projects" />

            <main className="projects-main">
                <PageWrapper>
                    <section className="projects-header">
                        <div>
                            <h1 className="projects-title">ALL PROJECTS</h1>
                            <p className="projects-subtitle">
                                Comprehensive forensic database of all civic infrastructure projects within Munshiganj
                                District. Cross-referencing LGD records with ground-truth evidence.
                            </p>
                        </div>
                    </section>

                    {error ? <ErrorMessage message={error} onRetry={reload} /> : null}

                    <ProjectSummaryBar items={summaryItems} />

                    <ProjectFilterBar
                        filters={filters}
                        options={options}
                        onYearChange={setYearFilter}
                        onStatusChange={setStatusFilter}
                        onSortChange={setSortBy}
                        onSearch={setSearchTerm}
                        onReset={resetFilters}
                    />

                    {isLoading ? (
                        <div style={{ padding: '24px 0' }}>
                            <LoadingSpinner label="Loading project data..." />
                        </div>
                    ) : (
                        <ProjectTable rows={rows} pagination={pagination} onPageChange={setPage} />
                    )}
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default AllProjects;
