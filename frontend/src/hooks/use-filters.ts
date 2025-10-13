import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

import type { ExpenseFilters, PaymentMethod } from '@/lib/types';

/**
 * Hook for managing expense filters with URL state
 */
export function useExpenseFilters() {
  const [category, setCategory] = useQueryState('category', parseAsString);
  const [subcategory, setSubcategory] = useQueryState('subcategory', parseAsString);
  const [paymentMethod, setPaymentMethod] = useQueryState('payment', parseAsString);
  const [startDate, setStartDate] = useQueryState('from', parseAsString);
  const [endDate, setEndDate] = useQueryState('to', parseAsString);
  const [minAmount, setMinAmount] = useQueryState('min', parseAsInteger);
  const [maxAmount, setMaxAmount] = useQueryState('max', parseAsInteger);
  const [search, setSearch] = useQueryState('q', parseAsString);

  // Convert URL state to filters object
  const filters: ExpenseFilters = {
    ...(category && { category }),
    ...(subcategory && { subcategory }),
    ...(paymentMethod && { paymentMethod: paymentMethod as PaymentMethod }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(minAmount && { minAmount }),
    ...(maxAmount && { maxAmount }),
    ...(search && { search }),
  };

  // Clear all filters
  const clearFilters = () => {
    setCategory(null);
    setSubcategory(null);
    setPaymentMethod(null);
    setStartDate(null);
    setEndDate(null);
    setMinAmount(null);
    setMaxAmount(null);
    setSearch(null);
  };

  // Set date range
  const setDateRange = (from: string | null, to: string | null) => {
    setStartDate(from);
    setEndDate(to);
  };

  // Set amount range
  const setAmountRange = (min: number | null, max: number | null) => {
    setMinAmount(min);
    setMaxAmount(max);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return {
    // Individual filter states
    category,
    subcategory,
    paymentMethod,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
    
    // Setters
    setCategory,
    setSubcategory,
    setPaymentMethod,
    setStartDate,
    setEndDate,
    setMinAmount,
    setMaxAmount,
    setSearch,
    
    // Composite setters
    setDateRange,
    setAmountRange,
    clearFilters,
    
    // Computed values
    filters,
    hasActiveFilters,
  };
}

/**
 * Hook for managing search with debounce
 */
export function useSearchFilter(delay: number = 300) {
  const { search, setSearch } = useExpenseFilters();
  
  return {
    search: search || '',
    setSearch,
    clearSearch: () => setSearch(null),
  };
}

/**
 * Hook for managing pagination with URL state
 */
export function usePagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(20));

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const resetPagination = () => {
    setPage(1);
  };

  return {
    page,
    limit,
    setPage,
    setLimit,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  };
}