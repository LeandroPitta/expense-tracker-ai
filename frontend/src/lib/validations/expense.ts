import { z } from 'zod';

export const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  date: z.string().min(1, 'Date is required'),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer'], {
    message: 'Payment method is required',
  }),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;