import { Expense, CreateExpenseDto, UpdateExpenseDto } from '../types';
import { generateId, getCurrentISODate } from '../utils/helpers';

export class ExpenseModel {
  static create(data: CreateExpenseDto): Expense {
    const now = getCurrentISODate();
    
    const expense: Expense = {
      id: generateId(),
      title: data.title.trim(),
      amount: data.amount,
      category: data.category,
      subcategory: data.subcategory,
      date: data.date,
      paymentMethod: data.paymentMethod,
      createdAt: now,
      updatedAt: now
    };

    if (data.description && data.description.trim()) {
      expense.description = data.description.trim();
    }

    return expense;
  }

  static update(existing: Expense, updates: UpdateExpenseDto): Expense {
    const updatedExpense: Expense = {
      ...existing,
      updatedAt: getCurrentISODate()
    };

    if (updates.title !== undefined) {
      updatedExpense.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (updates.description.trim()) {
        updatedExpense.description = updates.description.trim();
      } else {
        delete updatedExpense.description;
      }
    }

    if (updates.amount !== undefined) {
      updatedExpense.amount = updates.amount;
    }

    if (updates.category !== undefined) {
      updatedExpense.category = updates.category;
    }

    if (updates.subcategory !== undefined) {
      updatedExpense.subcategory = updates.subcategory;
    }

    if (updates.date !== undefined) {
      updatedExpense.date = updates.date;
    }

    if (updates.paymentMethod !== undefined) {
      updatedExpense.paymentMethod = updates.paymentMethod;
    }

    return updatedExpense;
  }

  static toDatabase(expense: Expense) {
    return {
      id: expense.id,
      title: expense.title,
      description: expense.description || null,
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      date: expense.date,
      payment_method: expense.paymentMethod,
      created_at: expense.createdAt,
      updated_at: expense.updatedAt
    };
  }
}