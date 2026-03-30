import PageWrapper from './PageWrapper';
import ROUTES from '../../constants/routes';

const FOOTER_LINKS = [
    { label: 'Data Sources', href: 'https://www.eprocure.gov.bd/' },
    { label: 'Disclaimer', href: ROUTES.DISCLAIMER },
    { label: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
    { label: 'Contact', href: ROUTES.CONTACT },
];

function Footer() {
    return (
        <footer className="app-footer">
            <PageWrapper className="app-footer__inner">
                <div>
                    <div className="footer-brand">Jovabdihita</div>
                    <p className="footer-copy">
                        © 2026 Jovabdihita. All data sourced from official civic portals.
                    </p>
                </div>

                <div className="footer-links">
                    {FOOTER_LINKS.map((link) => (
                        link.href ? (
                            <a
                                key={link.label}
                                href={link.href}
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                            >
                                {link.label}
                            </a>
                        ) : (
                            <span key={link.label}>{link.label}</span>
                        )
                    ))}
                </div>
            </PageWrapper>
        </footer>
    );
}

export default Footer;
