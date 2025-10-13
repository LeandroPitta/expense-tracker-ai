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

## 📐 SOLID Principles (MANDATORY)

### Architecture Requirements
- **MANDATORY**: All backend code must follow **SOLID principles**
- **Single Responsibility**: Each class/service has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: No client should depend on unused methods
- **Dependency Inversion**: Depend on abstractions, not concretions

### Implementation Guidelines
```typescript
// Example structure following SOLID principles

// Interfaces (Dependency Inversion)
interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findAll(filters: ExpenseFilters): Promise<Expense[]>;
  update(id: string, expense: Partial<Expense>): Promise<Expense>;
  delete(id: string): Promise<void>;
}

interface IExpenseService {
  createExpense(data: CreateExpenseDto): Promise<Expense>;
  getExpenses(filters: ExpenseFilters): Promise<PaginatedResult<Expense>>;
  updateExpense(id: string, data: UpdateExpenseDto): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;
}

// Services (Single Responsibility)
class ExpenseService implements IExpenseService {
  constructor(
    private expenseRepository: IExpenseRepository,
    private validator: IValidator,
    private logger: ILogger
  ) {}
  
  // Business logic only
}

// Repository (Single Responsibility)
class ExpenseRepository implements IExpenseRepository {
  constructor(private database: IDatabase) {}
  
  // Data access only
}

// Controllers (Single Responsibility)
class ExpenseController {
  constructor(private expenseService: IExpenseService) {}
  
  // HTTP handling only
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

## 🛠️ Required Dependencies (Modern Stack 2025)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.6.0",
    "@tailwindcss/typography": "^0.5.15",
    "tailwindcss": "^3.4.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.441.0",
    "recharts": "^2.12.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.0",
    "zustand": "^5.0.0",
    "nuqs": "^1.19.0",
    "@tanstack/react-query": "^5.59.0",
    "react-pdf": "^9.1.0",
    "sonner": "^1.5.0",
    "vaul": "^1.0.0",
    "cmdk": "^1.0.0",
    "date-fns": "^4.1.0",
    "framer-motion": "^11.11.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-calendar": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.7.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "eslint": "^9.12.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 📁 Professional Project Structure (Industry Standard)

### 🏗️ Root Level Configuration (Best Practices)
```
frontend/
├── package.json                 # Dependencies + scripts
├── package-lock.json           # Lock file (never edit manually)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS config (TypeScript)
├── tsconfig.json               # TypeScript configuration
├── components.json             # shadcn/ui configuration
├── .env.local.example          # Environment variables template
├── .env.local                  # Local environment (gitignored)
├── .gitignore                  # Git ignore patterns
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── README.md                  # Project documentation
├── LICENSE                    # Project license
└── docs/                      # Additional documentation
    ├── SETUP.md
    ├── DEPLOYMENT.md
    └── API.md
