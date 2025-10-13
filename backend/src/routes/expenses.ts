import { Router } from 'express';
import { ExpenseController } from '../controllers/expenseController';

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management operations
 */

export const createExpenseRoutes = (expenseController: ExpenseController): Router => {
  const router = Router();

  /**
   * @swagger
   * /expenses:
   *   post:
   *     summary: Create a new expense
   *     tags: [Expenses]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateExpenseDto'
   *           examples:
   *             grocery:
   *               summary: Grocery shopping example
   *               value:
   *                 title: "Grocery Shopping"
   *                 description: "Weekly grocery shopping at the supermarket"
   *                 amount: 89.50
   *                 category: "Food"
   *                 subcategory: "Grocery"
   *                 date: "2024-10-13T10:30:00.000Z"
   *                 paymentMethod: "credit_card"
   *     responses:
   *       201:
   *         description: Expense created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Expense'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: false
   *               error: "Validation error: Title is required"
   */
  router.post('/', expenseController.createExpense);

  /**
   * @swagger
   * /expenses:
   *   get:
   *     summary: List all expenses with filtering and pagination
   *     tags: [Expenses]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Number of items per page
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter expenses from this date
   *         example: "2024-10-01T00:00:00.000Z"
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter expenses until this date
   *         example: "2024-10-31T23:59:59.999Z"
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [Food, Transportation, Entertainment, Shopping, Bills, Others]
   *         description: Filter by category
   *       - in: query
   *         name: subcategory
   *         schema:
   *           type: string
   *         description: Filter by subcategory
   *       - in: query
   *         name: paymentMethod
   *         schema:
   *           type: string
   *           enum: [cash, credit_card, debit_card, pix, bank_transfer]
   *         description: Filter by payment method
   *       - in: query
   *         name: minAmount
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Minimum amount filter
   *       - in: query
   *         name: maxAmount
   *         schema:
   *           type: number
   *           minimum: 0
   *         description: Maximum amount filter
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *           maxLength: 100
   *         description: Search in title and description
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [date, amount, title, category]
   *           default: date
   *         description: Field to sort by
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *         description: Sort order
   *     responses:
   *       200:
   *         description: List of expenses with pagination info
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedExpenseResponse'
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.get('/', expenseController.getExpenses);

  /**
   * @swagger
   * /expenses/stats:
   *   get:
   *     summary: Get expense statistics and analytics
   *     tags: [Statistics]
   *     responses:
   *       200:
   *         description: Expense statistics
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/ExpenseStats'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.get('/stats', expenseController.getStats); // Must be before /:id to avoid conflicts

  /**
   * @swagger
   * /expenses/{id}:
   *   get:
   *     summary: Get expense by ID
   *     tags: [Expenses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Expense ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Expense details
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Expense'
   *       404:
   *         description: Expense not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: false
   *               error: "Expense not found"
   *       400:
   *         description: Invalid ID format
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.get('/:id', expenseController.getExpenseById);

  /**
   * @swagger
   * /expenses/{id}:
   *   put:
   *     summary: Update an existing expense
   *     tags: [Expenses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Expense ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateExpenseDto'
   *           example:
   *             title: "Updated Grocery Shopping"
   *             amount: 95.75
   *             description: "Weekly grocery shopping with extra items"
   *     responses:
   *       200:
   *         description: Expense updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Expense'
   *       404:
   *         description: Expense not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Validation error or invalid ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.put('/:id', expenseController.updateExpense);

  /**
   * @swagger
   * /expenses/{id}:
   *   delete:
   *     summary: Delete an expense
   *     tags: [Expenses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Expense ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Expense deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               success: true
   *               message: "Expense deleted successfully"
   *       404:
   *         description: Expense not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Invalid ID format
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.delete('/:id', expenseController.deleteExpense);

  return router;
};