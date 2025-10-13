import { v4 as uuidv4 } from 'uuid';
import { DatabaseRow, Expense, PaymentMethod } from '../types';

export const generateId = (): string => {
  return uuidv4();
};

export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};

export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const convertDatabaseRowToExpense = (row: DatabaseRow): Expense => {
  const expense: Expense = {
    id: row.id,
    title: row.title,
    amount: row.amount,
    category: row.category,
    subcategory: row.subcategory,
    date: row.date,
    paymentMethod: row.payment_method as PaymentMethod,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (row.description) {
    expense.description = row.description;
  }

  return expense;
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
};

export const formatMonth = (date: Date): string => {
  return date.toISOString().slice(0, 7); // YYYY-MM format
};

export const getPreviousMonth = (date: Date): Date => {
  const prevMonth = new Date(date);
  prevMonth.setMonth(date.getMonth() - 1);
  return prevMonth;
};

export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};