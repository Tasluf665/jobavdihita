import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import redFlagsApi from '../../services/redFlagsApi';

const initialState = {
    items: [],
    analyticsItems: [],
    repeatWinnerItems: [],
    summary: {},
    pagination: null,
    page: 1,
    limit: 5,
    isLoading: false,
    error: null,
};

export const fetchRedFlagsData = createAsyncThunk('redFlags/fetchRedFlagsData', async (_, { getState }) => {
    const redFlagsState = getState().redFlags;
    const { page, limit } = redFlagsState;

    const [list, analyticsList, summary, repeatWinners] = await Promise.all([
        redFlagsApi.fetchRedFlags({ page, limit, sortBy: 'days_overdue' }),
        redFlagsApi.fetchRedFlags({ page: 1, limit: 100, sortBy: 'flag_count' }),
        redFlagsApi.fetchRedFlagsSummary(),
        redFlagsApi.fetchRepeatWinners({ limit: 1000, minWins: 50 }),
    ]);

    return {
        items: list.items,
        analyticsItems: analyticsList.items,
        repeatWinnerItems: repeatWinners,
        pagination: list.pagination,
        summary,
    };
});

const redFlagsSlice = createSlice({
    name: 'redFlags',
    initialState,
    reducers: {
        setRedFlagsPage(state, action) {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRedFlagsData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRedFlagsData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.items = action.payload.items;
                state.analyticsItems = action.payload.analyticsItems;
                state.repeatWinnerItems = action.payload.repeatWinnerItems;
                state.pagination = action.payload.pagination;
                state.summary = action.payload.summary;
            })
            .addCase(fetchRedFlagsData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to load red flags data';
            });
    },
});

export const { setRedFlagsPage } = redFlagsSlice.actions;

export default redFlagsSlice.reducer;
