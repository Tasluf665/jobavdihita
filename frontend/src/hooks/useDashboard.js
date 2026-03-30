import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomepageData } from '../features/dashboard/dashboardSlice';
import { selectDashboardViewModel } from '../features/dashboard/dashboardSelectors';

const useDashboard = (district = 'Munshiganj') => {
    const dispatch = useDispatch();
    const dashboard = useSelector(selectDashboardViewModel);

    useEffect(() => {
        dispatch(fetchHomepageData(district));
    }, [dispatch, district]);

    return {
        ...dashboard,
        reload: () => dispatch(fetchHomepageData(district)),
    };
};

export default useDashboard;
