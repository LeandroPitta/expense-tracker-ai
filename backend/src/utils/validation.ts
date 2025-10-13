import Joi from 'joi';
import { IValidator, CreateExpenseDto, UpdateExpenseDto, ExpenseFilters } from '../types';
import { CATEGORIES, PAYMENT_METHODS, MAX_PAGE_SIZE } from './constants';

class Validator implements IValidator {
  private createExpenseSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description must not exceed 500 characters'
    }),
    amount: Joi.number().positive().required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),
    category: Joi.string().valid(...Object.keys(CATEGORIES)).required().messages({
      'string.base': 'Category must be a string',
      'any.only': 'Category must be one of the predefined categories',
      'any.required': 'Category is required'
    }),
    subcategory: Joi.string().required().custom((value, helpers) => {
      const category = helpers.state.ancestors[0]?.category;
      if (category && CATEGORIES[category]) {
        const validSubcategories = Object.keys(CATEGORIES[category].subcategories);
        if (!validSubcategories.includes(value)) {
          return helpers.error('any.invalid');
        }
      }
      return value;
    }).messages({
      'string.base': 'Subcategory must be a string',
      'any.required': 'Subcategory is required',
      'any.invalid': 'Subcategory must belong to the selected category'
    }),
    date: Joi.date().max('now').iso().required().messages({
      'date.base': 'Date must be a valid date',
      'date.max': 'Date cannot be in the future',
      'date.format': 'Date must be in ISO format',
      'any.required': 'Date is required'
    }),
    paymentMethod: Joi.string().valid(...PAYMENT_METHODS).required().messages({
      'string.base': 'Payment method must be a string',
      'any.only': 'Payment method must be one of: cash, credit_card, debit_card, pix, bank_transfer',
      'any.required': 'Payment method is required'
    })
  });

  private updateExpenseSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 100 characters'
    }),
    description: Joi.string().max(500).optional().allow('').messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description must not exceed 500 characters'
    }),
    amount: Joi.number().positive().optional().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0'
    }),
    category: Joi.string().valid(...Object.keys(CATEGORIES)).optional().messages({
      'string.base': 'Category must be a string',
      'any.only': 'Category must be one of the predefined categories'
    }),
    subcategory: Joi.string().optional().custom((value, helpers) => {
      const category = helpers.state.ancestors[0]?.category;
      if (category && CATEGORIES[category]) {
        const validSubcategories = Object.keys(CATEGORIES[category].subcategories);
        if (!validSubcategories.includes(value)) {
          return helpers.error('any.invalid');
        }
      }
      return value;
    }).messages({
      'string.base': 'Subcategory must be a string',
      'any.invalid': 'Subcategory must belong to the selected category'
    }),
    date: Joi.date().max('now').iso().optional().messages({
      'date.base': 'Date must be a valid date',
      'date.max': 'Date cannot be in the future',
      'date.format': 'Date must be in ISO format'
    }),
    paymentMethod: Joi.string().valid(...PAYMENT_METHODS).optional().messages({
      'string.base': 'Payment method must be a string',
      'any.only': 'Payment method must be one of: cash, credit_card, debit_card, pix, bank_transfer'
    })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  });

  private filtersSchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).optional().default(20).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': `Limit must not exceed ${MAX_PAGE_SIZE}`
    }),
    startDate: Joi.date().iso().optional().messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format'
    }),
    endDate: Joi.date().iso().optional().messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format'
    }),
    category: Joi.string().valid(...Object.keys(CATEGORIES)).optional().messages({
      'string.base': 'Category must be a string',
      'any.only': 'Category must be one of the predefined categories'
    }),
    subcategory: Joi.string().optional().messages({
      'string.base': 'Subcategory must be a string'
    }),
    paymentMethod: Joi.string().valid(...PAYMENT_METHODS).optional().messages({
      'string.base': 'Payment method must be a string',
      'any.only': 'Payment method must be one of: cash, credit_card, debit_card, pix, bank_transfer'
    }),
    minAmount: Joi.number().positive().optional().messages({
      'number.base': 'Minimum amount must be a number',
      'number.positive': 'Minimum amount must be greater than 0'
    }),
    maxAmount: Joi.number().positive().optional().messages({
      'number.base': 'Maximum amount must be a number',
      'number.positive': 'Maximum amount must be greater than 0'
    }),
    search: Joi.string().max(100).optional().messages({
      'string.base': 'Search term must be a string',
      'string.max': 'Search term must not exceed 100 characters'
    }),
    sortBy: Joi.string().valid('date', 'amount', 'title', 'category').optional().default('date').messages({
      'string.base': 'Sort by must be a string',
      'any.only': 'Sort by must be one of: date, amount, title, category'
    }),
    sortOrder: Joi.string().valid('asc', 'desc').optional().default('desc').messages({
      'string.base': 'Sort order must be a string',
      'any.only': 'Sort order must be either asc or desc'
    })
  }).custom((value, helpers) => {
    if (value.startDate && value.endDate && new Date(value.startDate) > new Date(value.endDate)) {
      return helpers.error('any.invalid', { message: 'Start date must be before end date' });
    }
    if (value.minAmount && value.maxAmount && value.minAmount > value.maxAmount) {
      return helpers.error('any.invalid', { message: 'Minimum amount must be less than maximum amount' });
    }
    return value;
  });

  validateCreateExpense(data: any): { error?: any; value: CreateExpenseDto } {
    return this.createExpenseSchema.validate(data, { abortEarly: false });
  }

  validateUpdateExpense(data: any): { error?: any; value: UpdateExpenseDto } {
    return this.updateExpenseSchema.validate(data, { abortEarly: false });
  }

  validateFilters(data: any): { error?: any; value: ExpenseFilters } {
    return this.filtersSchema.validate(data, { abortEarly: false });
  }
}

export const validator = new Validator();