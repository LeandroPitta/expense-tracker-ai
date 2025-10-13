import { Router } from 'express';
import { ExpenseController } from '../controllers/expenseController';

export const createExpenseRoutes = (expenseController: ExpenseController): Router => {
  const router = Router();

  // CRUD operations
  router.post('/', expenseController.createExpense);
  router.get('/', expenseController.getExpenses);
  router.get('/stats', expenseController.getStats); // Must be before /:id to avoid conflicts
  router.get('/:id', expenseController.getExpenseById);
  router.put('/:id', expenseController.updateExpense);
  router.delete('/:id', expenseController.deleteExpense);

  return router;
};