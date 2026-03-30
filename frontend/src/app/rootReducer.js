import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
});

export default rootReducer;
