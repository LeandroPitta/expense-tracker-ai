// Payment Methods
export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'pix' 
  | 'bank_transfer';

// Base Expense Type (matching backend)
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

// Create Expense DTO (for API requests)
export type CreateExpenseDto = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

// Update Expense DTO (for API requests)
export type UpdateExpenseDto = Partial<CreateExpenseDto>;

// Category Structure
export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Record<string, string>;
}

// Expense Filters
export interface ExpenseFilters {
  category?: string;
  subcategory?: string;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// Statistics
export interface ExpenseStats {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  currentMonthAmount: number;
  previousMonthAmount: number;
  monthlyChange: number;
  categoryBreakdown: CategoryStats[];
  monthlyTrend: MonthlyStats[];
  paymentMethodBreakdown: PaymentMethodStats[];
}

export interface CategoryStats {
  category: string;
  categoryName: string;
  amount: number;
  count: number;
  percentage: number;
  color?: string;
}

export interface MonthlyStats {
  month: string;
  year: number;
  amount: number;
  count: number;
}

export interface PaymentMethodStats {
  paymentMethod: PaymentMethod;
  paymentMethodName: string;
  amount: number;
  count: number;
  percentage: number;
}

// UI Types
export type Theme = 'light' | 'dark' | 'system';

// API Error
export interface ApiError {
  message: string;
  code: string;
  status: number;
}