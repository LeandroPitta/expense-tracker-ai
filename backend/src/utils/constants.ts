import { CategoriesResponse, PaymentMethod } from '../types';

export const CATEGORIES: CategoriesResponse = {
  "Food": {
    icon: "🍔",
    subcategories: {
      "Restaurants": "🍽️",
      "Grocery": "🛒", 
      "Coffee/Snacks": "☕",
      "Delivery": "🛍️"
    }
  },
  "Transportation": {
    icon: "🚗",
    subcategories: {
      "Fuel": "⛽",
      "Public Transport": "🚌",
      "Uber/Taxi": "🚕",
      "Maintenance": "🔧"
    }
  },
  "Entertainment": {
    icon: "🎮",
    subcategories: {
      "Movies/Theater": "🎬",
      "Streaming/Music": "🎵",
      "Gym/Sports": "🏃",
      "Games/Hobbies": "🎲"
    }
  },
  "Shopping": {
    icon: "🛍️",
    subcategories: {
      "Clothing": "👕",
      "Electronics": "📱",
      "Home/Decoration": "🏠",
      "Beauty/Care": "💄"
    }
  },
  "Bills": {
    icon: "💰",
    subcategories: {
      "Electricity": "⚡",
      "Water": "💧",
      "Phone/Internet": "📞",
      "Rent/Mortgage": "🏠"
    }
  },
  "Others": {
    icon: "❓",
    subcategories: {
      "Health": "🏥",
      "Education": "📚",
      "Gifts": "🎁",
      "Miscellaneous": "📋"
    }
  }
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  'cash',
  'credit_card',
  'debit_card',
  'pix',
  'bank_transfer'
];

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_SORT_BY = 'date';
export const DEFAULT_SORT_ORDER = 'desc';