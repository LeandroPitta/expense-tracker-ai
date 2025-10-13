import type { Category } from './types';

// Expense Categories (English)
export const CATEGORIES: Record<string, Category> = {
  food: {
    id: 'food',
    name: 'Food',
    icon: '🍔',
    subcategories: {
      restaurants: '🍽️',
      grocery: '🛒',
      coffee_snacks: '☕',
      delivery: '🛍️',
    },
  },
  transportation: {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    subcategories: {
      fuel: '⛽',
      public_transport: '🚌',
      uber_taxi: '🚕',
      maintenance: '🔧',
    },
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎮',
    subcategories: {
      movies_theater: '🎬',
      streaming_music: '🎵',
      gym_sports: '🏃',
      games_hobbies: '🎲',
    },
  },
  shopping: {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    subcategories: {
      clothing: '👕',
      electronics: '📱',
      home_decoration: '🏠',
      beauty_care: '💄',
    },
  },
  bills: {
    id: 'bills',
    name: 'Bills',
    icon: '💰',
    subcategories: {
      electricity: '⚡',
      water: '💧',
      phone_internet: '📞',
      rent_mortgage: '🏠',
    },
  },
  others: {
    id: 'others',
    name: 'Others',
    icon: '❓',
    subcategories: {
      health: '🏥',
      education: '📚',
      gifts: '🎁',
      miscellaneous: '📋',
    },
  },
};

// Payment Methods
export const PAYMENT_METHODS = {
  cash: {
    id: 'cash',
    name: 'Cash',
    icon: '💵',
    color: 'green',
  },
  credit_card: {
    id: 'credit_card',
    name: 'Credit Card',
    icon: '💳',
    color: 'blue',
  },
  debit_card: {
    id: 'debit_card',
    name: 'Debit Card',
    icon: '💳',
    color: 'purple',
  },
  pix: {
    id: 'pix',
    name: 'PIX',
    icon: '📱',
    color: 'orange',
  },
  bank_transfer: {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: '🏦',
    color: 'indigo',
  },
} as const;

// Chart Colors for Categories
export const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#0088fe', '#ffbb28', '#ff8042', '#8dd1e1', '#d084d0'
];

// App Routes
export const ROUTES = {
  HOME: '/',
  EXPENSES: '/expenses',
  ADD_EXPENSE: '/expenses/new',
  EDIT_EXPENSE: (id: string) => `/expenses/${id}/edit`,
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  FULL: 'dd/MM/yyyy HH:mm',
} as const;

// Currency Configuration
export const CURRENCY_CONFIG = {
  locale: 'pt-BR',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;

// App Configuration
export const APP_CONFIG = {
  name: 'Expense Tracker',
  description: 'Modern expense tracking application',
  version: '1.0.0',
  author: 'Expense Tracker Team',
  repository: 'https://github.com/expense-tracker/app',
} as const;

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3,
} as const;

// Pagination Defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'expense-tracker-theme',
  sidebarState: 'expense-tracker-sidebar',
  lastFilters: 'expense-tracker-filters',
  userPreferences: 'expense-tracker-preferences',
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;