```

### 📂 Source Code Organization (Feature-First Pattern)
```
src/
├── app/                        # Next.js App Router (Route-based)
│   ├── globals.css            # Global styles + Tailwind imports
│   ├── layout.tsx             # Root layout (Providers + Metadata)
│   ├── page.tsx              # Homepage - Dashboard (/)
│   ├── loading.tsx           # Global loading UI
│   ├── error.tsx             # Global error boundary  
│   ├── not-found.tsx         # 404 page
│   ├── favicon.ico           # App favicon
│   │
│   ├── (dashboard)/          # Route groups (URL structure)
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── expenses/         # /expenses routes
│   │   │   ├── page.tsx      # Expenses list (/expenses)
│   │   │   ├── loading.tsx   # Expenses loading state
│   │   │   ├── error.tsx     # Expenses error boundary
│   │   │   ├── new/          # /expenses/new
│   │   │   │   └── page.tsx  # Add expense form
│   │   │   └── [id]/         # /expenses/[id]
│   │   │       ├── page.tsx  # Expense details
│   │   │       └── edit/     # /expenses/[id]/edit
│   │   │           └── page.tsx # Edit expense form
│   │   │
│   │   ├── reports/          # /reports routes  
│   │   │   ├── page.tsx      # Reports dashboard
│   │   │   ├── loading.tsx   # Reports loading
│   │   │   └── [type]/       # /reports/[type]
│   │   │       └── page.tsx  # Specific report type
│   │   │
│   │   └── settings/         # /settings routes
│   │       ├── page.tsx      # General settings
│   │       ├── profile/      # /settings/profile
│   │       │   └── page.tsx
│   │       └── preferences/  # /settings/preferences
│   │           └── page.tsx
│   │
│   └── api/                  # API Routes (Server Actions)
│       ├── expenses/         
│       │   └── route.ts      # GET, POST /api/expenses
│       ├── upload/
│       │   └── route.ts      # File upload endpoint
│       └── auth/
│           └── route.ts      # Authentication endpoints
│
├── components/               # Reusable Components (Atomic Design)
│   ├── ui/                  # Base UI Components (shadcn/ui)
│   │   ├── button.tsx       # <Button /> component
│   │   ├── input.tsx        # <Input /> component  
│   │   ├── card.tsx         # <Card /> component
│   │   ├── dialog.tsx       # <Dialog /> component
│   │   ├── select.tsx       # <Select /> component
│   │   ├── calendar.tsx     # <Calendar /> component
│   │   ├── popover.tsx      # <Popover /> component
│   │   ├── drawer.tsx       # <Drawer /> component (mobile)
│   │   ├── toast.tsx        # <Toast /> component
│   │   ├── skeleton.tsx     # <Skeleton /> loading component
│   │   ├── badge.tsx        # <Badge /> component
│   │   ├── switch.tsx       # <Switch /> component
│   │   ├── tooltip.tsx      # <Tooltip /> component
│   │   ├── dropdown-menu.tsx # <DropdownMenu /> component
│   │   └── index.ts         # Barrel exports
│   │
│   ├── layout/              # Layout Components
│   │   ├── app-shell.tsx    # Main app shell wrapper
│   │   ├── sidebar/         # Sidebar components
│   │   │   ├── index.tsx    # Main sidebar component
│   │   │   ├── nav-item.tsx # Individual nav items
│   │   │   └── nav-section.tsx # Grouped nav sections
│   │   ├── header/          # Header components
│   │   │   ├── index.tsx    # Main header
│   │   │   ├── breadcrumbs.tsx # Navigation breadcrumbs
│   │   │   ├── search.tsx   # Global search
│   │   │   └── user-menu.tsx # User dropdown menu
│   │   ├── mobile/          # Mobile-specific layouts
│   │   │   ├── bottom-nav.tsx # Mobile bottom navigation
│   │   │   └── mobile-drawer.tsx # Mobile drawer menu
│   │   └── theme-toggle.tsx # Dark/light mode toggle
│   │
│   ├── features/            # Feature-Specific Components
│   │   ├── expenses/        # Expense-related components
│   │   │   ├── forms/       # Form components
│   │   │   │   ├── expense-form.tsx # Main expense form
│   │   │   │   ├── form-fields/ # Individual form fields
│   │   │   │   │   ├── amount-input.tsx
│   │   │   │   │   ├── category-select.tsx
│   │   │   │   │   ├── date-picker.tsx
│   │   │   │   │   └── description-input.tsx
│   │   │   │   └── form-actions.tsx # Form buttons
│   │   │   ├── list/        # List components
│   │   │   │   ├── expense-list.tsx # Main list component
│   │   │   │   ├── expense-item.tsx # Individual list item
│   │   │   │   ├── list-filters.tsx # Filter components
│   │   │   │   ├── list-header.tsx # List header with actions
│   │   │   │   └── empty-state.tsx # Empty list state
│   │   │   ├── cards/       # Card components
│   │   │   │   ├── expense-card.tsx # Mobile expense card
│   │   │   │   ├── stats-card.tsx # Statistics card
│   │   │   │   └── summary-card.tsx # Summary information
│   │   │   ├── dialogs/     # Modal dialogs
│   │   │   │   ├── expense-dialog.tsx # Add/Edit modal
│   │   │   │   ├── delete-dialog.tsx # Delete confirmation
│   │   │   │   └── bulk-actions-dialog.tsx # Bulk operations
│   │   │   └── index.ts     # Feature exports
│   │   │
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── stats/       # Statistics components
│   │   │   │   ├── overview-stats.tsx # Main stats cards
│   │   │   │   ├── monthly-stats.tsx # Monthly breakdown
│   │   │   │   └── category-stats.tsx # Category statistics
│   │   │   ├── charts/      # Chart components
│   │   │   │   ├── category-chart.tsx # Category pie chart
│   │   │   │   ├── trend-chart.tsx # Trend line chart
│   │   │   │   ├── comparison-chart.tsx # Comparison chart
│   │   │   │   └── chart-container.tsx # Chart wrapper
│   │   │   ├── widgets/     # Dashboard widgets
│   │   │   │   ├── recent-expenses.tsx # Recent activity
│   │   │   │   ├── quick-actions.tsx # Quick action buttons
│   │   │   │   ├── insights.tsx # AI insights (future)
│   │   │   │   └── goals.tsx # Budget goals (future)
│   │   │   └── index.ts     # Dashboard exports
│   │   │
│   │   └── reports/         # Reports-specific components
│   │       ├── generators/  # Report generation
│   │       │   ├── pdf-generator.tsx # PDF export
│   │       │   ├── csv-generator.tsx # CSV export
│   │       │   └── excel-generator.tsx # Excel export
│   │       ├── filters/     # Report filters
│   │       │   ├── date-range-filter.tsx
│   │       │   ├── category-filter.tsx
│   │       │   └── advanced-filters.tsx
│   │       ├── previews/    # Report previews
│   │       │   ├── report-preview.tsx
│   │       │   └── chart-preview.tsx
│   │       └── index.ts     # Reports exports
│   │
│   └── providers/           # React Context Providers
│       ├── theme-provider.tsx # Theme management (next-themes)
│       ├── query-provider.tsx # TanStack Query client
│       ├── toast-provider.tsx # Toast notifications (Sonner)
│       ├── modal-provider.tsx # Global modal state
│       └── index.tsx        # Combined providers
│
├── lib/                     # Shared Utilities & Configuration
│   ├── api/                 # API Layer
│   │   ├── client.ts        # Base API client configuration
│   │   ├── endpoints/       # API endpoint definitions
│   │   │   ├── expenses.ts  # Expense API calls
│   │   │   ├── categories.ts # Category API calls
│   │   │   ├── reports.ts   # Reports API calls
│   │   │   └── index.ts     # API exports
│   │   ├── types/          # API type definitions
│   │   │   ├── requests.ts  # Request types
│   │   │   ├── responses.ts # Response types
│   │   │   └── index.ts     # API type exports
│   │   └── queries.ts       # TanStack Query definitions
│   │
│   ├── validations/         # Form & Data Validation (Zod)
│   │   ├── expense.ts       # Expense validation schemas
│   │   ├── user.ts          # User validation schemas
│   │   ├── common.ts        # Common validation patterns
│   │   └── index.ts         # Validation exports
│   │
│   ├── utils/              # Utility Functions
│   │   ├── cn.ts           # Class name utility (clsx + tailwind-merge)
│   │   ├── formatters.ts   # Data formatting (currency, dates)
│   │   ├── dates.ts        # Date manipulation utilities
│   │   ├── currency.ts     # Currency utilities
│   │   ├── file.ts         # File handling utilities
│   │   ├── url.ts          # URL utilities
│   │   └── index.ts        # Utility exports
│   │
│   ├── constants/          # App Constants
│   │   ├── categories.ts   # Expense categories definition
│   │   ├── payment-methods.ts # Payment methods
│   │   ├── routes.ts       # App routes constants
│   │   ├── config.ts       # App configuration
│   │   └── index.ts        # Constants exports
│   │
│   ├── stores/             # State Management (Zustand)
│   │   ├── app-store.ts    # Global app state
│   │   ├── expense-store.ts # Expense-specific state
│   │   ├── ui-store.ts     # UI state (modals, sidebar)
│   │   └── index.ts        # Store exports
│   │
│   └── types/              # TypeScript Type Definitions
│       ├── expense.ts      # Expense-related types
│       ├── user.ts         # User-related types
│       ├── api.ts          # API-related types
│       ├── global.d.ts     # Global type declarations
│       └── index.ts        # Type exports
│
├── hooks/                  # Custom React Hooks
│   ├── use-expenses.ts     # Expense CRUD operations
│   ├── use-categories.ts   # Categories data
│   ├── use-stats.ts        # Statistics & analytics
│   ├── use-reports.ts      # Report generation
│   ├── use-filters.ts      # URL-based filters (nuqs)
│   ├── use-debounce.ts     # Debounced values
│   ├── use-mobile.ts       # Mobile device detection
│   ├── use-local-storage.ts # Local storage hook
│   ├── use-theme.ts        # Theme management
│   └── index.ts            # Hook exports
│
└── styles/                 # Styling & CSS
    ├── globals.css         # Global styles + Tailwind imports
    ├── components.css      # Component-specific styles
    └── utilities.css       # Custom utility classes
