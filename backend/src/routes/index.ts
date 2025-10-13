import { Router } from 'express';
import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { createExpenseRoutes } from './expenses';
import { createCategoryRoutes } from './categories';
import { ExpenseController } from '../controllers/expenseController';
import { CategoryController } from '../controllers/categoryController';

export const createRoutes = (
  expenseController: ExpenseController,
  categoryController: CategoryController
): Router => {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      message: 'API is running'
    };
    res.json(response);
  });

  // Mount feature routes
  router.use('/expenses', createExpenseRoutes(expenseController));
  router.use('/categories', createCategoryRoutes(categoryController));

  return router;
};