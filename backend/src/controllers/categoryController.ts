import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { CATEGORIES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class CategoryController {
  getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const response: ApiResponse = {
      success: true,
      data: CATEGORIES
    };

    res.json(response);
  });
}