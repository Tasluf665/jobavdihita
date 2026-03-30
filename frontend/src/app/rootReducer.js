import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import contractsReducer from '../features/contracts/contractsSlice';
import projectDetailReducer from '../features/projectDetail/projectDetailSlice';
import redFlagsReducer from '../features/redFlags/redFlagsSlice';
import contractorsReducer from '../features/contractors/contractorsSlice';
import officialsReducer from '../features/officials/officialsSlice';

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    contracts: contractsReducer,
    projectDetail: projectDetailReducer,
    redFlags: redFlagsReducer,
    contractors: contractorsReducer,
    officials: officialsReducer,
});

export default rootReducer;