```

### 🗂️ File Naming Conventions (Industry Standard)

#### Components
```typescript
// PascalCase for components
ExpenseForm.tsx          // ❌ Wrong
expense-form.tsx         // ✅ Correct (kebab-case)
ExpenseFormComponent.tsx // ❌ Wrong (redundant)

// Barrel exports in index.ts
components/expenses/index.ts:
export { ExpenseForm } from './expense-form';
export { ExpenseList } from './expense-list';
```

#### Hooks
```typescript
// camelCase starting with "use"
useExpenses.ts          // ❌ Wrong
use-expenses.ts         // ✅ Correct
useExpenseData.ts       // ✅ Also correct
```

#### Utilities & Libraries
```typescript
// camelCase or kebab-case
apiClient.ts           // ✅ Correct
api-client.ts          // ✅ Also correct
formatCurrency.ts      // ✅ Correct
format-currency.ts     // ✅ Also correct
```

#### Types & Interfaces
```typescript
// PascalCase for types/interfaces, kebab-case for files
// types/expense.ts
export interface Expense { }
export type ExpenseStatus = 'pending' | 'completed';
```
│       └── globals.css
└── public/
    ├── favicon.ico
    └── images/
```

## 🎨 Modern Design System (shadcn/ui + Tailwind CSS)

