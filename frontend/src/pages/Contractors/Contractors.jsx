import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/feedback/ErrorMessage';
import useContractor from '../../hooks/useContractor';
import ContractorHeader from './components/ContractorHeader';
import RiskIndexCard from './components/RiskIndexCard';
import ContractorStatBar from './components/ContractorStatBar';
import PhysicalAuditBar from './components/PhysicalAuditBar';
import ContractLedgerTable from './components/ContractLedgerTable';
import RedFlagDossier from './components/RedFlagDossier';
function Contractors({ contractorId }) {
    const query = new URLSearchParams(window.location.search);
    const fallbackContractorId = query.get('id');
    const resolvedContractorId = contractorId || fallbackContractorId;

    const data = useContractor(resolvedContractorId);

    return (
        <>
            <Navbar activeRoute="/projects" />

            <main className="contractors-main">
                <PageWrapper>
                    <ContractorHeader {...data.header} />

                    {!resolvedContractorId ? (
                        <ErrorMessage message="No contractor ID provided in route." />
                    ) : null}

                    {data.error ? <ErrorMessage message={data.error} onRetry={data.reload} /> : null}

                    {data.isLoading && !data.hasData ? (
                        <div style={{ padding: '24px 0' }}>
                            <LoadingSpinner label="Loading contractor profile..." />
                        </div>
                    ) : null}

                    {data.hasData ? (
                        <>
                            <RiskIndexCard profile={data.profile} />
                            <ContractorStatBar items={data.scorecardItems} />
                            <PhysicalAuditBar deliveredPct={data.audit.deliveredPct} breachedPct={data.audit.breachedPct} />
                            <ContractLedgerTable
                                rows={data.ledgerRows}
                                pagination={data.ledgerPagination}
                                onPageChange={data.setPage}
                            />
                            <RedFlagDossier cards={data.dossierCards} />
                        </>
                    ) : null}
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default Contractors;
