# 🚀 DEVELOPMENT PROMPTS - Expense Tracker AI

## 📋 Overview

This document contains two specific prompts for implementing the Expense Tracker AI project in 2 phases:
1. **Backend Prompt** - Complete API REST implementation
2. **Frontend Prompt** - Complete UI implementation + API integration

---

# 🔙 PHASE 1 PROMPT: Backend Complete Implementation

## 📋 Project Context

You are an experienced TypeScript/Node.js developer. Your goal is to implement a **complete and production-ready REST API** for an expense tracking application following the exact specifications defined.

## 🎯 Current Objective
Implement **PHASE 1: Complete Backend** of the Expense Tracker AI project.

## 🗄️ Data Model (TypeScript Interface)

```typescript
interface Expense {
  id: string;                       // UUID
  title: string;                    // Required - 3-100 characters
  description?: string;             // Optional
  amount: number;                   // Required - > 0, no maximum limit
  category: string;                 // Required
  subcategory: string;              // Required
  date: string;                     // Required - ISO string, cannot be future
  paymentMethod: PaymentMethod;     // Required
  createdAt: string;                // ISO string
  updatedAt: string;                // ISO string
}

type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'pix' 
  | 'bank_transfer';
```

### SQLite Schema
```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  date TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_payment_method ON expenses(payment_method);
```

## 📊 Fixed Categories (English)

```typescript
const CATEGORIES = {
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
```

## 🔧 Required Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "sqlite3": "^5.1.0",
    "cors": "^2.8.0",
    "dotenv": "^16.0.0",
    "uuid": "^9.0.0",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.0",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/sqlite3": "^3.1.0",
    "@types/cors": "^2.8.0",
    "@types/uuid": "^9.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0"
  }
}
```

## 🛠️ Required Project Structure

```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── server.ts
│   ├── app.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── expenses.ts
│   │   └── categories.ts
│   ├── controllers/
│   │   ├── expenseController.ts
│   │   └── categoryController.ts
│   ├── models/
│   │   └── Expense.ts
│   ├── database/
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   │   └── 001_create_expenses.sql
│   │   └── seeds/
│   │       ├── categories.ts
│   │       └── sampleExpenses.ts
│   ├── middleware/
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   └── types/
│       └── index.ts
└── database/ (created automatically)
    └── expenses.db
