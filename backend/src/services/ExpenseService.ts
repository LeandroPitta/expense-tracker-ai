import { 
  IExpenseService, 
  IExpenseRepository, 
  IValidator, 
  ILogger,
  Expense, 
  CreateExpenseDto, 
  UpdateExpenseDto, 
  ExpenseFilters, 
  PaginatedResult,
  ExpenseStats
} from '../types';
import { isValidUUID } from '../utils/helpers';

export class ExpenseService implements IExpenseService {
  constructor(
    private expenseRepository: IExpenseRepository,
    private validator: IValidator,
    private logger: ILogger
  ) {}

  async createExpense(data: CreateExpenseDto): Promise<Expense> {
    this.logger.info('Creating new expense', { title: data.title, amount: data.amount });

    // Validate input data
    const { error, value } = this.validator.validateCreateExpense(data);
    if (error) {
      this.logger.warn('Expense creation validation failed', { error: error.details });
      throw new Error(`Validation error: ${error.details.map((d: any) => d.message).join(', ')}`);
    }

    try {
      const expense = await this.expenseRepository.create(value);
      this.logger.info('Expense created successfully', { id: expense.id, title: expense.title });
      return expense;
    } catch (error) {
      this.logger.error('Error creating expense', { error, data });
      throw new Error('Failed to create expense');
    }
  }

  async getExpenses(filters: ExpenseFilters): Promise<PaginatedResult<Expense>> {
    this.logger.info('Fetching expenses with filters', { filters });

    // Validate filters
    const { error, value } = this.validator.validateFilters(filters);
    if (error) {
      this.logger.warn('Expense filters validation failed', { error: error.details });
      throw new Error(`Validation error: ${error.details.map((d: any) => d.message).join(', ')}`);
    }

    try {
      const result = await this.expenseRepository.findAll(value);
      this.logger.info('Expenses fetched successfully', { 
        count: result.data.length, 
        totalItems: result.pagination.totalItems 
      });
      return result;
    } catch (error) {
      this.logger.error('Error fetching expenses', { error, filters });
      throw new Error('Failed to fetch expenses');
    }
  }

  async getExpenseById(id: string): Promise<Expense> {
    this.logger.info('Fetching expense by ID', { id });

    // Validate ID format
    if (!isValidUUID(id)) {
      this.logger.warn('Invalid expense ID format', { id });
      throw new Error('Invalid expense ID format');
    }

    try {
      const expense = await this.expenseRepository.findById(id);
      if (!expense) {
        this.logger.warn('Expense not found', { id });
        throw new Error('Expense not found');
      }

      this.logger.info('Expense fetched successfully', { id, title: expense.title });
      return expense;
    } catch (error) {
      if (error instanceof Error && error.message === 'Expense not found') {
        throw error;
      }
      this.logger.error('Error fetching expense by ID', { error, id });
      throw new Error('Failed to fetch expense');
    }
  }

  async updateExpense(id: string, data: UpdateExpenseDto): Promise<Expense> {
    this.logger.info('Updating expense', { id, updates: Object.keys(data) });

    // Validate ID format
    if (!isValidUUID(id)) {
      this.logger.warn('Invalid expense ID format', { id });
      throw new Error('Invalid expense ID format');
    }

    // Validate update data
    const { error, value } = this.validator.validateUpdateExpense(data);
    if (error) {
      this.logger.warn('Expense update validation failed', { error: error.details });
      throw new Error(`Validation error: ${error.details.map((d: any) => d.message).join(', ')}`);
    }

    try {
      const expense = await this.expenseRepository.update(id, value);
      this.logger.info('Expense updated successfully', { id, title: expense.title });
      return expense;
    } catch (error) {
      if (error instanceof Error && error.message === 'Expense not found') {
        this.logger.warn('Expense not found for update', { id });
        throw error;
      }
      this.logger.error('Error updating expense', { error, id, data });
      throw new Error('Failed to update expense');
    }
  }

  async deleteExpense(id: string): Promise<void> {
    this.logger.info('Deleting expense', { id });

    // Validate ID format
    if (!isValidUUID(id)) {
      this.logger.warn('Invalid expense ID format', { id });
      throw new Error('Invalid expense ID format');
    }

    try {
      // Check if expense exists before deletion
      const expense = await this.expenseRepository.findById(id);
      if (!expense) {
        this.logger.warn('Expense not found for deletion', { id });
        throw new Error('Expense not found');
      }

      await this.expenseRepository.delete(id);
      this.logger.info('Expense deleted successfully', { id, title: expense.title });
    } catch (error) {
      if (error instanceof Error && error.message === 'Expense not found') {
        throw error;
      }
      this.logger.error('Error deleting expense', { error, id });
      throw new Error('Failed to delete expense');
    }
  }

  async getStats(): Promise<ExpenseStats> {
    this.logger.info('Fetching expense statistics');

    try {
      const stats = await this.expenseRepository.getStats();
      this.logger.info('Statistics fetched successfully', { 
        totalExpenses: stats.totalExpenses,
        totalAmount: stats.totalAmount 
      });
      return stats;
    } catch (error) {
      this.logger.error('Error fetching statistics', { error });
      throw new Error('Failed to fetch statistics');
    }
  }
}