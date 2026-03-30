import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetailData } from '../features/projectDetail/projectDetailSlice';
import { selectProjectDetailViewModel } from '../features/projectDetail/projectDetailSelectors';

const useProjectDetail = (tenderId = '1168015') => {
    const dispatch = useDispatch();
    const projectDetail = useSelector(selectProjectDetailViewModel);

    useEffect(() => {
        dispatch(fetchProjectDetailData(tenderId));
    }, [dispatch, tenderId]);

    return {
        ...projectDetail,
        reload: () => dispatch(fetchProjectDetailData(tenderId)),
    };
};

export default useProjectDetail;
