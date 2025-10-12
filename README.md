# 💰 Expense Tracker AI

A modern and professional web application for personal expense control, developed with Next.js, TypeScript, and SQLite.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 About the Project

**Expense Tracker AI** is a complete solution for personal finance management, offering an intuitive and modern interface to control expenses, view reports, and analyze spending patterns.

### ✨ Key Features

- 🎨 **Modern Interface**: Professional design with dark/light theme
- 📊 **Intuitive Dashboard**: Charts and analysis of your expenses
- 📱 **Fully Responsive**: Works perfectly on mobile and desktop
- 💾 **Local Persistence**: Data saved in SQLite (no internet required)
- 🏷️ **Smart Categorization**: Category and subcategory system with icons
- 📄 **PDF Reports**: Custom report generation
- 🔍 **Advanced Filters**: Search and filtering by period, category and more

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static typing
- **Tailwind CSS** - Modern styling
- **Chart.js** - Interactive charts
- **Lucide React** - Modern icons
- **jsPDF** - PDF report generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Static typing
- **SQLite3** - Local database
- **Joi/Zod** - Data validation

## 📁 Project Structure

```
expense-tracker-ai/
├── 📋 PROJECT_SPECIFICATION.md    # Complete specification
├── 📅 DEVELOPMENT_PHASES.md       # Development plan
├── 🎯 README.md                   # This file
├── 🔙 backend/                    # REST API
│   ├── src/
│   │   ├── controllers/           # Controllers
│   │   ├── models/               # Data models
│   │   ├── routes/               # API routes
│   │   ├── database/             # Database configuration
│   │   └── utils/                # Utilities
│   └── database/
│       └── expenses.db           # SQLite database
└── 🎨 frontend/                   # User interface
    ├── src/
    │   ├── app/                  # Pages (App Router)
    │   ├── components/           # React components
    │   ├── lib/                  # Libraries and utilities
    │   └── hooks/                # Custom hooks
    └── public/                   # Static files
```

## 🎯 Features

### ✅ Implemented (Planned)

#### 📝 Expense Management
- [x] Add expenses with validation
- [x] List and filter expenses
- [x] Edit existing expenses
- [x] Delete with confirmation
- [x] Categorization with icons

#### 📊 Dashboard and Analytics
- [x] Financial summary cards
- [x] Pie chart by categories
- [x] Period filters
- [x] Recent expenses list

#### 🎨 Interface and UX
- [x] Dark/light theme with toggle
- [x] Responsive design
- [x] Skeleton loading
- [x] Toast notifications
- [x] Smooth animations

#### 📄 Reports
- [x] PDF generation
- [x] CSV export
- [x] Custom filters

## 🏗️ Development in Phases

The project is being developed in **2 incremental phases**:

### 🚀 Phase 1: Foundation (Complete Backend)
- Project setup
- Complete REST API
- All CRUD operations
- Validations and security

### 🎨 Phase 2: Complete Frontend
- Modern design system
- Dashboard with charts
- API integration
- Reports and exports

## 🚀 How to Run

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/expense-tracker-ai.git
cd expense-tracker-ai
```

2. **Setup Backend**
```bash
cd backend
npm install
npm run dev  # Runs on port 3001
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev  # Runs on port 3000
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Available Scripts

#### Backend
```bash
npm run dev      # Development
npm run build    # Production build
npm start        # Production
npm run test     # Tests
```

#### Frontend
```bash
npm run dev      # Development
npm run build    # Production build
npm start        # Production
npm run lint     # Linting
```

## 📊 Available Categories

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

## 📱 Screenshots

*Coming soon - Screenshots will be added after implementation*

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [x] **Phase 1**: Complete backend foundation
- [ ] **Phase 2**: Complete frontend and integration
- [ ] **Future**: Cloud synchronization
- [ ] **Future**: Mobile app (React Native)
- [ ] **Future**: AI for automatic categorization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Inspired by modern web development best practices
- Icons by [Lucide](https://lucide.dev/)
- Design inspired by modern financial applications

---

⭐ **If this project helped you, consider giving it a star!** ⭐