### CSS Variables (shadcn/ui Standard)
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
```

### Typography Scale (Modern Stack)
```css
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }
  h1 { @apply text-4xl lg:text-5xl; }
  h2 { @apply text-3xl lg:text-4xl; }
  h3 { @apply text-2xl lg:text-3xl; }
  h4 { @apply text-xl lg:text-2xl; }
  h5 { @apply text-lg lg:text-xl; }
  h6 { @apply text-base lg:text-lg; }
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

### Modern Data Management Stack

#### TanStack Query + Zustand Integration
```typescript
// lib/queries.ts - React Query definitions
export const useExpenses = (filters?: ExpenseFilters) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => api.expenses.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.expenses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created successfully');
    },
  });
};

// lib/store.ts - Zustand for client state
interface AppStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentExpense: Expense | null;
  setCurrentExpense: (expense: Expense | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  currentExpense: null,
  setCurrentExpense: (expense) => set({ currentExpense: expense }),
}));

// hooks/use-filters.ts - URL-based state with nuqs
export const useExpenseFilters = () => {
  const [category, setCategory] = useQueryState('category');
  const [dateRange, setDateRange] = useQueryState('dateRange');
  const [search, setSearch] = useQueryState('search');
  
  return { category, setCategory, dateRange, setDateRange, search, setSearch };
};
```

#### Form Management with React Hook Form + Zod
```typescript
// lib/validations.ts - Zod schemas
export const expenseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  date: z.date().max(new Date(), 'Date cannot be in the future'),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer']),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// components/expenses/expense-form.tsx
export function ExpenseForm({ expense }: { expense?: Expense }) {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense || {
      title: '',
      description: '',
      amount: 0,
      category: '',
      subcategory: '',
      date: new Date(),
      paymentMethod: 'cash',
    },
  });
  
  const createExpense = useCreateExpense();
  
  const onSubmit = (data: ExpenseFormData) => {
    createExpense.mutate(data);
  };
}
```

## 📊 Modern Charts with Recharts

### Category Distribution Chart
```typescript
// components/dashboard/category-chart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function CategoryChart({ data }: { data: CategoryData[] }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="amount"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Amount']}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Monthly Trend Chart
```typescript
// components/dashboard/trend-chart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function TrendChart({ data }: { data: MonthlyData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Total']}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

