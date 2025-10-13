export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'pix' 
  | 'bank_transfer';

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string; // ISO string
  paymentMethod: PaymentMethod;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateExpenseDto {
  title: string;
  description?: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateExpenseDto {
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  subcategory?: string;
  date?: string;
  paymentMethod?: PaymentMethod;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  subcategory?: string;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: 'date' | 'amount' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  currentMonthAmount: number;
  previousMonthAmount: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }[];
  paymentMethodBreakdown: {
    method: PaymentMethod;
    amount: number;
    count: number;
  }[];
  monthlyTrend: {
    month: string; // YYYY-MM
    amount: number;
    count: number;
  }[];
}

export interface CategoryInfo {
  icon: string;
  subcategories: {
    [key: string]: string;
  };
}

export interface CategoriesResponse {
  [category: string]: CategoryInfo;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DatabaseRow {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

// Interfaces for SOLID principles

export interface IDatabase {
  run(sql: string, params?: any[]): Promise<void>;
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  close(): Promise<void>;
}

export interface IExpenseRepository {
  create(expense: CreateExpenseDto): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findAll(filters: ExpenseFilters): Promise<PaginatedResult<Expense>>;
  update(id: string, expense: UpdateExpenseDto): Promise<Expense>;
  delete(id: string): Promise<void>;
  getStats(): Promise<ExpenseStats>;
  count(filters?: Partial<ExpenseFilters>): Promise<number>;
}

export interface IExpenseService {
  createExpense(data: CreateExpenseDto): Promise<Expense>;
  getExpenses(filters: ExpenseFilters): Promise<PaginatedResult<Expense>>;
  getExpenseById(id: string): Promise<Expense>;
  updateExpense(id: string, data: UpdateExpenseDto): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;
  getStats(): Promise<ExpenseStats>;
}

export interface IValidator {
  validateCreateExpense(data: any): { error?: any; value: CreateExpenseDto };
  validateUpdateExpense(data: any): { error?: any; value: UpdateExpenseDto };
  validateFilters(data: any): { error?: any; value: ExpenseFilters };
}

export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}