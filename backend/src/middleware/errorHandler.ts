import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  } else {
    // Handle specific error types
    if (error.message.includes('Validation error')) {
      statusCode = 400;
      message = error.message;
      isOperational = true;
    } else if (error.message.includes('not found')) {
      statusCode = 404;
      message = error.message;
      isOperational = true;
    } else if (error.message.includes('Invalid') && error.message.includes('ID')) {
      statusCode = 400;
      message = error.message;
      isOperational = true;
    }
  }

  // Log error
  if (!isOperational || statusCode >= 500) {
    logger.error('Unhandled error', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      statusCode
    });
  } else {
    logger.warn('Handled error', {
      error: error.message,
      url: req.url,
      method: req.method,
      statusCode
    });
  }

  // Send error response
  const response: ApiResponse = {
    success: false,
    error: message
  };

  // Don't expose error details in production
  if (process.env['NODE_ENV'] === 'production' && !isOperational) {
    response.error = 'Something went wrong';
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${req.originalUrl} not found`
  };

  logger.warn('Route not found', {
    url: req.originalUrl,
    method: req.method
  });

  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};