## 📄 PDF Export Requirements

### Report Content
- **Header**: App logo, report title, generation date
- **Filters Applied**: Date range, categories, etc.
- **Summary Stats**: Total amount, expense count, average
- **Category Breakdown**: Table with amounts and percentages
- **Expense List**: Detailed table with all expenses
- **Chart**: Embedded category pie chart

## 📱 Responsive Design (MANDATORY)

### Device Requirements
- **MANDATORY**: Application must work perfectly on **desktop computers and smartphones**
- **Primary Target**: Desktop (1920x1080+) - Full featured experience
- **Secondary Target**: Smartphones (375x667+) - Optimized mobile experience
- **Tablet Support**: Nice to have (768x1024) - Adaptive experience

### Breakpoints Strategy
```css
/* Mobile First Approach - MANDATORY */
/* Base styles: Mobile (< 640px) */
.container { padding: 1rem; }

/* Small screens: Large phones (≥ 640px) */
@media (min-width: 640px) { 
  .container { padding: 1.5rem; }
}

/* Medium screens: Tablets (≥ 768px) */
@media (min-width: 768px) { 
  .container { padding: 2rem; }
}

/* Large screens: Laptops (≥ 1024px) */
@media (min-width: 1024px) { 
  .container { padding: 2.5rem; }
}

/* Extra large: Desktops (≥ 1280px) */
@media (min-width: 1280px) { 
  .container { padding: 3rem; }
}
```

### Responsive Component Requirements

#### Navigation
- **Desktop**: Fixed sidebar with full navigation menu
- **Mobile**: Collapsible hamburger menu or bottom tab navigation
- **Implementation**: Use Tailwind `hidden md:block` and `md:hidden` classes

#### Layout
- **Desktop**: Multi-column layouts (sidebar + main content)
- **Mobile**: Single column, stacked layout
- **Grid**: Use CSS Grid with responsive columns

#### Forms
- **Desktop**: Multi-column forms where appropriate
- **Mobile**: Single column, larger touch targets (min 44px)
- **Inputs**: Full width on mobile, constrained width on desktop

#### Tables/Lists
- **Desktop**: Full table view with all columns visible
- **Mobile**: Card-based layout or horizontal scroll with important columns
- **Implementation**: Use `overflow-x-auto` for mobile tables

#### Charts and Graphs
- **Desktop**: Larger charts with detailed legends and tooltips
- **Mobile**: Simplified charts optimized for touch, responsive sizing
- **Chart.js**: Configure responsive options

#### Modals/Dialogs
- **Desktop**: Centered modals with max-width constraints
- **Mobile**: Full-screen modals or bottom sheet style
- **Implementation**: Use `fixed inset-0` for mobile, `fixed inset-x-4 top-4` for desktop

### Touch and Interaction
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Spacing**: Adequate spacing between touch targets (8px minimum)
- **Gestures**: Implement swipe gestures for mobile actions (delete, edit)
- **Hover States**: Only apply hover effects on devices that support hover
- **Focus States**: Clear focus indicators for keyboard navigation

### Performance on Mobile
- **Images**: Responsive images with appropriate sizes
- **Fonts**: Optimize font loading and sizing for mobile readability
- **Animations**: Reduce motion for users with motion sensitivity preferences
- **Loading**: Prioritize above-the-fold content loading

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

## 🚀 Modern Coding Standards & Best Practices (2025)

### 📋 Code Organization Principles

#### 1. **Feature-First Architecture** (Preferred over Layer-First)
```typescript
// ❌ Layer-First (Outdated)
src/
├── components/
├── hooks/
├── utils/
└── types/

// ✅ Feature-First (Modern)
src/
├── features/
│   ├── expenses/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   └── dashboard/
└── shared/              // Only truly shared code
    ├── components/ui/
    ├── hooks/
    └── utils/
```

