import { 
  IExpenseRepository, 
  IDatabase, 
  Expense, 
  CreateExpenseDto, 
  UpdateExpenseDto, 
  ExpenseFilters, 
  PaginatedResult,
  ExpenseStats,
  DatabaseRow,
  PaymentMethod
} from '../types';
import { ExpenseModel } from '../models/Expense';
import { convertDatabaseRowToExpense, calculatePercentage, formatMonth } from '../utils/helpers';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export class ExpenseRepository implements IExpenseRepository {
  constructor(private database: IDatabase) {}

  async create(data: CreateExpenseDto): Promise<Expense> {
    const expense = ExpenseModel.create(data);
    const dbExpense = ExpenseModel.toDatabase(expense);

    await this.database.run(
      `INSERT INTO expenses (id, title, description, amount, category, subcategory, date, payment_method, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dbExpense.id,
        dbExpense.title,
        dbExpense.description,
        dbExpense.amount,
        dbExpense.category,
        dbExpense.subcategory,
        dbExpense.date,
        dbExpense.payment_method,
        dbExpense.created_at,
        dbExpense.updated_at
      ]
    );

    return expense;
  }

  async findById(id: string): Promise<Expense | null> {
    const row = await this.database.get<DatabaseRow>(
      'SELECT * FROM expenses WHERE id = ?',
      [id]
    );

    return row ? convertDatabaseRowToExpense(row) : null;
  }

  async findAll(filters: ExpenseFilters): Promise<PaginatedResult<Expense>> {
    const page = filters.page || 1;
    const limit = filters.limit || DEFAULT_PAGE_SIZE;
    const offset = (page - 1) * limit;

    // Build WHERE clause and parameters
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.startDate) {
      conditions.push('date >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('date <= ?');
      params.push(filters.endDate);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.subcategory) {
      conditions.push('subcategory = ?');
      params.push(filters.subcategory);
    }

    if (filters.paymentMethod) {
      conditions.push('payment_method = ?');
      params.push(filters.paymentMethod);
    }

    if (filters.minAmount) {
      conditions.push('amount >= ?');
      params.push(filters.minAmount);
    }

    if (filters.maxAmount) {
      conditions.push('amount <= ?');
      params.push(filters.maxAmount);
    }

    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    const orderBy = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM expenses ${whereClause}`;
    const countResult = await this.database.get<{ count: number }>(countQuery, params);
    const totalItems = countResult?.count || 0;

    // Get paginated data
    const dataQuery = `
      SELECT * FROM expenses 
      ${whereClause} 
      ${orderBy} 
      LIMIT ? OFFSET ?
    `;
    const rows = await this.database.all<DatabaseRow>(dataQuery, [...params, limit, offset]);

    const expenses = rows.map(convertDatabaseRowToExpense);

    // Calculate pagination info
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: expenses,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage
      }
    };
  }

  async update(id: string, data: UpdateExpenseDto): Promise<Expense> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Expense not found');
    }

    const updatedExpense = ExpenseModel.update(existing, data);
    const dbExpense = ExpenseModel.toDatabase(updatedExpense);

    await this.database.run(
      `UPDATE expenses SET 
       title = ?, description = ?, amount = ?, category = ?, 
       subcategory = ?, date = ?, payment_method = ?, updated_at = ?
       WHERE id = ?`,
      [
        dbExpense.title,
        dbExpense.description,
        dbExpense.amount,
        dbExpense.category,
        dbExpense.subcategory,
        dbExpense.date,
        dbExpense.payment_method,
        dbExpense.updated_at,
        id
      ]
    );

    return updatedExpense;
  }

  async delete(id: string): Promise<void> {
    const result = await this.database.run('DELETE FROM expenses WHERE id = ?', [id]);
    // Note: SQLite3 doesn't return affected rows count in the same way as other DBs
    // We could check if the expense existed before deletion if needed
  }

  async count(filters?: Partial<ExpenseFilters>): Promise<number> {
    if (!filters || Object.keys(filters).length === 0) {
      const result = await this.database.get<{ count: number }>('SELECT COUNT(*) as count FROM expenses');
      return result?.count || 0;
    }

    // Build WHERE clause for filtered count
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.startDate) {
      conditions.push('date >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('date <= ?');
      params.push(filters.endDate);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.paymentMethod) {
      conditions.push('payment_method = ?');
      params.push(filters.paymentMethod);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) as count FROM expenses ${whereClause}`;
    
    const result = await this.database.get<{ count: number }>(query, params);
    return result?.count || 0;
  }

  async getStats(): Promise<ExpenseStats> {
    const now = new Date();
    const currentMonth = formatMonth(now);
    const previousMonth = formatMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    // Get total stats
    const totalStatsQuery = `
      SELECT 
        COUNT(*) as totalExpenses,
        COALESCE(SUM(amount), 0) as totalAmount
      FROM expenses
    `;
    const totalStats = await this.database.get<{ totalExpenses: number; totalAmount: number }>(totalStatsQuery);

    // Get current month amount
    const currentMonthQuery = `
      SELECT COALESCE(SUM(amount), 0) as amount
      FROM expenses 
      WHERE strftime('%Y-%m', date) = ?
    `;
    const currentMonthResult = await this.database.get<{ amount: number }>(currentMonthQuery, [currentMonth]);

    // Get previous month amount
    const previousMonthResult = await this.database.get<{ amount: number }>(currentMonthQuery, [previousMonth]);

    // Get category breakdown
    const categoryQuery = `
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
      FROM expenses 
      GROUP BY category
      ORDER BY amount DESC
    `;
    const categoryRows = await this.database.all<{ category: string; amount: number; count: number }>(categoryQuery);

    const totalAmount = totalStats?.totalAmount || 0;
    const categoryBreakdown = categoryRows.map(row => ({
      category: row.category,
      amount: row.amount,
      count: row.count,
      percentage: calculatePercentage(row.amount, totalAmount)
    }));

    // Get payment method breakdown
    const paymentMethodQuery = `
      SELECT 
        payment_method as method,
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
      FROM expenses 
      GROUP BY payment_method
      ORDER BY amount DESC
    `;
    const paymentMethodRows = await this.database.all<{ method: PaymentMethod; amount: number; count: number }>(paymentMethodQuery);

    // Get monthly trend (last 12 months)
    const monthlyTrendQuery = `
      SELECT 
        strftime('%Y-%m', date) as month,
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
      FROM expenses 
      WHERE date >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month ASC
    `;
    const monthlyTrendRows = await this.database.all<{ month: string; amount: number; count: number }>(monthlyTrendQuery);

    return {
      totalExpenses: totalStats?.totalExpenses || 0,
      totalAmount,
      currentMonthAmount: currentMonthResult?.amount || 0,
      previousMonthAmount: previousMonthResult?.amount || 0,
      categoryBreakdown,
      paymentMethodBreakdown: paymentMethodRows,
      monthlyTrend: monthlyTrendRows
    };
  }
}