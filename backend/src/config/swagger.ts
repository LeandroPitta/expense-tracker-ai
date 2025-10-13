import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Expense Tracker API',
    version: '1.0.0',
    description: 'REST API for Expense Tracker AI application - Complete expense management system',
    contact: {
      name: 'Expense Tracker AI Team',
      email: 'support@expense-tracker.ai'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server'
    }
  ],
  components: {
    schemas: {
      Expense: {
        type: 'object',
        required: ['title', 'amount', 'category', 'subcategory', 'date', 'paymentMethod'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the expense',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          title: {
            type: 'string',
            minLength: 3,
            maxLength: 100,
            description: 'Title of the expense',
            example: 'Grocery Shopping'
          },
          description: {
            type: 'string',
            maxLength: 500,
            description: 'Optional description of the expense',
            example: 'Weekly grocery shopping at the supermarket'
          },
          amount: {
            type: 'number',
            minimum: 0.01,
            description: 'Amount spent',
            example: 89.50
          },
          category: {
            type: 'string',
            enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Others'],
            description: 'Category of the expense',
            example: 'Food'
          },
          subcategory: {
            type: 'string',
            description: 'Subcategory of the expense',
            example: 'Grocery'
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the expense occurred (ISO format)',
            example: '2024-10-13T10:30:00.000Z'
          },
          paymentMethod: {
            type: 'string',
            enum: ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer'],
            description: 'Payment method used',
            example: 'credit_card'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the expense was created in the system',
            example: '2024-10-13T10:30:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When the expense was last updated',
            example: '2024-10-13T10:30:00.000Z'
          }
        }
      },
      CreateExpenseDto: {
        type: 'object',
        required: ['title', 'amount', 'category', 'subcategory', 'date', 'paymentMethod'],
        properties: {
          title: {
            type: 'string',
            minLength: 3,
            maxLength: 100,
            description: 'Title of the expense',
            example: 'Grocery Shopping'
          },
          description: {
            type: 'string',
            maxLength: 500,
            description: 'Optional description of the expense',
            example: 'Weekly grocery shopping at the supermarket'
          },
          amount: {
            type: 'number',
            minimum: 0.01,
            description: 'Amount spent',
            example: 89.50
          },
          category: {
            type: 'string',
            enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Others'],
            description: 'Category of the expense',
            example: 'Food'
          },
          subcategory: {
            type: 'string',
            description: 'Subcategory of the expense (must belong to the selected category)',
            example: 'Grocery'
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the expense occurred (ISO format, cannot be in the future)',
            example: '2024-10-13T10:30:00.000Z'
          },
          paymentMethod: {
            type: 'string',
            enum: ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer'],
            description: 'Payment method used',
            example: 'credit_card'
          }
        }
      },
      UpdateExpenseDto: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 3,
            maxLength: 100,
            description: 'Title of the expense',
            example: 'Updated Grocery Shopping'
          },
          description: {
            type: 'string',
            maxLength: 500,
            description: 'Optional description of the expense',
            example: 'Updated description'
          },
          amount: {
            type: 'number',
            minimum: 0.01,
            description: 'Amount spent',
            example: 95.75
          },
          category: {
            type: 'string',
            enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Others'],
            description: 'Category of the expense',
            example: 'Food'
          },
          subcategory: {
            type: 'string',
            description: 'Subcategory of the expense',
            example: 'Grocery'
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the expense occurred',
            example: '2024-10-13T10:30:00.000Z'
          },
          paymentMethod: {
            type: 'string',
            enum: ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer'],
            description: 'Payment method used',
            example: 'debit_card'
          }
        }
      },
      PaginatedExpenseResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Expense'
                }
              },
              pagination: {
                type: 'object',
                properties: {
                  currentPage: { type: 'integer', example: 1 },
                  totalPages: { type: 'integer', example: 5 },
                  totalItems: { type: 'integer', example: 100 },
                  itemsPerPage: { type: 'integer', example: 20 },
                  hasNextPage: { type: 'boolean', example: true },
                  hasPreviousPage: { type: 'boolean', example: false }
                }
              }
            }
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
            example: true
          },
          data: {
            type: 'object',
            description: 'Response data (varies by endpoint)'
          },
          message: {
            type: 'string',
            description: 'Success or informational message',
            example: 'Operation completed successfully'
          },
          error: {
            type: 'string',
            description: 'Error message (only present when success is false)',
            example: 'Validation error: Title is required'
          }
        }
      },
      ExpenseStats: {
        type: 'object',
        properties: {
          totalExpenses: {
            type: 'integer',
            description: 'Total number of expenses',
            example: 100
          },
          totalAmount: {
            type: 'number',
            description: 'Total amount spent',
            example: 2500.75
          },
          currentMonthAmount: {
            type: 'number',
            description: 'Amount spent in the current month',
            example: 450.30
          },
          previousMonthAmount: {
            type: 'number',
            description: 'Amount spent in the previous month',
            example: 380.90
          },
          categoryBreakdown: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: { type: 'string', example: 'Food' },
                amount: { type: 'number', example: 890.50 },
                percentage: { type: 'number', example: 35.62 },
                count: { type: 'integer', example: 25 }
              }
            }
          },
          paymentMethodBreakdown: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'credit_card' },
                amount: { type: 'number', example: 1200.30 },
                count: { type: 'integer', example: 45 }
              }
            }
          },
          monthlyTrend: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                month: { type: 'string', example: '2024-10' },
                amount: { type: 'number', example: 450.30 },
                count: { type: 'integer', example: 15 }
              }
            }
          }
        }
      },
      CategoriesResponse: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            icon: {
              type: 'string',
              description: 'Emoji icon for the category',
              example: '🍔'
            },
            subcategories: {
              type: 'object',
              additionalProperties: {
                type: 'string',
                description: 'Emoji icon for the subcategory',
                example: '🍽️'
              }
            }
          }
        },
        example: {
          'Food': {
            icon: '🍔',
            subcategories: {
              'Restaurants': '🍽️',
              'Grocery': '🛒',
              'Coffee/Snacks': '☕',
              'Delivery': '🛍️'
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Health',
      description: 'API health check'
    },
    {
      name: 'Expenses',
      description: 'Expense management operations'
    },
    {
      name: 'Categories',
      description: 'Category and subcategory information'
    },
    {
      name: 'Statistics',
      description: 'Expense analytics and reporting'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);