#### 2. **Component Patterns** (Modern React)
```typescript
// ✅ Compound Component Pattern
export const ExpenseCard = {
  Root: ExpenseCardRoot,
  Header: ExpenseCardHeader,
  Content: ExpenseCardContent,
  Actions: ExpenseCardActions,
};

// Usage:
<ExpenseCard.Root>
  <ExpenseCard.Header title={expense.title} />
  <ExpenseCard.Content amount={expense.amount} />
  <ExpenseCard.Actions onEdit={handleEdit} onDelete={handleDelete} />
</ExpenseCard.Root>

// ✅ Polymorphic Component Pattern
interface ButtonProps<T extends React.ElementType = 'button'> {
  as?: T;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button<T extends React.ElementType = 'button'>({
  as,
  ...props
}: ButtonProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const Component = as || 'button';
  return <Component {...props} />;
}

// Usage:
<Button>Regular Button</Button>
<Button as="a" href="/expenses">Link Button</Button>
<Button as={Link} to="/expenses">Router Link</Button>
```

#### 3. **Custom Hooks Patterns** (Business Logic Separation)
```typescript
// ✅ Command Pattern for Actions
export function useExpenseCommands() {
  const queryClient = useQueryClient();
  
  const commands = {
    create: useMutation({
      mutationFn: expenseApi.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        toast.success('Expense created successfully');
      },
    }),
    
    update: useMutation({
      mutationFn: expenseApi.update,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        toast.success('Expense updated successfully');
      },
    }),
    
    delete: useMutation({
      mutationFn: expenseApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        toast.success('Expense deleted successfully');
      },
    }),
  };
  
  return commands;
}

// ✅ Query + Command Separation
export function useExpenseData(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ Composite Hook Pattern
export function useExpenseManagement() {
  const data = useExpenseData();
  const commands = useExpenseCommands();
  const filters = useExpenseFilters();
  
  return {
    ...data,
    ...commands,
    ...filters,
  };
}
```

#### 4. **Error Handling Patterns** (Production Ready)
```typescript
// ✅ Error Boundary with Recovery Actions
export class ExpenseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Expense Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    
    return this.props.children;
  }
}

// ✅ API Error Handling with Types
type ApiError = {
  message: string;
  code: string;
  status: number;
};

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Response) {
    return {
      message: error.statusText,
      code: error.status.toString(),
      status: error.status,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN',
      status: 500,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN',
    status: 500,
  };
}
```

#### 5. **TypeScript Best Practices** (Strict Mode)
```typescript
// ✅ Discriminated Unions for State
type LoadingState = {
  status: 'loading';
};

type SuccessState = {
  status: 'success';
  data: Expense[];
};

type ErrorState = {
  status: 'error';
  error: string;
};

type ExpenseState = LoadingState | SuccessState | ErrorState;

// ✅ Branded Types for IDs
type ExpenseId = string & { __brand: 'ExpenseId' };
type CategoryId = string & { __brand: 'CategoryId' };

export function createExpenseId(id: string): ExpenseId {
  return id as ExpenseId;
}

// ✅ Generic Constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// ✅ Utility Types
type CreateExpenseDto = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateExpenseDto = Partial<CreateExpenseDto>;
type ExpenseWithStats = Expense & {
  categoryTotal: number;
  monthlyAverage: number;
};
```

### 🏗️ Component Architecture Standards

#### 1. **Single Responsibility Principle**
```typescript
// ❌ Component doing too much
function ExpenseManager() {
  // Fetching data
  // Form handling
  // Validation
  // UI rendering
  // Error handling
}

// ✅ Separated responsibilities
function ExpensePage() {
  return (
    <ErrorBoundary>
      <ExpenseProvider>
        <ExpenseHeader />
        <ExpenseFilters />
        <ExpenseList />
        <ExpenseActions />
      </ExpenseProvider>
    </ErrorBoundary>
  );
}
```

#### 2. **Props Interface Design**
```typescript
// ✅ Well-designed props interface
interface ExpenseCardProps {
  expense: Expense;
  variant?: 'compact' | 'detailed' | 'minimal';
  showActions?: boolean;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
  className?: string;
  'data-testid'?: string;
}

// ✅ Render Props Pattern for Flexibility
interface ExpenseListProps {
  expenses: Expense[];
  renderItem?: (expense: Expense, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}
```

