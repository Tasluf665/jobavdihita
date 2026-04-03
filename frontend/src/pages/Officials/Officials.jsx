import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useOfficial from '../../hooks/useOfficial';
import OfficialHeader from './components/OfficialHeader';
import OfficialStatBar from './components/OfficialStatBar';
import ProjectLifecycleBar from './components/ProjectLifecycleBar';
import ForensicAuditSummary from './components/ForensicAuditSummary';
import ApprovedContractsTable from './components/ApprovedContractsTable';
import SystemicPatternCards from './components/SystemicPatternCards';
import './officials.css';

function Officials({ officialId }) {
    const data = useOfficial(officialId);

    return (
        <>
            <Navbar activeRoute="/officials" />

            <main className="officials-main">
                <PageWrapper>
                    <section className="officials-hero">
                        <h1 className="officials-hero__title">Officials & Engineers</h1>
                        <p className="officials-hero__desc">
                            Public accountability profile and procurement ledger mapping for Munshiganj Shotter Khoj.
                        </p>
                    </section>

                    {data.error ? <ErrorMessage message={data.error} onRetry={data.reload} /> : null}

                    {data.isLoading && !data.hasData ? (
                        <div style={{ padding: '24px 0' }}>
                            <LoadingSpinner label="Loading official accountability profile..." />
                        </div>
                    ) : null}

                    {data.hasData ? (
                        <div className="officials-grid">
                            {/* Main Content - Left Side */}
                            <div className="officials-main-content">
                                {/* Official Header */}
                                <OfficialHeader official={data.official} />

                                {/* Stat Bar */}
                                <OfficialStatBar stats={data.stats} />

                                {/* Project Lifecycle */}
                                <ProjectLifecycleBar {...data.lifecycle} />
                            </div>

                            {/* Sidebar - Right Side */}
                            <div className="officials-sidebar">
                                <ForensicAuditSummary auditData={data.audit} flags={data.audit.flags} />
                            </div>

                            {/* Table - Full Width */}
                            <ApprovedContractsTable
                                contracts={data.contracts}
                                totalCount={data.totalCount}
                                pagination={data.ledgerPagination}
                                onPageChange={data.setPage}
                            />

                            {/* Pattern Cards - Full Width */}
                            <SystemicPatternCards patterns={data.patterns} />
                        </div>
                    ) : null}
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default Officials;
