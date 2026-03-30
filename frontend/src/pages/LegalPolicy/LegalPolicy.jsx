import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';

function PrivacyPolicy() {
    return (
        <>
            <Navbar />

            <main className="privacy-main">
                <PageWrapper>
                    <section className="privacy-shell" aria-label="Privacy policy">
                        <article className="privacy-hero-card">
                            <span className="privacy-kicker">Legal & Data Notice</span>
                            <h1 className="privacy-title">Privacy Policy</h1>
                            <p className="privacy-meta">Jovabdihita • Last updated: March 30, 2026</p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">1. Who We Are</h2>
                            <p className="privacy-text">
                                Jovabdihita is an independent civic transparency platform dedicated to monitoring government
                                procurement contracts in Munshiganj District, Bangladesh. We are not affiliated with any political
                                party, government body, or commercial organization.
                            </p>
                            <p className="privacy-text">
                                Our sole purpose is to make publicly available government data accessible and understandable to
                                ordinary citizens.
                            </p>
                            <p className="privacy-text">
                                All data displayed on this platform is sourced exclusively from official Bangladesh government
                                portals, primarily the National e-GP Portal (eprocure.gov.bd) and the Mirkadim Pourashava official
                                website (mirkadimps.munshiganj.gov.bd).
                            </p>
                            <p className="privacy-text">
                                If you have any questions about this policy, contact:{' '}
                                <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a>
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">2. What Data We Collect</h2>
                            <h3 className="privacy-subtitle">2.1 Government Contract Data (Not Personal Data)</h3>
                            <p className="privacy-text">
                                The primary data on this platform consists of official government procurement records. This includes
                                contractor names, company registration numbers, beneficial ownership information, engineer names and
                                designations, contract values, tender IDs, and project timelines.
                            </p>
                            <p className="privacy-text">
                                This data is collected from official public government sources where it has already been disclosed
                                by law. Under the Bangladesh Public Procurement Act 2006 and the Right to Information Act 2009,
                                this information is a matter of public record.
                            </p>

                            <h3 className="privacy-subtitle">2.2 Technical Data Collected Automatically</h3>
                            <p className="privacy-text">
                                When you visit our website, our servers automatically record basic technical information including
                                your IP address, browser type, device type, pages visited, and visit duration.
                            </p>
                            <p className="privacy-text">
                                This is used solely for maintaining platform security and performance, in aggregate form. We do not
                                build individual behavior profiles or track users across other websites.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">3. Data Sharing</h2>
                            <ul className="privacy-list">
                                <li>
                                    <strong>With hosting and infrastructure providers:</strong> only for operating this platform and
                                    under data processing controls.
                                </li>
                                <li>
                                    <strong>When required by law:</strong> in response to valid legal orders from competent
                                    authorities.
                                </li>
                                <li>
                                    <strong>In anonymized aggregate form:</strong> for research in the public interest.
                                </li>
                                <li>
                                    <strong>Government contract data is inherently public:</strong> our publication is a republication
                                    and analysis of already public records.
                                </li>
                            </ul>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">5. Data Retention</h2>
                            <p className="privacy-text">
                                Government contract data is retained indefinitely. The historical record of public spending is of
                                permanent public interest.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">6. Cookies</h2>
                            <p className="privacy-text">
                                This platform uses a minimal number of cookies strictly necessary for functionality, such as session
                                state and temporary preference memory.
                            </p>
                            <p className="privacy-text">
                                We do not use advertising cookies, cross-site tracking cookies, or third-party behavioral analytics
                                cookies.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">7. Security</h2>
                            <p className="privacy-text">
                                We apply reasonable technical safeguards including HTTPS, protected storage, periodic review, and
                                restricted backend access controls.
                            </p>
                            <p className="privacy-text">
                                No internet-based system can guarantee complete security. If you discover a vulnerability, contact{' '}
                                <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a>. Target response time: 48
                                hours.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">8. Rights of Individuals Named in Public Records</h2>
                            <ul className="privacy-list">
                                <li>Request factual correction with supporting evidence.</li>
                                <li>Request a context note where important documented context is missing.</li>
                                <li>Dispute a red flag with official-source proof.</li>
                            </ul>
                            <p className="privacy-text">
                                We cannot remove accurate, lawfully obtained public records solely due to personal preference or
                                reputational concern.
                            </p>
                            <p className="privacy-text">
                                To submit requests, email{' '}
                                <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a> with subject “Data
                                Correction Request”. Response target: 10 business days.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">9. Children</h2>
                            <p className="privacy-text">
                                This platform is not directed at children under 13 and does not knowingly collect children’s
                                personal data.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">10. External Links</h2>
                            <p className="privacy-text">
                                External websites linked from this platform (including eprocure.gov.bd,
                                mirkadimps.munshiganj.gov.bd, acc.org.bd, and World Bank integrity resources) have independent
                                privacy practices. Please review their policies directly.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">11. Changes to This Policy</h2>
                            <p className="privacy-text">
                                This policy may be updated over time. When changes are made, the “Last updated” date will be
                                revised. Significant updates will be announced prominently.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">12. Our Commitment</h2>
                            <p className="privacy-text">
                                This platform was built by concerned citizens of Munshiganj for the people of Munshiganj. We have
                                no commercial or political interest in your data.
                            </p>
                            <p className="privacy-text">
                                Our only interest is transparency in how public money is spent and enabling public scrutiny of public
                                records.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">13. Contact</h2>
                            <p className="privacy-text">
                                Email: <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a>
                            </p>
                            <p className="privacy-text">Response time: within 10 business days.</p>
                        </article>
                    </section>
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default PrivacyPolicy;
