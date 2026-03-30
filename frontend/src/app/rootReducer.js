import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import contractsReducer from '../features/contracts/contractsSlice';

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    contracts: contractsReducer,
});

export default rootReducer;