#### 3. **Performance Optimization Patterns**
```typescript
// ✅ Memo with proper comparison
const ExpenseCard = React.memo(function ExpenseCard({ expense, onEdit, onDelete }) {
  const handleEdit = useCallback(() => onEdit?.(expense), [onEdit, expense]);
  const handleDelete = useCallback(() => onDelete?.(expense.id), [onDelete, expense.id]);
  
  return (
    <Card>
      {/* Card content */}
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.expense.id === nextProps.expense.id &&
    prevProps.expense.updatedAt === nextProps.expense.updatedAt
  );
});

// ✅ Virtual Scrolling for Large Lists
import { FixedSizeList as List } from 'react-window';

function ExpenseVirtualList({ expenses }: { expenses: Expense[] }) {
  const renderRow = useCallback(({ index, style }) => (
    <div style={style}>
      <ExpenseCard expense={expenses[index]} />
    </div>
  ), [expenses]);
  
  return (
    <List
      height={600}
      itemCount={expenses.length}
      itemSize={120}
    >
      {renderRow}
    </List>
  );
}
```

### 📁 File & Folder Standards

#### 1. **Consistent Naming Convention**
```
// ✅ Component Files
expense-card.tsx           // Main component
expense-card.test.tsx      // Unit tests
expense-card.stories.tsx   // Storybook stories
expense-card.types.ts      // Component-specific types
index.ts                   // Barrel export

// ✅ Hook Files  
use-expense-data.ts        // Data fetching hook
use-expense-commands.ts    // Command actions hook
use-expense-filters.ts     // Filter management hook

// ✅ Utility Files
format-currency.ts         // Single purpose utility
date-helpers.ts           // Date manipulation utilities
api-client.ts             // API client configuration
```

#### 2. **Barrel Exports Strategy**
```typescript
// ✅ Feature-level index.ts
// features/expenses/index.ts
export { ExpenseCard } from './components/expense-card';
export { ExpenseForm } from './components/expense-form';
export { ExpenseList } from './components/expense-list';
export { useExpenseData } from './hooks/use-expense-data';
export { useExpenseCommands } from './hooks/use-expense-commands';
export type { Expense, CreateExpenseDto } from './types';

// ✅ Component-level index.ts
// components/expense-card/index.ts
export { ExpenseCard } from './expense-card';
export type { ExpenseCardProps } from './expense-card.types';
```

### 🎯 Code Quality Standards

#### 1. **ESLint + Prettier Configuration**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "react/jsx-sort-props": "error",
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external", 
        "internal",
        "parent",
        "sibling",
        "index"
      ],
      "newlines-between": "always"
    }],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

#### 2. **Import Organization**
```typescript
// ✅ Correct import order
// 1. React & Next.js
import React from 'react';
import { NextPage } from 'next';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 3. Internal utilities & types
import { cn } from '@/lib/utils';
import type { Expense } from '@/lib/types';

// 4. UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. Feature components
import { ExpenseCard } from '@/features/expenses';

// 6. Relative imports
import './expense-list.css';
```

## 🚀 Modern Development Practices & Architecture (2025)

### 🏗️ Architecture Principles
```typescript
// 1. Component Composition Pattern
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

// 2. Custom Hooks for Business Logic
export function useExpenseActions() {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: api.expenses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created successfully');
    },
  });
  
  return { createExpense: createMutation.mutate };
}

// 3. Server Components for Data Fetching (App Router)
async function ExpensesPage() {
  const expenses = await getExpenses(); // Server-side fetch
  
  return (
    <div>
      <ExpenseList initialData={expenses} />
    </div>
  );
}
```

