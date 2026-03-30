import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';

function Contact() {
    return (
        <>
            <Navbar />

            <main className="privacy-main">
                <PageWrapper>
                    <section className="privacy-shell" aria-label="Contact information">
                        <article className="privacy-hero-card">
                            <span className="privacy-kicker">Contact</span>
                            <h1 className="privacy-title">Jovabdihita</h1>
                            <p className="privacy-meta">Built by One Person, for a Community</p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">Built by One Person, for a Community</h2>
                            <p className="privacy-text">
                                This platform was not built by an organization, an NGO, or a funded initiative. It was
                                designed, architected, and developed by a single developer — someone who was born in
                                Munshiganj, and who believes that the people of his hometown deserve to know how public
                                money is being spent in their name.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">The Developer</h2>
                            <h3 className="privacy-subtitle">Md Tasluf Ahmed</h3>
                            <p className="privacy-text">
                                Erasmus Mundus Scholar, currently pursuing a Master&apos;s Degree in{' '}
                                <strong>Software Engineering for Green Deals</strong> — an Erasmus Mundus Joint
                                Master&apos;s programme funded by the European Union, awarded to students selected on
                                academic excellence from across the world.
                            </p>
                            <p className="privacy-text">Originally from Munshiganj, Bangladesh.</p>
                            <p className="privacy-text">
                                This project is personal. The contracts on this platform are from the town where I grew
                                up. The roads, the drains, the public toilets, the passenger sheds — these are the
                                infrastructure of the community my family still lives in. When a contractor takes public
                                money and delivers nothing, it is not an abstract statistic. It is a broken road my
                                mother walks on.
                            </p>
                            <p className="privacy-text">
                                I built this platform because I had the skills to build it, and because no one else had.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">Connect</h2>
                            <p className="privacy-text">
                                If you are a journalist investigating procurement irregularities in Bangladesh, a
                                researcher studying civic technology, a developer who wants to contribute, or simply
                                someone from Munshiganj who wants to talk — I would genuinely like to hear from you.
                            </p>
                            <ul className="privacy-list">
                                <li>
                                    <strong>GitHub:</strong>{' '}
                                    <a href="https://github.com/Tasluf665" target="_blank" rel="noreferrer">
                                        github.com/Tasluf665
                                    </a>
                                    <p className="privacy-text">
                                        The source code for this platform is open. You can see exactly how the data is
                                        collected, processed, and displayed. Transparency in the platform itself felt
                                        like the only honest approach for a platform about transparency.
                                    </p>
                                </li>
                                <li>
                                    <strong>LinkedIn:</strong>{' '}
                                    <a href="https://www.linkedin.com/in/tasluf/" target="_blank" rel="noreferrer">
                                        linkedin.com/in/tasluf
                                    </a>
                                    <p className="privacy-text">
                                        For professional inquiries, collaboration proposals, or if you are working on
                                        civic technology, open government data, or anti-corruption tooling anywhere in
                                        the world.
                                    </p>
                                </li>
                                <li>
                                    <strong>Facebook:</strong>{' '}
                                    <a href="https://www.facebook.com/tasluf.ahmed/" target="_blank" rel="noreferrer">
                                        facebook.com/tasluf.ahmed
                                    </a>
                                    <p className="privacy-text">
                                        For anyone from Munshiganj — if you have information about a project on this
                                        platform, if you know something that the official records do not show, or if you
                                        simply want to share this platform with people who should see it.
                                    </p>
                                </li>
                            </ul>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">Platform-Specific Inquiries</h2>
                            <ul className="privacy-list">
                                <li>
                                    <strong>Data corrections or disputes:</strong>{' '}
                                    <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a>
                                </li>
                                <li>
                                    <strong>Security vulnerabilities:</strong>{' '}
                                    <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a>
                                </li>
                                <li>
                                    <strong>General inquiries and press:</strong>{' '}
                                    <a href="mailto:taslufmorshed665@gmail.com">taslufmorshed665@gmail.com</a>
                                </li>
                            </ul>
                            <p className="privacy-text">
                                All emails are read personally. Response time is typically within 5 business days,
                                though I am a full-time student and responses may occasionally take longer during exam
                                periods.
                            </p>
                        </article>

                        <article className="privacy-card">
                            <h2 className="privacy-section-title">Want to Contribute?</h2>
                            <p className="privacy-text">
                                This platform covers Munshiganj District. Bangladesh has 64 districts. There is no
                                technical reason this cannot eventually cover all of them.
                            </p>
                            <p className="privacy-text">
                                If you are a developer and want to help expand coverage, improve the red flag detection
                                engine, add Bengali language support, or build the mobile version — the repository is
                                open and contributions are welcome.
                            </p>
                            <p className="privacy-text">
                                If you are from another district of Bangladesh and want to deploy a version of this
                                platform for your own community, reach out. I will help you get started.
                            </p>
                            <p className="privacy-text">
                                If you are a data journalist and want access to the raw dataset for investigative
                                reporting, get in touch. Supporting journalism that holds power accountable is one of
                                the reasons this data is collected in the first place.
                            </p>
                            <p className="privacy-text">
                                <em>"মানুষের টাকা, মানুষ জানবে।"</em>
                                <br />
                                <em>"It is the people&apos;s money. The people should know."</em>
                            </p>
                        </article>
                    </section>
                </PageWrapper>
            </main>

            <Footer />
        </>
    );
}

export default Contact;
