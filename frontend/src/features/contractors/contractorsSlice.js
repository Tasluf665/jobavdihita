import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import contractorsApi from '../../services/contractorsApi';

const initialState = {
    contractorId: null,
    profile: null,
    contracts: [],
    contractPagination: null,
    page: 1,
    limit: 10,
    redFlags: [],
    isLoading: false,
    error: null,
};

export const fetchContractorData = createAsyncThunk('contractors/fetchContractorData', async (contractorId, { getState }) => {
    const state = getState().contractors;

    const [profile, contractsPayload, redFlags] = await Promise.all([
        contractorsApi.fetchContractorById(contractorId),
        contractorsApi.fetchContractorContracts(contractorId, { page: state.page, limit: state.limit }),
        contractorsApi.fetchContractorRedFlags(contractorId),
    ]);

    return {
        contractorId,
        profile: profile || contractsPayload.contractor || null,
        contracts: contractsPayload.items || [],
        contractPagination: contractsPayload.pagination || null,
        redFlags: redFlags || [],
    };
});

const contractorsSlice = createSlice({
    name: 'contractors',
    initialState,
    reducers: {
        setContractorContractsPage(state, action) {
            state.page = Number(action.payload || 1);
        },
        resetContractorContractsPage(state) {
            state.page = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContractorData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchContractorData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.contractorId = action.payload.contractorId;
                state.profile = action.payload.profile;
                state.contracts = action.payload.contracts;
                state.contractPagination = action.payload.contractPagination;
                state.redFlags = action.payload.redFlags;
            })
            .addCase(fetchContractorData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to load contractor data';
            });
    },
});

export const { setContractorContractsPage, resetContractorContractsPage } = contractorsSlice.actions;

export default contractorsSlice.reducer;