### 📱 Mobile-First Responsive Strategy
```typescript
// 1. Responsive Layout Components
export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <Navigation />
      </aside>
      
      {/* Mobile Sidebar (Drawer) */}
      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerContent className="lg:hidden">
          <Navigation />
        </DrawerContent>
      </Drawer>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// 2. Adaptive Components
export function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-2 sm:hidden">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate">{expense.title}</h3>
            <Badge variant="secondary">{expense.category}</Badge>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
          <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">{expense.title}</h3>
            <p className="text-sm text-muted-foreground">{expense.description}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{formatCurrency(expense.amount)}</p>
            <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 🎨 Modern UI Patterns
```typescript
// 1. Command Palette (cmdk)
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search expenses, categories, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => router.push('/expenses/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// 2. Optimistic Updates
export function useOptimisticExpenses() {
  const [optimisticExpenses, addOptimisticExpense] = useOptimistic(
    expenses,
    (currentExpenses, newExpense: Expense) => [newExpense, ...currentExpenses]
  );
  
  return { optimisticExpenses, addOptimisticExpense };
}

// 3. Advanced Filtering with URL State
export function ExpenseFilters() {
  const { category, setCategory, dateRange, setDateRange } = useExpenseFilters();
  
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg lg:flex-row">
      <Select value={category || ''} onValueChange={setCategory}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full lg:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? formatDateRange(dateRange) : 'Select date range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### ⚡ Performance & Accessibility
```typescript
// 1. Virtualization for Large Lists
import { FixedSizeList as List } from 'react-window';

export function VirtualizedExpenseList({ expenses }: { expenses: Expense[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ExpenseCard expense={expenses[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={expenses.length}
      itemSize={120}
      className="border rounded-lg"
    >
      {Row}
    </List>
  );
}

// 2. Accessibility Best Practices
export function AccessibleButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.className
      )}
    >
      {children}
    </Button>
  );
}

// 3. Error Boundaries with Recovery
export function ExpenseErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-6">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading your expenses.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
```

## ⚙️ Project Setup & Configuration (Production Ready)

### �️ Initial Setup Commands
```bash
# 1. Create Next.js project with TypeScript
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir

# 2. Navigate to project
cd frontend

# 3. Install production dependencies
npm install @tanstack/react-query @hookform/resolvers react-hook-form zod zustand nuqs sonner vaul cmdk recharts lucide-react date-fns framer-motion class-variance-authority clsx tailwind-merge

# 4. Install Radix UI components
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-popover @radix-ui/react-calendar @radix-ui/react-switch @radix-ui/react-tooltip @radix-ui/react-dropdown-menu

# 5. Install development tools
npm install -D @types/node eslint-config-prettier prettier @typescript-eslint/eslint-plugin

# 6. Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card dialog select calendar popover switch tooltip dropdown-menu badge skeleton
```

### 📝 Configuration Files

#### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/features/*": ["./src/features/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Next.js Configuration (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

#### Tailwind Configuration (tailwind.config.ts)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

#### ESLint Configuration (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "react/jsx-sort-props": "error",
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external", 
        "internal",
        ["parent", "sibling"],
        "index"
      ],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

#### Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### 📦 Package.json Scripts (Production Ready)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "prepare": "husky install"
  }
}
```

### 🔧 Development Tools Setup

#### VS Code Settings (.vscode/settings.json)
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### Environment Variables (.env.local.example)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_ENV=development

# Optional: Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Error Reporting
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 🎯 Implementation Instructions

**IMPLEMENT the complete modern frontend following ALL the specifications above:**

### 🏗️ **Architecture Requirements:**
1. **Feature-First Structure** - Organize by business domain, not technical layers
2. **Component Composition** - Use compound and polymorphic patterns
3. **Single Responsibility** - Each component/hook should have one clear purpose
4. **TypeScript Strict Mode** - Full type safety with discriminated unions

### 🎨 **UI/UX Requirements:**
1. **shadcn/ui Components** - Use for ALL UI elements (no custom components)
2. **Mobile-First Design** - Perfect mobile experience with adaptive layouts
3. **Accessibility** - WCAG 2.1 AA compliance with proper ARIA labels
4. **Performance** - Lazy loading, virtual scrolling, memo optimization

### 🔧 **Technical Requirements:**
1. **TanStack Query** - Server state management with proper caching
2. **React Hook Form + Zod** - Type-safe form validation
3. **Zustand** - Client state for UI (modals, sidebar, etc.)
4. **nuqs** - URL-based filter state management
5. **Sonner** - Modern toast notifications
6. **Vaul** - Mobile drawer navigation
7. **Recharts** - Data visualization charts

### ✅ **Quality Standards:**
1. **Code Organization** - Follow file naming and import conventions
2. **Error Handling** - Comprehensive error boundaries and API error handling  
3. **Testing Ready** - Components designed for easy testing
4. **Performance** - Optimized for production deployment

**Test thoroughly: API integration, form validation, mobile responsiveness, accessibility, and cross-browser compatibility before completion.**

---

**Status**: Ready for Phase 1 (Backend) and Phase 2 (Frontend) implementation
**Date**: October 12, 2025