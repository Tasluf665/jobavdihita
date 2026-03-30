import HomePage from '../pages/Home';

function AppRouter() {
    const path = window.location.pathname;

    switch (path) {
        case '/':
        default:
            return <HomePage />;
    }
}

export default AppRouter;
