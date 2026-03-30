import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import contractsApi from '../../services/contractsApi';

const PAGE_SIZE = 5;

const initialState = {
    district: 'Munshiganj',
    items: [],
    pagination: null,
    summaryStats: null,
    statusBreakdown: [],
    filters: {
        year: '',
        status: '',
        sortBy: 'contract_value',
        sortOrder: 'desc',
        searchTerm: '',
    },
    page: 1,
    limit: PAGE_SIZE,
    isLoading: false,
    error: null,
};

export const fetchContractsData = createAsyncThunk(
    'contracts/fetchContractsData',
    async (_, { getState }) => {
        const contractsState = getState().contracts;
        const { district, page, limit, filters } = contractsState;

        const [contracts, summaryStats, statusBreakdown] = await Promise.all([
            contractsApi.fetchContracts({
                district,
                page,
                limit,
                status: filters.status || undefined,
                year: filters.year || undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            }),
            contractsApi.fetchOverviewStats(district),
            contractsApi.fetchStatusBreakdown(district),
        ]);

        return {
            items: contracts.items,
            pagination: contracts.pagination,
            summaryStats,
            statusBreakdown,
        };
    }
);

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        setContractsPage(state, action) {
            state.page = action.payload;
        },
        setContractsYearFilter(state, action) {
            state.filters.year = action.payload;
            state.page = 1;
        },
        setContractsStatusFilter(state, action) {
            state.filters.status = action.payload;
            state.page = 1;
        },
        setContractsSort(state, action) {
            state.filters.sortBy = action.payload.sortBy;
            state.filters.sortOrder = action.payload.sortOrder || 'desc';
            state.page = 1;
        },
        setContractsSearchTerm(state, action) {
            state.filters.searchTerm = action.payload;
        },
        resetContractsFilters(state) {
            state.filters.year = '';
            state.filters.status = '';
            state.filters.sortBy = 'contract_value';
            state.filters.sortOrder = 'desc';
            state.filters.searchTerm = '';
            state.page = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContractsData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchContractsData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.items = action.payload.items;
                state.pagination = action.payload.pagination;
                state.summaryStats = action.payload.summaryStats;
                state.statusBreakdown = action.payload.statusBreakdown;
            })
            .addCase(fetchContractsData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to load contracts';
            });
    },
});

export const {
    setContractsPage,
    setContractsYearFilter,
    setContractsStatusFilter,
    setContractsSort,
    setContractsSearchTerm,
    resetContractsFilters,
} = contractsSlice.actions;

export default contractsSlice.reducer;
