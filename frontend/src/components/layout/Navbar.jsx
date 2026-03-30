import ROUTES from '../../constants/routes';
import PageWrapper from './PageWrapper';

const NAV_ITEMS = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Projects', href: ROUTES.PROJECTS },
    { label: 'Red Flags', href: ROUTES.RED_FLAGS },
    { label: 'Money', href: ROUTES.MONEY },
];

function Navbar({ activeRoute }) {
    const currentRoute = activeRoute || window.location.pathname;

    return (
        <header className="app-navbar">
            <PageWrapper className="app-navbar__inner">
                <div className="brand">Jovabdihita</div>

                <nav className="nav-links" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`nav-link ${item.href === currentRoute ? 'nav-link--active' : ''}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </PageWrapper>
        </header>
    );
}

export default Navbar;
