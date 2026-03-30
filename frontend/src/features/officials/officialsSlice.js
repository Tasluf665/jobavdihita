import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import officialsApi from '../../services/officialsApi';

const initialState = {
    requestedOfficialId: null,
    resolvedOfficialId: null,
    profile: null,
    contracts: [],
    contractsPagination: null,
    patterns: null,
    page: 1,
    limit: 20,
    isLoading: false,
    error: null,
};

const resolveOfficialId = async (officialId) => {
    if (officialId) {
        return officialId;
    }

    const officials = await officialsApi.fetchOfficials({ page: 1, limit: 1 });
    return officials.items?.[0]?._id || null;
};

export const fetchOfficialData = createAsyncThunk('officials/fetchOfficialData', async (officialId, { getState }) => {
    const state = getState().officials;
    const targetOfficialId = await resolveOfficialId(officialId);

    if (!targetOfficialId) {
        return {
            requestedOfficialId: officialId || null,
            resolvedOfficialId: null,
            profile: null,
            contracts: [],
            contractsPagination: null,
            patterns: null,
        };
    }

    const [profile, contractsPayload, patterns] = await Promise.all([
        officialsApi.fetchOfficialById(targetOfficialId),
        officialsApi.fetchOfficialContracts(targetOfficialId, { page: state.page, limit: state.limit }),
        officialsApi.fetchOfficialPatterns(targetOfficialId),
    ]);

    return {
        requestedOfficialId: officialId || null,
        resolvedOfficialId: targetOfficialId,
        profile: profile || contractsPayload.official || null,
        contracts: contractsPayload.items || [],
        contractsPagination: contractsPayload.pagination || null,
        patterns: patterns || null,
    };
});

const officialsSlice = createSlice({
    name: 'officials',
    initialState,
    reducers: {
        setOfficialsContractsPage(state, action) {
            state.page = Number(action.payload || 1);
        },
        resetOfficialsContractsPage(state) {
            state.page = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfficialData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOfficialData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.requestedOfficialId = action.payload.requestedOfficialId;
                state.resolvedOfficialId = action.payload.resolvedOfficialId;
                state.profile = action.payload.profile;
                state.contracts = action.payload.contracts;
                state.contractsPagination = action.payload.contractsPagination;
                state.patterns = action.payload.patterns;
            })
            .addCase(fetchOfficialData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to load official profile';
            });
    },
});

export const { setOfficialsContractsPage, resetOfficialsContractsPage } = officialsSlice.actions;

export default officialsSlice.reducer;
