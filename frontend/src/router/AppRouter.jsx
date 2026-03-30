import HomePage from '../pages/Home';
import AllProjectsPage from '../pages/AllProjects';
import ProjectDetailPage from '../pages/ProjectDetail';
import RedFlagsPage from '../pages/RedFlags';

function AppRouter() {
    const path = window.location.pathname;

    if (path.startsWith('/projects/') && path !== '/projects') {
        const tenderId = path.split('/')[2] || '1168015';
        return <ProjectDetailPage tenderId={tenderId} />;
    }

    switch (path) {
        case '/red-flags':
            return <RedFlagsPage />;
        case '/projects':
            return <AllProjectsPage />;
        case '/':
        default:
            return <HomePage />;
    }
}

export default AppRouter;
