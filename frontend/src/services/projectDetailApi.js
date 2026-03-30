import { apiGet } from './api';

const fetchContractDetail = async (tenderId) => {
    const response = await apiGet(`/contracts/${tenderId}`);
    return response.data;
};

const fetchContractTimeline = async (tenderId, weeks = 12) => {
    const response = await apiGet(`/contracts/${tenderId}/timeline`, { weeks });
    return response.data;
};

const fetchContractRedFlags = async (tenderId) => {
    const response = await apiGet(`/contracts/${tenderId}/red-flags`);
    return response.data;
};

const projectDetailApi = {
    fetchContractDetail,
    fetchContractTimeline,
    fetchContractRedFlags,
};

export default projectDetailApi;