import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useRedFlags from '../../hooks/useRedFlags';
import RedFlagCounterBar from './components/RedFlagCounterBar';
import GhostProjectsTable from './components/GhostProjectsTable';
import ImpossibleTimelineCards from './components/ImpossibleTimelineCards';
import RepeatWinnerCards from './components/RepeatWinnerCards';

function RedFlags() {
    const data = useRedFlags();
    const hasExistingContent =
        (data.counters?.length || 0) > 0 ||
        (data.ghostRows?.length || 0) > 0 ||
        (data.timelineCards?.length || 0) > 0 ||
        (data.repeatWinners?.length || 0) > 0;
    const isInitialLoad = data.isLoading && !hasExistingContent;

    return (
        <>
            <Navbar activeRoute="/red-flags" />

            <main className="red-flags-main">
                <PageWrapper>
                    <section className="red-flags-hero">
                        <h1>🚨 Red Flag Detector</h1>
                        <p>
                            Identifying suspicious patterns, ghost projects, and anomalies in Munshiganj&apos;s public
                            procurement and infrastructure development.
                        </p>
                    </section>

                    {data.error ? <ErrorMessage message={data.error} onRetry={data.reload} /> : null}

                    {isInitialLoad ? (
                        <div style={{ padding: '24px 0' }}>
                            <LoadingSpinner label="Loading red flags..." />
                        </div>
                    ) : (
                        <>
                            <RedFlagCounterBar counters={data.counters} />
                            <GhostProjectsTable
                                rows={data.ghostRows}
                                pagination={data.ghostPagination}
                                onPageChange={data.setPage}
                            />
                            <ImpossibleTimelineCards cards={data.timelineCards} />
                            <RepeatWinnerCards items={data.repeatWinners} />
                        </>
                    )}
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default RedFlags;
