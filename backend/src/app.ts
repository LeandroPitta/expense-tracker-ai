import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createRoutes } from './routes';
import { ExpenseController } from './controllers/expenseController';
import { CategoryController } from './controllers/categoryController';
import { ExpenseService } from './services/ExpenseService';
import { ExpenseRepository } from './repositories/ExpenseRepository';
import { validator } from './utils/validation';
import { logger } from './utils/logger';
import { getDatabase } from './database/connection';
import { runMigrations } from './database/migrations';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { createRateLimit } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

export class App {
  public app: express.Application;
  private database = getDatabase();
  private expenseRepository = new ExpenseRepository(this.database);
  private expenseService = new ExpenseService(this.expenseRepository, validator, logger);
  private expenseController = new ExpenseController(this.expenseService);
  private categoryController = new CategoryController();

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Rate limiting
    this.app.use(createRateLimit());

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });
  }

  private initializeRoutes(): void {
    const apiPrefix = process.env['API_PREFIX'] || '/api';
    this.app.use(apiPrefix, createRoutes(this.expenseController, this.categoryController));
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async initialize(): Promise<void> {
    try {
      logger.info('Initializing application...');
      
      // Run database migrations
      await runMigrations();
      
      logger.info('Application initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize application', { error });
      throw error;
    }
  }

  public getExpressApp(): express.Application {
    return this.app;
  }
}