import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import AlertBanner from '../../components/ui/AlertBanner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useProjectDetail from '../../hooks/useProjectDetail';
import ProjectDetailHeader from './components/ProjectDetailHeader';
import KeyMetricsBar from './components/KeyMetricsBar';
import ContractDataPanel from './components/ContractDataPanel';
import ProgressStatusRow from './components/ProgressStatusRow';
import RedFlagsSidebar from './components/RedFlagsSidebar';
import CommunityFieldReport from './components/CommunityFieldReport';
import FieldReportForm from './components/FieldReportForm';
import LocationMap from './components/LocationMap';

function ProjectDetail({ tenderId = '1168015' }) {
    const data = useProjectDetail(tenderId);

    return (
        <>
            <Navbar activeRoute="/projects" />
            <AlertBanner alerts={data.alerts} />

            <main className="project-detail-main">
                <PageWrapper>
                    {data.error ? <ErrorMessage message={data.error} onRetry={data.reload} /> : null}

                    {data.isLoading || !data.hero ? (
                        <div style={{ padding: '24px 0' }}>
                            <LoadingSpinner label="Loading project detail..." />
                        </div>
                    ) : (
                        <>
                            <ProjectDetailHeader breadcrumbs={data.breadcrumbs} hero={data.hero} />
                            <KeyMetricsBar metrics={data.metrics} />

                            <section className="project-detail-content-grid">
                                <div className="project-detail-main-column">
                                    <ContractDataPanel data={data.contractData} />
                                    <ProgressStatusRow tiles={data.progressTiles} />
                                </div>
                                <RedFlagsSidebar redFlags={data.redFlags} evidence={data.evidence} />
                            </section>

                            {/* <section className="project-detail-community-grid">
                                <CommunityFieldReport community={data.community} />
                                <FieldReportForm />
                            </section>

                            <LocationMap location={data.location} /> */}
                        </>
                    )}
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default ProjectDetail;
