import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const createRateLimit = () => {
  const windowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'); // 15 minutes
  const maxRequests = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100');

  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later'
    } as ApiResponse,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      const response: ApiResponse = {
        success: false,
        error: 'Rate limit exceeded. Too many requests from this IP, please try again later.'
      };
      res.status(429).json(response);
    }
  });
};