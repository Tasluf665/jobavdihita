import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOfficialData, resetOfficialsContractsPage, setOfficialsContractsPage } from '../features/officials/officialsSlice';
import { selectOfficialViewModel } from '../features/officials/officialsSelectors';

const useOfficial = (officialId) => {
    const dispatch = useDispatch();
    const official = useSelector(selectOfficialViewModel);
    const page = useSelector((state) => state.officials.page);

    useEffect(() => {
        dispatch(resetOfficialsContractsPage());
    }, [dispatch, officialId]);

    useEffect(() => {
        dispatch(fetchOfficialData(officialId));
    }, [dispatch, officialId, page]);

    return {
        ...official,
        reload: () => dispatch(fetchOfficialData(officialId)),
        setPage: (nextPage) => dispatch(setOfficialsContractsPage(nextPage)),
    };
};

export default useOfficial;
