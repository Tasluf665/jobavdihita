import PageWrapper from './PageWrapper';

const FOOTER_LINKS = ['Data Sources', 'Disclaimer', 'Privacy Policy', 'Contact'];

function Footer() {
    return (
        <footer className="app-footer">
            <PageWrapper className="app-footer__inner">
                <div>
                    <div className="footer-brand">Munshiganj Shotter Khoj</div>
                    <p className="footer-copy">
                        © 2024 Munshiganj Shotter Khoj. All data sourced from official civic portals.
                    </p>
                </div>

                <div className="footer-links">
                    {FOOTER_LINKS.map((link) => (
                        <span key={link}>{link}</span>
                    ))}
                </div>
            </PageWrapper>
        </footer>
    );
}

export default Footer;
