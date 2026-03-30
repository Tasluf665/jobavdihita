import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedFlagsData, setRedFlagsPage } from '../features/redFlags/redFlagsSlice';
import { selectRedFlagsViewModel } from '../features/redFlags/redFlagsSelectors';

const useRedFlags = () => {
    const dispatch = useDispatch();
    const redFlags = useSelector(selectRedFlagsViewModel);
    const page = useSelector((state) => state.redFlags.page);

    useEffect(() => {
        dispatch(fetchRedFlagsData());
    }, [dispatch, page]);

    return {
        ...redFlags,
        setPage: (nextPage) => dispatch(setRedFlagsPage(nextPage)),
        reload: () => dispatch(fetchRedFlagsData()),
    };
};

export default useRedFlags;