```

## 🚀 Required API Endpoints

### Expenses CRUD
```typescript
GET    /api/expenses              // List with filters & pagination
POST   /api/expenses              // Create new expense
GET    /api/expenses/:id          // Get expense by ID
PUT    /api/expenses/:id          // Update expense
DELETE /api/expenses/:id          // Delete expense
```

### Analytics & Stats
```typescript
GET    /api/expenses/stats        // Dashboard statistics
GET    /api/expenses/summary      // Monthly/yearly summaries
```

### Categories
```typescript
GET    /api/categories            // List all categories and subcategories
```

### Health Check
```typescript
GET    /api/health               // API health status
```

## 📝 Query Parameters for GET /api/expenses

```typescript
interface ExpenseFilters {
  page?: number;           // Default: 1
  limit?: number;          // Default: 20, Max: 100
  startDate?: string;      // ISO date
  endDate?: string;        // ISO date
  category?: string;
  subcategory?: string;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  search?: string;         // Search in title/description
  sortBy?: 'date' | 'amount' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

## ✅ Validation Rules

### Backend Validation (Joi Schema)
```typescript
const expenseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  amount: Joi.number().positive().required(),
  category: Joi.string().valid(...Object.keys(CATEGORIES)).required(),
  subcategory: Joi.string().required(), // Must belong to selected category
  date: Joi.date().max('now').iso().required(), // Cannot be future
  paymentMethod: Joi.string().valid('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer').required()
});
```

## 🔒 Security Requirements
- CORS enabled for frontend (localhost:3000)
- Rate limiting (100 requests per 15 minutes)
- Helmet for security headers
- Input sanitization
- SQL injection prevention
- Error handling without data exposure

## 📊 Stats Endpoint Response

```typescript
interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  currentMonthAmount: number;
  previousMonthAmount: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }[];
  paymentMethodBreakdown: {
    method: PaymentMethod;
    amount: number;
    count: number;
  }[];
  monthlyTrend: {
    month: string; // YYYY-MM
    amount: number;
    count: number;
  }[];
}
```

## 🧪 Required Features

### Database
- ✅ SQLite with proper schema
- ✅ Migrations system
- ✅ Indexes for performance
- ✅ Seeds with sample data

### API
- ✅ Full CRUD operations
- ✅ Advanced filtering and search
- ✅ Pagination
- ✅ Sorting
- ✅ Input validation
- ✅ Error handling
- ✅ Statistics aggregation

### Development
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Hot reload with nodemon
- ✅ Environment variables
- ✅ Structured logging

## ✅ Acceptance Criteria - Phase 1

- [ ] Express server running on port 3001
- [ ] SQLite database auto-created with schema
- [ ] All endpoints working and documented
- [ ] Full CRUD operations tested
- [ ] Filtering and pagination working
- [ ] Statistics calculation accurate
- [ ] Validation preventing invalid data
- [ ] Error handling comprehensive
- [ ] CORS configured for frontend
- [ ] Rate limiting implemented
- [ ] Logging structured and informative
- [ ] Sample data seeded for testing

## 🎯 Implementation Instructions

**IMPLEMENT EXACTLY the complete backend as specified above. Create all files, configure dependencies, implement all endpoints with full functionality. Use English for all code, comments, and variable names. Ensure everything works perfectly and meets all acceptance criteria.**

**Test all endpoints thoroughly and confirm they meet the Phase 1 requirements before completion.**

---

# 🎨 PHASE 2 PROMPT: Frontend Complete Implementation

## 📋 Project Context

You are an experienced Next.js/React/TypeScript developer. Your goal is to implement a **complete and production-ready frontend application** that integrates perfectly with the backend API from Phase 1.

## 🎯 Current Objective
Implement **PHASE 2: Complete Frontend + API Integration** of the Expense Tracker AI project.

## 🛠️ Required Dependencies

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.400.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0",
    "@headlessui/react": "^1.7.0"
  }
}
```

## 📁 Required Project Structure

```
frontend/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local.example
├── .gitignore
├── README.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── expenses/
│   │   │   ├── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── ExpenseCard.tsx
│   │   │   ├── ExpenseFilters.tsx
│   │   │   └── ExpenseStats.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   ├── RecentExpenses.tsx
│   │   │   └── MonthlyTrend.tsx
│   │   └── reports/
│   │       ├── ReportGenerator.tsx
│   │       ├── PDFExport.tsx
│   │       └── CSVExport.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── validations.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useExpenses.ts
│   │   ├── useStats.ts
│   │   ├── useCategories.ts
│   │   ├── useTheme.ts
│   │   └── useToast.ts
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   └── ToastProvider.tsx
│   └── styles/
│       └── globals.css
└── public/
    ├── favicon.ico
    └── images/
```

## 🎨 Design System

### Color Palette (Modern)
```css
/* Dark Theme (Default) */
:root[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #111111;
  --card-foreground: #fafafa;
  --primary: #6366f1;
  --primary-foreground: #fafafa;
  --secondary: #1a1a1a;
  --secondary-foreground: #a1a1aa;
  --accent: #10b981;
  --accent-foreground: #fafafa;
  --destructive: #ef4444;
  --border: #27272a;
  --input: #18181b;
  --ring: #6366f1;
}

