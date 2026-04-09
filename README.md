# Finzio 💸

Finzio is a modern, comprehensive personal finance management application built to help you track spending, manage accounts, and stay on top of your financial health. Built with React and Firebase, it features a sleek user interface, real-time data synchronization, and robust categorical budgeting.

## ✨ Features

- **📱 Progressive Web App (PWA)**: Install Finzio as a native app on iOS, Android, macOS, Windows, and Linux.
- **📊 Interactive Dashboard**: Get a quick glance at your financial health with summarized metrics.
- **💼 Accounts Management**: Keep track of multiple accounts including checking, savings, credit cards, and cash.
- **💸 Transaction Tracking**: Log your income, expenses, and transfers easily with an intuitive UI. Pagination helps you load tons of transactions quickly.
- **🎯 Budgets**: Set categorical limits on your spending and monitor progress to see where you can save.
- **🗂️ Categories**: Custom financial categorizations to organize transactions exactly how you want.
- **🏦 Loans Management**: Track your active loans, interest rates, and amounts pending right in the dashboard.
- **☁️ Cloud Sync via Firebase**: Real-time Firestore synchronization means you'll never lose your data.
- **🌓 Adaptive Theming**: Complete with Light and Dark mode options tailored with a clean "Soft Glassmorphism" UI.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + Vite (Configured as PWA)
- **Routing**: React Router DOM (v7)
- **Backend/Database**: Firebase v12 (Authentication & Cloud Firestore)
- **Styling**: SCSS, CSS Modules, Soft Glassmorphism Design System
- **Formatting Tools**: ESLint

## 📂 Project Architecture

A neatly organized architecture ensures developers can rapidly onboard onto the project:

```plaintext
src/
├── components/   # Reusable UI elements (Buttons, Modals, List items)
├── contexts/     # React Context API (AuthContext, AppContext, ThemeContext)
├── hooks/        # Feature-based custom hooks (useTransactions, useAccounts)
├── pages/        # Route wrappers and views (Dashboard, Budgets, Login)
├── config/       # Configuration setup (Firebase init)
├── styles/       # Global styles and design system variables
└── utils/        # Generic helper functions (formatting, date logic)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- A Google Firebase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd finzio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase configurations:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Demo Access**
```bash
  Email: demo@finzioo.com
  Password: 123456
```

## 💡 Development Highlights

- **Granular Logic Encapsulation:** While context is used for auth and theme, feature-specific Firestore state management is abstracted efficiently behind custom hooks (`useAccounts`, `useTransactions`, `useLoans`, `usePagination`).
- **Real-Time Data Echoing:** All financial edits, creates, and deletes seamlessly sync with Firebase Firestore, providing reactive UI feedback without needing manual refetches.
- **Scalable Component Refactoring:** Components are named professionally, removing action verb clutter and enforcing singular-vs-plural folder standards for lists vs singular components across `src/pages/` and `src/components/`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source and ready for anyone looking for a well-designed template or personal tool. 
