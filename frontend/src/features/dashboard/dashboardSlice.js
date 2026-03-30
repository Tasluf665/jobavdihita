import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dashboardApi from '../../services/dashboardApi';

const initialState = {
    district: 'Munshiganj',
    stats: null,
    statusBreakdown: [],
    alerts: [],
    recentActivity: [],
    criticalFlags: [],
    moneySummary: null,
    yearlySpending: [],
    isLoading: false,
    error: null,
};

export const fetchHomepageData = createAsyncThunk(
    'dashboard/fetchHomepageData',
    async (district = 'Munshiganj') => {
        const [stats, statusBreakdown, alerts, recentActivity, criticalFlags, moneySummary, yearlySpending] = await Promise.all([
            dashboardApi.fetchOverviewStats(district),
            dashboardApi.fetchStatusBreakdown(district),
            dashboardApi.fetchOverviewAlerts({ district, limit: 10 }),
            dashboardApi.fetchRecentActivity({ limit: 8 }),
            dashboardApi.fetchCriticalFlags({ limit: 10 }),
            dashboardApi.fetchMoneySummary(district),
            dashboardApi.fetchYearlySpending({ district, fromYear: 2017 }),
        ]);

        return {
            district,
            stats,
            statusBreakdown,
            alerts,
            recentActivity,
            criticalFlags,
            moneySummary,
            yearlySpending,
        };
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepageData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHomepageData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.district = action.payload.district;
                state.stats = action.payload.stats;
                state.statusBreakdown = action.payload.statusBreakdown;
                state.alerts = action.payload.alerts;
                state.recentActivity = action.payload.recentActivity;
                state.criticalFlags = action.payload.criticalFlags;
                state.moneySummary = action.payload.moneySummary;
                state.yearlySpending = action.payload.yearlySpending;
            })
            .addCase(fetchHomepageData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to load homepage data';
            });
    },
});

export default dashboardSlice.reducer;
