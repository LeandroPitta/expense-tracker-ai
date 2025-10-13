// Core Expense Types
export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'pix' 
  | 'bank_transfer';

// Form Types
export type CreateExpenseDto = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExpenseDto = Partial<CreateExpenseDto> & { id: string };

// Category Types
export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Record<string, string>;
}

// Statistics Types
export interface ExpenseStats {
  totalAmount: number;
  totalCount: number;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
  categoryBreakdown: CategoryStat[];
  monthlyData: MonthlyData[];
}

export interface CategoryStat {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

// Filter Types
export interface ExpenseFilters {
  category?: string;
  subcategory?: string;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  currentExpense: Expense | null;
  selectedExpenses: string[];
}

export type Theme = 'light' | 'dark' | 'system';