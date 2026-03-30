import { apiGet } from './api';

const fetchContractorById = async (contractorId) => {
    const response = await apiGet(`/contractors/${contractorId}`);
    return response.data || null;
};

const fetchContractorContracts = async (contractorId, { page = 1, limit = 50 } = {}) => {
    const response = await apiGet(`/contractors/${contractorId}/contracts`, {
        page,
        limit,
    });

    return {
        contractor: response.contractor || null,
        items: response.items || [],
        pagination: response.pagination || null,
    };
};

const fetchContractorRedFlags = async (contractorId) => {
    const response = await apiGet(`/contractors/${contractorId}/red-flags`);
    return response.data || [];
};

const contractorsApi = {
    fetchContractorById,
    fetchContractorContracts,
    fetchContractorRedFlags,
};

export default contractorsApi;
