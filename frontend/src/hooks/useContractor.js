import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchContractorData,
    resetContractorContractsPage,
    setContractorContractsPage,
} from '../features/contractors/contractorsSlice';
import { selectContractorViewModel } from '../features/contractors/contractorsSelectors';

const useContractor = (contractorId) => {
    const dispatch = useDispatch();
    const contractor = useSelector(selectContractorViewModel);
    const page = useSelector((state) => state.contractors.page);

    useEffect(() => {
        dispatch(resetContractorContractsPage());
    }, [dispatch, contractorId]);

    useEffect(() => {
        if (!contractorId) {
            return;
        }

        dispatch(fetchContractorData(contractorId));
    }, [dispatch, contractorId, page]);

    return {
        ...contractor,
        reload: () => (contractorId ? dispatch(fetchContractorData(contractorId)) : null),
        setPage: (nextPage) => dispatch(setContractorContractsPage(nextPage)),
    };
};

export default useContractor;
