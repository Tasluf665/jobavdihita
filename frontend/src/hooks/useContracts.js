import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchContractsData,
    resetContractsFilters,
    setContractsPage,
    setContractsSearchTerm,
    setContractsSort,
    setContractsStatusFilter,
    setContractsYearFilter,
} from '../features/contracts/contractsSlice';
import { selectContractsViewModel } from '../features/contracts/contractsSelectors';

const useContracts = () => {
    const dispatch = useDispatch();
    const contracts = useSelector(selectContractsViewModel);

    useEffect(() => {
        dispatch(fetchContractsData());
    }, [
        dispatch,
        contracts.requestedPage,
        contracts.filters.year,
        contracts.filters.status,
        contracts.filters.sortBy,
        contracts.filters.sortOrder,
        contracts.filters.searchTerm,
    ]);

    return {
        ...contracts,
        setPage: (page) => dispatch(setContractsPage(page)),
        setYearFilter: (year) => dispatch(setContractsYearFilter(year)),
        setStatusFilter: (status) => dispatch(setContractsStatusFilter(status)),
        setSortBy: (sortBy) => dispatch(setContractsSort({ sortBy, sortOrder: 'desc' })),
        setSearchTerm: (searchTerm) => dispatch(setContractsSearchTerm(searchTerm)),
        resetFilters: () => dispatch(resetContractsFilters()),
        reload: () => dispatch(fetchContractsData()),
    };
};

export default useContracts;
