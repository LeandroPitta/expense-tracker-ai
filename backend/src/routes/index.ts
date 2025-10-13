import { Router } from 'express';
import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { createExpenseRoutes } from './expenses';
import { createCategoryRoutes } from './categories';
import { ExpenseController } from '../controllers/expenseController';
import { CategoryController } from '../controllers/categoryController';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API health check
 */

export const createRoutes = (
  expenseController: ExpenseController,
  categoryController: CategoryController
): Router => {
  const router = Router();

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Check API health status
   *     tags: [Health]
   *     description: Returns the current status of the API, including timestamp and version
   *     responses:
   *       200:
   *         description: API is healthy and running
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         status:
   *                           type: string
   *                           example: "healthy"
   *                         timestamp:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-10-13T10:30:00.000Z"
   *                         version:
   *                           type: string
   *                           example: "1.0.0"
   *             example:
   *               success: true
   *               data:
   *                 status: "healthy"
   *                 timestamp: "2024-10-13T10:30:00.000Z"
   *                 version: "1.0.0"
   *               message: "API is running"
   */
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