/* Light Theme */
:root[data-theme="light"] {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --card-foreground: #0a0a0a;
  --primary: #6366f1;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #64748b;
  --accent: #10b981;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --border: #e2e8f0;
  --input: #ffffff;
  --ring: #6366f1;
}
```

## 📱 Required Pages

### 1. Dashboard (/) - Main Page
- **Stats Cards**: Total expenses, current month, previous month comparison
- **Category Chart**: Pie chart showing expense breakdown by category
- **Recent Expenses**: List of last 5-10 expenses
- **Monthly Trend**: Simple chart showing last 6 months
- **Quick Actions**: Add expense, view reports

### 2. Expenses List (/expenses)
- **Expense List**: Paginated table/cards with all expenses
- **Advanced Filters**: Date range, category, payment method, amount range
- **Search**: By title/description
- **Sort Options**: By date, amount, category
- **Actions**: Edit, delete, duplicate

### 3. Add Expense (/expenses/add)
- **Expense Form**: All required fields with validation
- **Category Selection**: Dropdown with subcategories
- **Date Picker**: Cannot select future dates
- **Amount Input**: Brazilian currency format
- **Real-time Validation**: Immediate feedback

### 4. Edit Expense (/expenses/[id]/edit)
- **Pre-filled Form**: Load existing expense data
- **Same Validation**: As add form
- **Update Confirmation**: Toast feedback

### 5. Reports (/reports)
- **Date Range Selection**: Custom periods
- **Filter Options**: Category, payment method
- **PDF Export**: Professional report generation
- **CSV Export**: Raw data download
- **Preview**: Before generating reports

### 6. Settings (/settings)
- **Theme Toggle**: Dark/light mode
- **Currency Format**: Brazilian Real
- **Export Settings**: Default formats
- **About**: App version and info

## 🔧 Required Components

### UI Components
- **Button**: Primary, secondary, destructive variants
- **Input**: Text, number, date types with validation states
- **Select**: Dropdown for categories, payment methods
- **Modal**: Confirmation dialogs, forms
- **Toast**: Success, error, info notifications
- **Skeleton**: Loading states for all content
- **Card**: Content containers with shadows
- **Badge**: Category indicators, status badges

### Layout Components
- **Header**: Logo, navigation, theme toggle, user actions
- **Sidebar**: Navigation menu, collapsible on mobile
- **Navigation**: Active states, breadcrumbs
- **ThemeToggle**: Dark/light mode switcher

### Feature Components
- **ExpenseForm**: Create/edit expenses with full validation
- **ExpenseList**: Paginated list with filters and search
- **ExpenseCard**: Individual expense display
- **CategoryChart**: Pie chart using Chart.js
- **StatsCards**: Dashboard summary cards
- **ReportGenerator**: PDF and CSV export functionality

## 🔌 API Integration

### Base API Configuration
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API client with error handling
class ApiClient {
  async get<T>(endpoint: string): Promise<T>
  async post<T>(endpoint: string, data: any): Promise<T>
  async put<T>(endpoint: string, data: any): Promise<T>
  async delete<T>(endpoint: string): Promise<T>
}
```

### Required Hooks
```typescript
// useExpenses - CRUD operations
const useExpenses = () => {
  const { expenses, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense }
}

// useStats - Dashboard statistics
const useStats = () => {
  const { stats, loading, error, fetchStats }
}

// useCategories - Categories data
const useCategories = () => {
  const { categories, loading, error }
}
```

## 📊 Chart Requirements

### Category Pie Chart (Chart.js)
- **Data**: Expense amounts by category
- **Colors**: Consistent with design system
- **Legends**: Category names with percentages
- **Interactive**: Hover effects, click to filter
- **Responsive**: Works on mobile devices

## 📄 PDF Export Requirements

### Report Content
- **Header**: App logo, report title, generation date
- **Filters Applied**: Date range, categories, etc.
- **Summary Stats**: Total amount, expense count, average
- **Category Breakdown**: Table with amounts and percentages
- **Expense List**: Detailed table with all expenses
- **Chart**: Embedded category pie chart

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px - Single column, collapsible sidebar
- **Tablet**: 640px - 1024px - Adapted layouts, side navigation
- **Desktop**: > 1024px - Full layout with sidebar

### Mobile Optimizations
- **Touch-friendly**: Large buttons, easy tap targets
- **Swipe Actions**: Delete/edit gestures on expense items
- **Bottom Navigation**: Quick access to main sections
- **Optimized Forms**: Mobile-friendly inputs and selectors

## ✅ Acceptance Criteria - Phase 2

### Core Functionality
- [ ] All CRUD operations working through UI
- [ ] Dashboard with real-time statistics
- [ ] Expense list with filtering and search
- [ ] Form validation preventing invalid submissions
- [ ] Theme toggle working (dark/light)
- [ ] Responsive design on all devices

### Advanced Features
- [ ] PDF report generation working
- [ ] CSV export functional
- [ ] Chart.js pie chart displaying correctly
- [ ] Toast notifications for all actions
- [ ] Skeleton loading during API calls
- [ ] Error handling with user-friendly messages

### User Experience
- [ ] Smooth animations and transitions
- [ ] Intuitive navigation and breadcrumbs
- [ ] Accessibility features (ARIA labels, keyboard navigation)
- [ ] Performance optimized (< 2s load time)
- [ ] Professional and modern design

## 🎯 Implementation Instructions

**IMPLEMENT EXACTLY the complete frontend as specified above. Create all pages, components, and integrations. Use the backend API from Phase 1. Ensure perfect responsive design, modern UI, and excellent user experience. Use English for all code, comments, and variable names.**

**Test all functionality thoroughly including API integration, form validation, PDF generation, and responsiveness before completion.**

---

**Status**: Ready for Phase 1 (Backend) and Phase 2 (Frontend) implementation
**Date**: October 12, 2025