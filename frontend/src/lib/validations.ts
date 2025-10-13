import { z } from 'zod';
import type { PaymentMethod } from './types';

// Expense Validation Schema
export const expenseSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional(),
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount cannot exceed 999,999.99'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  date: z
    .date()
    .max(new Date(), 'Date cannot be in the future'),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer']),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// Update Expense Schema (all fields optional except id)
export const updateExpenseSchema = expenseSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});

export type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;

// Filter Schema
export const expenseFiltersSchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().optional(),
});

export type ExpenseFiltersData = z.infer<typeof expenseFiltersSchema>;

// Common validation patterns
export const dateStringSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  'Invalid date format'
);

export const currencySchema = z.number().transform(
  (val) => Math.round(val * 100) / 100 // Round to 2 decimal places
);

// Settings Schema
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  currency: z.string().default('BRL'),
  dateFormat: z.string().default('dd/MM/yyyy'),
  notifications: z.boolean().default(true),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// Report Generation Schema
export const reportSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  categories: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  format: z.enum(['pdf', 'csv', 'excel']),
  includeCharts: z.boolean().default(true),
});

export type ReportFormData = z.infer<typeof reportSchema>;