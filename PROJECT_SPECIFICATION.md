# Expense Tracker AI - Project Specification

## 📋 Overview
Complete expense tracking web application that helps users manage their personal finances. The application should be modern, intuitive and professional.

## 🏗️ Architecture
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + SQLite3
- **Structure**: Monorepo with separate backend and frontend

## 📁 Project Structure
```
expense-tracker-ai/
├── README.md
├── PROJECT_SPECIFICATION.md
├── DEVELOPMENT_PHASES.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   └── expenses.ts
│   │   ├── controllers/
│   │   │   └── expenseController.ts
│   │   ├── models/
│   │   │   └── Expense.ts
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   └── helpers.ts
│   │   └── types/
│   │       └── index.ts
│   └── database/
│       └── expenses.db
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── .env.local.example
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── expenses/
    │   │   │   ├── page.tsx
    │   │   │   ├── add/
    │   │   │   └── [id]/
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── button.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── select.tsx
    │   │   │   ├── modal.tsx
    │   │   │   ├── toast.tsx
    │   │   │   └── skeleton.tsx
    │   │   ├── forms/
    │   │   │   └── ExpenseForm.tsx
    │   │   ├── charts/
    │   │   │   └── CategoryChart.tsx
    │   │   ├── layout/
    │   │   │   ├── Header.tsx
    │   │   │   ├── Sidebar.tsx
    │   │   │   └── ThemeToggle.tsx
    │   │   └── expenses/
    │   │       ├── ExpenseList.tsx
    │   │       ├── ExpenseCard.tsx
    │   │       └── ExpenseFilters.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   ├── utils.ts
    │   │   ├── validations.ts
    │   │   ├── constants.ts
    │   │   └── types.ts
    │   ├── hooks/
    │   │   ├── useExpenses.ts
    │   │   ├── useTheme.ts
    │   │   └── useToast.ts
    │   └── styles/
    │       └── globals.css
    └── public/
        ├── icons/
        └── images/
```

## 🗄️ Data Model

### Expense Interface
```typescript
interface Expense {
  id: string;
  title: string;                    // Required - Short description
  description?: string;             // Optional - Detailed description
  amount: number;                   // Required - Value (no maximum limit)
  category: string;                 // Required - Main category
  subcategory: string;              // Required - Subcategory
  date: Date;                       // Required - Date (cannot be future)
  paymentMethod: PaymentMethod;     // Required - Payment method
  createdAt: Date;
  updatedAt: Date;
}

type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'pix' 
  | 'bank_transfer';
```

## 📊 Categories and Subcategories

### 🍔 Food
- 🍽️ Restaurants
- 🛒 Grocery
- ☕ Coffee/Snacks
- 🛍️ Delivery

### 🚗 Transportation
- ⛽ Fuel
- 🚌 Public Transport
- 🚕 Uber/Taxi
- 🔧 Maintenance

### 🎮 Entertainment
- 🎬 Movies/Theater
- 🎵 Streaming/Music
- 🏃 Gym/Sports
- 🎲 Games/Hobbies

### 🛍️ Shopping
- 👕 Clothing
- 📱 Electronics
- 🏠 Home/Decoration
- 💄 Beauty/Care

### 💰 Bills
- ⚡ Electricity
- 💧 Water
- 📞 Phone/Internet
- 🏠 Rent/Mortgage

### ❓ Others
- 🏥 Health
- 📚 Education
- 🎁 Gifts
- 📋 Miscellaneous

## 🎨 Design System

### Theme
- **Default**: Dark mode
- **Alternative**: Light mode
- **Toggle**: Available in header

### Color Palette (Modern)
```css
/* Dark Theme (Default) */
--background: #0a0a0a;
--foreground: #fafafa;
--card: #111111;
--card-foreground: #fafafa;
--primary: #6366f1;          /* Modern indigo */
--primary-foreground: #fafafa;
--secondary: #1a1a1a;
--secondary-foreground: #a1a1aa;
--accent: #10b981;           /* Success green */
--accent-foreground: #fafafa;
--destructive: #ef4444;      /* Delete red */
--border: #27272a;
--input: #18181b;
--ring: #6366f1;

/* Light Theme */
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
```

## 🚀 Technologies

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **ORM**: sqlite3 (native driver)
- **Validation**: Joi or Zod

## 📝 Code Standards

### Code Language
- **MANDATORY**: All code must be written in **English**
- **Variables**: In English (e.g. `expenseAmount`, `categoryName`)
- **Functions**: In English (e.g. `createExpense`, `validateInput`)
- **Comments**: In English (e.g. `// Validate expense data`)
- **Commit messages**: In English
- **File names**: In English
- **Inline documentation**: In English

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Chart.js
- **PDF**: jsPDF
- **State Management**: React Hooks + Context
- **HTTP Client**: Fetch API

## 📱 Features

### Core Features
1. **Add Expenses**
   - Form on separate page
   - Real-time validation
   - Toast confirmation

2. **List Expenses**
   - Paginated and organized list
   - Filters by period and category
   - Search by title/description
   - Skeleton loading

3. **Dashboard**
   - Summary cards (Month total, Overall total, Top category)
   - Category pie chart (Chart.js)
   - Recent expenses list

4. **Edit/Delete**
   - Inline editing or modal
   - Confirmation before delete
   - Toast feedback

### Advanced Features
1. **PDF Reports**
   - Customizable period
   - Total by category
   - Detailed list
   - Chart included

2. **Advanced Filters**
   - By period (This month, Last 30 days, Custom)
   - By category/subcategory
   - By payment method
   - By amount range

3. **User Experience**
   - Responsive design
   - Theme toggle (dark/light)
   - Toast notifications
   - Skeleton loading states
   - Smooth animations

## 🔧 API Endpoints

### Expenses
```
GET    /api/expenses              # List with filters
POST   /api/expenses              # Create new expense
GET    /api/expenses/:id          # Get by ID
PUT    /api/expenses/:id          # Update expense
DELETE /api/expenses/:id          # Delete expense
GET    /api/expenses/stats        # Statistics (dashboard)
```

### Categories
```
GET    /api/categories            # List categories and subcategories
```

## ✅ Validations

### Frontend & Backend
- **Title**: Required, 3-100 characters
- **Amount**: Required, > 0, no maximum limit
- **Date**: Required, cannot be future
- **Category**: Required, must exist in list
- **Subcategory**: Required, must belong to category
- **Payment Method**: Required, valid value

## 🔒 Security
- Double validation (frontend + backend)
- Input sanitization
- Rate limiting on backend
- CORS configured
- Security headers

## 📱 Responsiveness
- **Mobile First**: Design optimized for mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible sidebar on mobile
- **Forms**: Adaptive layout

## 🧪 Testing (Future)
- **Backend**: Jest + Supertest
- **Frontend**: Jest + React Testing Library
- **E2E**: Playwright (optional)

## 📦 Deploy (Future)
- **Backend**: Railway, Render or Vercel
- **Frontend**: Vercel or Netlify
- **Database**: Railway PostgreSQL or PlanetScale

---

**Creation Date**: October 12, 2025
**Version**: 1.0.0
**Status**: In Development