import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import AlertBanner from '../../components/ui/AlertBanner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useMoneyTracker from '../../hooks/useMoneyTracker';
import FinancialOverviewCard from './components/FinancialOverviewCard';
import RiskRatioDonut from './components/RiskRatioDonut';
import AnnualSpendingChart from './components/AnnualSpendingChart';
import AnomalyAlert from './components/AnomalyAlert';
import FundingSourcesGrid from './components/FundingSourcesGrid';

function MoneyTracker() {
    const data = useMoneyTracker('Munshiganj');

    return (
        <>
            <Navbar activeRoute="/money" />

            <main className="money-main">
                <PageWrapper>
                    <section className="money-hero">
                        <p className="money-hero__kicker">Transparency Portal</p>
                        <h1 className="money-hero__title">Money Tracker</h1>
                    </section>

                    {data.error ? <ErrorMessage message={data.error} onRetry={data.reload} /> : null}

                    {data.isLoading && !data.hasData ? (
                        <div style={{ padding: '24px 0' }}>
                            <LoadingSpinner label="Loading financial audit data..." />
                        </div>
                    ) : (
                        <>
                            <section className="money-summary-grid">
                                <FinancialOverviewCard
                                    title="Financial Distribution Overview"
                                    totalAmount={data.summary.totalAmount}
                                    stats={data.summary.stats}
                                    segments={data.summary.segments}
                                    note={data.summary.note}
                                />

                                <RiskRatioDonut ratio={data.riskRatio} items={data.riskLegend} />
                            </section>

                            <section className="money-annual-section">
                                <AnnualSpendingChart bars={data.yearlyBars} />
                                <AnomalyAlert message={data.anomalyMessage} />
                            </section>

                            <section className="money-funding-section">
                                <div className="money-funding-section__head">
                                    <h2 className="h3-section" style={{ margin: 0 }}>
                                        Funding by Sources
                                    </h2>
                                    <p className="body-sm">
                                        Detailed allocation and delivery performance across different funding channels.
                                    </p>
                                </div>

                                <FundingSourcesGrid sources={data.fundingSources} />
                            </section>
                        </>
                    )}
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default MoneyTracker;
