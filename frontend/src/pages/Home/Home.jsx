import AlertBanner from '../../components/ui/AlertBanner';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import HeroStats from './components/HeroStats';
import BudgetAllocationBar from './components/BudgetAllocationBar';
import RedFlagPreview from './components/RedFlagPreview';
import RecentCompletions from './components/RecentCompletions';
import AnnualBudgetChart from './components/AnnualBudgetChart';

const ALERTS = [
    'Urgent: Audit pending for Munshiganj Road Project ID #9928',
    'New transparency report released for Munshiganj City Council',
    'Budget discrepancy flagged in Munshiganj District Health sector',
];

function Home() {
    return (
        <>
            <AlertBanner alerts={ALERTS} />
            <Navbar />

            <main className="home-main">
                <PageWrapper>
                    <section>
                        <h1 className="h1-display" style={{ margin: 0 }}>
                            Civic Watchdog: Munshiganj
                        </h1>
                        <p className="hero-subtitle body-lg">
                            Real-time transparency monitoring for public infrastructure and budget allocation in the
                            Munshiganj district.
                        </p>
                    </section>

                    <HeroStats />
                    <BudgetAllocationBar />

                    <section className="two-column-section">
                        <RedFlagPreview />
                        <RecentCompletions />
                    </section>

                    <AnnualBudgetChart />
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default Home;
