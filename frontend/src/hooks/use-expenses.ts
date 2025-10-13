import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { expenseApi } from '@/lib/api';
import type { Expense, CreateExpenseDto, ExpenseFilters } from '@/lib/types';

/**
 * Hook for fetching expenses with optional filters
 */
export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single expense by ID
 */
export function useExpense(id: string) {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => expenseApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for expense statistics
 */
export function useExpenseStats(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['expense-stats', filters],
    queryFn: () => expenseApi.getStats(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for creating a new expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseApi.create(data),
    onSuccess: (newExpense) => {
      // Invalidate and refetch expense lists
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
      
      // Optimistically add to cache
      queryClient.setQueryData(['expenses', newExpense.id], newExpense);
      
      toast.success('Expense created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create expense');
    },
  });
}

/**
 * Hook for updating an expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExpenseDto> }) =>
      expenseApi.update(id, data),
    onSuccess: (updatedExpense) => {
      // Update specific expense in cache
      queryClient.setQueryData(['expenses', updatedExpense.id], updatedExpense);
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
      
      toast.success('Expense updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update expense');
    },
  });
}

/**
 * Hook for deleting an expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['expenses', deletedId] });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] });
      
      toast.success('Expense deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete expense');
    },
  });
}

/**
 * Composite hook that provides all expense operations
 */
export function useExpenseActions() {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  return {
    createExpense: createExpense.mutate,
    updateExpense: updateExpense.mutate,
    deleteExpense: deleteExpense.mutate,
    isCreating: createExpense.isPending,
    isUpdating: updateExpense.isPending,
    isDeleting: deleteExpense.isPending,
    isLoading: createExpense.isPending || updateExpense.isPending || deleteExpense.isPending,
  };
}