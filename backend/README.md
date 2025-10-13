# Expense Tracker AI - Backend

REST API backend for the Expense Tracker AI application built with Node.js, Express, TypeScript, and SQLite.

## 🚀 Features

- **Complete CRUD Operations** for expense management
- **Advanced Filtering** by date, category, amount, payment method
- **Pagination and Sorting** for large datasets
- **Statistics and Analytics** with aggregated data
- **Input Validation** with Joi schema validation
- **Security** with CORS, Rate Limiting, and Helmet
- **Structured Logging** with Winston
- **SQLite Database** with migrations and seeds
- **TypeScript** for type safety
- **SOLID Principles** architecture

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite3
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Express Rate Limit

## 📋 API Endpoints

### Expenses
- `GET /api/expenses` - List expenses with filters and pagination
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/expenses/stats` - Dashboard statistics
- `GET /api/expenses/summary` - Monthly/yearly summaries

### Categories
- `GET /api/categories` - List all categories and subcategories

### Health
- `GET /api/health` - API health status

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run database migrations:
```bash
npm run migrate
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be running at `http://localhost:3001`

## 🏗️ Project Structure

```
src/
├── server.ts              # Application entry point
├── app.ts                 # Express app configuration
├── controllers/           # Request handlers
├── services/              # Business logic
├── repositories/          # Data access layer
├── models/                # Data models and interfaces
├── routes/                # API route definitions
├── middleware/            # Custom middleware
├── database/              # Database configuration and migrations
├── utils/                 # Utility functions and helpers
└── types/                 # TypeScript type definitions
```

## 📊 Database Schema

The application uses SQLite with the following main table:

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
```

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## 🔐 Security Features

- **CORS**: Configured for frontend origin
- **Rate Limiting**: 100 requests per 15 minutes
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Parameterized queries

## 📝 License

MIT License - see LICENSE file for details.