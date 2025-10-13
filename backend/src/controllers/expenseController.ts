import { Request, Response } from 'express';
import { IExpenseService, ApiResponse, CreateExpenseDto, UpdateExpenseDto, ExpenseFilters } from '../types';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

export class ExpenseController {
  constructor(private expenseService: IExpenseService) {}

  createExpense = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const expenseData: CreateExpenseDto = req.body;
    
    const expense = await this.expenseService.createExpense(expenseData);
    
    const response: ApiResponse = {
      success: true,
      data: expense,
      message: 'Expense created successfully'
    };

    logger.info('Expense created via API', { id: expense.id });
    res.status(201).json(response);
  });

  getExpenses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters: Partial<ExpenseFilters> = {};

    if (req.query['page']) {
      filters.page = parseInt(req.query['page'] as string);
    }
    if (req.query['limit']) {
      filters.limit = parseInt(req.query['limit'] as string);
    }
    if (req.query['startDate']) {
      filters.startDate = req.query['startDate'] as string;
    }
    if (req.query['endDate']) {
      filters.endDate = req.query['endDate'] as string;
    }
    if (req.query['category']) {
      filters.category = req.query['category'] as string;
    }
    if (req.query['subcategory']) {
      filters.subcategory = req.query['subcategory'] as string;
    }
    if (req.query['paymentMethod']) {
      filters.paymentMethod = req.query['paymentMethod'] as any;
    }
    if (req.query['minAmount']) {
      filters.minAmount = parseFloat(req.query['minAmount'] as string);
    }
    if (req.query['maxAmount']) {
      filters.maxAmount = parseFloat(req.query['maxAmount'] as string);
    }
    if (req.query['search']) {
      filters.search = req.query['search'] as string;
    }
    if (req.query['sortBy']) {
      filters.sortBy = req.query['sortBy'] as any;
    }
    if (req.query['sortOrder']) {
      filters.sortOrder = req.query['sortOrder'] as any;
    }

    const result = await this.expenseService.getExpenses(filters as ExpenseFilters);

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.json(response);
  });

  getExpenseById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      throw new Error('Expense ID is required');
    }
    
    const expense = await this.expenseService.getExpenseById(id);
    
    const response: ApiResponse = {
      success: true,
      data: expense
    };

    res.json(response);
  });

  updateExpense = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateExpenseDto = req.body;
    
    if (!id) {
      throw new Error('Expense ID is required');
    }
    
    const expense = await this.expenseService.updateExpense(id, updateData);
    
    const response: ApiResponse = {
      success: true,
      data: expense,
      message: 'Expense updated successfully'
    };

    logger.info('Expense updated via API', { id });
    res.json(response);
  });

  deleteExpense = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      throw new Error('Expense ID is required');
    }
    
    await this.expenseService.deleteExpense(id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Expense deleted successfully'
    };

    logger.info('Expense deleted via API', { id });
    res.json(response);
  });

  getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.expenseService.getStats();
    
    const response: ApiResponse = {
      success: true,
      data: stats
    };

    res.json(response);
  });
}