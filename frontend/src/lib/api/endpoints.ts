import { apiClient } from './client';
import type { 
  Expense, 
  CreateExpenseDto, 
  UpdateExpenseDto, 
  ExpenseFilters,
  ExpenseStats,
  Category 
} from '../types';

/**
 * Expense API endpoints
 */
export const expenseApi = {
  // Get all expenses with optional filters
  getAll: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    const endpoint = query ? `/expenses?${query}` : '/expenses';
    
    const response = await apiClient.get<{data: Expense[], pagination: any}>(endpoint);
    return response.data || [];
  },

  // Get expense by ID
  getById: async (id: string): Promise<Expense> => {
    return apiClient.get<Expense>(`/expenses/${id}`);
  },

  // Create new expense
  create: async (data: CreateExpenseDto): Promise<Expense> => {
    return apiClient.post<Expense>('/expenses', data);
  },

  // Update expense
  update: async (id: string, data: Partial<CreateExpenseDto>): Promise<Expense> => {
    return apiClient.put<Expense>(`/expenses/${id}`, data);
  },

  // Delete expense
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/expenses/${id}`);
  },

  // Get expense statistics
  getStats: async (filters?: ExpenseFilters): Promise<ExpenseStats> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const query = params.toString();
    const endpoint = query ? `/expenses/stats?${query}` : '/expenses/stats';
    
    return apiClient.get<ExpenseStats>(endpoint);
  },
};

/**
 * Category API endpoints
 */
export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Record<string, any>>('/categories');
    
    // Convert object to array format expected by frontend
    return Object.entries(response).map(([name, data]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: data.icon || '📋',
      subcategories: data.subcategories || {},
    }));
  },
};

/**
 * Health check API
 */
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    return apiClient.get('/health');
  },
};