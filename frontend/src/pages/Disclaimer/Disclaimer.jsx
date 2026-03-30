import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';

function Disclaimer() {
    return (
        <>
            <Navbar />

            <main className="disclaimer-main">
                <PageWrapper>
                    <section className="disclaimer-shell" aria-label="Website disclaimer">
                        <article className="disclaimer-hero-card">
                            <span className="disclaimer-kicker">Public Information Notice</span>
                            <h1 className="disclaimer-title">Disclaimer</h1>
                            <p className="disclaimer-text">
                                The primary objective of Jovabdihita is to raise awareness among citizens regarding public
                                procurement, project execution, and accountability.
                            </p>
                        </article>

                        <div className="disclaimer-grid">
                            <article className="disclaimer-card" aria-label="Scope and intent">
                                <h2 className="disclaimer-section-title">Scope & Intent</h2>
                                <p className="disclaimer-text">
                                    This platform presents project-level analysis and summaries based on publicly available
                                    procurement data. Findings are designed for public awareness and should not be treated as legal
                                    conclusions.
                                </p>

                                <ul className="disclaimer-list">
                                    <li>Information is prepared to support transparency and civic awareness.</li>
                                    <li>Project status may differ from real-time field conditions.</li>
                                    <li>Users should independently verify records before making decisions.</li>
                                </ul>
                            </article>

                            <article className="disclaimer-card" aria-label="Data source and update policy">
                                <h2 className="disclaimer-section-title">Data Source & Update Policy</h2>
                                <p className="disclaimer-text">
                                    All data displayed on this website is sourced from the official Government e-GP portal:
                                </p>
                                <p className="disclaimer-link-row">
                                    <a href="https://www.eprocure.gov.bd/" target="_blank" rel="noreferrer">
                                        https://www.eprocure.gov.bd/
                                    </a>
                                </p>

                                <div className="disclaimer-note" role="note">
                                    <p>
                                        Data from the Government source is synchronized once per week. Therefore, live updates for
                                        a specific project may not always be available on this platform.
                                    </p>
                                </div>

                                <p className="disclaimer-text">
                                    For final verification and the latest official records, please use the main Government website
                                    above.
                                </p>
                            </article>
                        </div>
                    </section>
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default Disclaimer;
