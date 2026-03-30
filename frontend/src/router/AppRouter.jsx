import HomePage from '../pages/Home';
import AllProjectsPage from '../pages/AllProjects';

function AppRouter() {
    const path = window.location.pathname;

    switch (path) {
        case '/projects':
            return <AllProjectsPage />;
        case '/':
        default:
            return <HomePage />;
    }
}

export default AppRouter;
