import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useDashboard from '../../hooks/useDashboard';
import HeroStats from './components/HeroStats';
import BudgetAllocationBar from './components/BudgetAllocationBar';
import RedFlagPreview from './components/RedFlagPreview';
import RecentCompletions from './components/RecentCompletions';
import AnnualBudgetChart from './components/AnnualBudgetChart';

function Home() {
    const { district, alerts, isLoading, error, heroStats, budget, redFlags, recentCompletions, yearlyAudit, reload } =
        useDashboard('Munshiganj');

    return (
        <>
            <Navbar />

            <main className="home-main">
                <PageWrapper>
                    <section>
                        <h1 className="h1-display" style={{ margin: 0 }}>
                            Civic Watchdog: {district}
                        </h1>
                        <p className="hero-subtitle body-lg">
                            Real-time transparency monitoring for public infrastructure and budget allocation in the
                            {' '}
                            {district} district.
                        </p>
                    </section>

                    {isLoading ? (
                        <div style={{ marginTop: '20px' }}>
                            <LoadingSpinner label="Syncing latest civic data..." />
                        </div>
                    ) : null}

                    {error ? (
                        <div style={{ marginTop: '20px' }}>
                            <ErrorMessage message={error} onRetry={reload} />
                        </div>
                    ) : null}

                    <HeroStats stats={heroStats} />
                    <BudgetAllocationBar budget={budget} />

                    <section className="two-column-section">
                        <RedFlagPreview items={redFlags} />
                        <RecentCompletions items={recentCompletions} />
                    </section>

                    <AnnualBudgetChart bars={yearlyAudit} />
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default Home;
