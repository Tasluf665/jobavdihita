import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import contractsReducer from '../features/contracts/contractsSlice';
import projectDetailReducer from '../features/projectDetail/projectDetailSlice';

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    contracts: contractsReducer,
    projectDetail: projectDetailReducer,
});

export default rootReducer;
