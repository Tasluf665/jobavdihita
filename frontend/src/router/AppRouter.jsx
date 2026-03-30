import HomePage from '../pages/Home';
import AllProjectsPage from '../pages/AllProjects';
import ProjectDetailPage from '../pages/ProjectDetail';
import RedFlagsPage from '../pages/RedFlags';
import ContractorsPage from '../pages/Contractors';

function AppRouter() {
    const path = window.location.pathname;

    if (path.startsWith('/projects/') && path !== '/projects') {
        const tenderId = path.split('/')[2] || '1168015';
        return <ProjectDetailPage tenderId={tenderId} />;
    }

    if (path.startsWith('/contractors/') && path !== '/contractors') {
        const contractorId = decodeURIComponent(path.split('/')[2] || '');
        return <ContractorsPage contractorId={contractorId} />;
    }

    switch (path) {
        case '/contractors':
            return <ContractorsPage />;
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
