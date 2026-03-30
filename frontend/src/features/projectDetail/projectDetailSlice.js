import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import projectDetailApi from '../../services/projectDetailApi';

const initialState = {
    tenderId: '1168015',
    contract: null,
    timeline: [],
    redFlags: [],
    isLoading: false,
    error: null,
};

export const fetchProjectDetailData = createAsyncThunk(
    'projectDetail/fetchProjectDetailData',
    async (tenderId = '1168015') => {
        const [contract, timeline, redFlags] = await Promise.all([
            projectDetailApi.fetchContractDetail(tenderId),
            projectDetailApi.fetchContractTimeline(tenderId, 16),
            projectDetailApi.fetchContractRedFlags(tenderId),
        ]);

        return {
            tenderId,
            contract,
            timeline,
            redFlags,
        };
    }
);

const projectDetailSlice = createSlice({
    name: 'projectDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectDetailData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProjectDetailData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.tenderId = action.payload.tenderId;
                state.contract = action.payload.contract;
                state.timeline = action.payload.timeline;
                state.redFlags = action.payload.redFlags;
            })
            .addCase(fetchProjectDetailData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to load project detail';
            });
    },
});

export default projectDetailSlice.reducer;
