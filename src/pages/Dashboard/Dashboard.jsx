import React, { useState, useEffect, useCallback } from 'react';
import Loader from '../../components/Loader/Loader';
import CircularProgress from '../../components/CircularProgress/CircularProgress';
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import useAppContext from '../../hooks/useAppContext';
import useFinancialSummary from '../../hooks/useFinancialSummary';
import useLoanSummary from '../../hooks/useLoanSummary';
import useBudgetSummary from '../../hooks/useBudgetSummary';
import { Collections, AccountType, STATUS } from '../../config/constants';
import { formatAccountNumber } from '../../utils/formatAccountNumber';
import './Dashboard.scss';

const initialAccount = {
  accountName: 'No Account',
  currentBalance: 0,
  accountNumber: '•••• •••• •••• ••••',
  accountType: 'SAVINGS',
  isActive: false
};

const Dashboard = () => {
  const { getCollection, formatCurrency } = useAppContext();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!getCollection) return;
    try {
      setLoading(true);
      const [
        fetchedAccounts,
        fetchedTransactions,
        fetchedLoans,
        fetchedBudgets,
        fetchedCategories
      ] = await Promise.all([
        getCollection(Collections.ACCOUNTS),
        getCollection(Collections.TRANSACTIONS),
        getCollection(Collections.LOANS),
        getCollection(Collections.BUDGETS),
        getCollection(Collections.CATEGORIES)
      ]);
      setAccounts(fetchedAccounts || []);
      setTransactions(fetchedTransactions || []);
      setLoans(fetchedLoans || []);
      setBudgets(fetchedBudgets || []);
      setCategories(fetchedCategories || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      // Add a slight artificial delay for the premium MoneyLoader experience
      setTimeout(() => setLoading(false), 800);
    }
  }, [getCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { totalIncomeMonth, totalIncomeYear, totalExpenseMonth, totalExpenseYear } = useFinancialSummary(transactions);
  const { totalToBePaid, totalToBeReceived } = useLoanSummary(loans);
  const { incomeVsBudget, expenseVsBudget } = useBudgetSummary(budgets, transactions);
  const [currentCard, setCurrentCard] = useState(0);

  const activeAccounts = accounts.filter(
    (account) => account.status === STATUS.ACTIVE && account.deletedAt === null
  );

  const netBalance = activeAccounts.reduce((total, account) => {
    return total + (parseFloat(account.currentBalance) || 0);
  }, 0);

  const savings = activeAccounts.reduce((total, account) => {
    if (account.accountType === AccountType.SAVINGS) {
      return total + (parseFloat(account.currentBalance) || 0);
    }
    return total;
  }, 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, 5);

  const handleNextCard = () => {
    if (activeAccounts.length > 0) {
      setCurrentCard((prevCard) => (prevCard + 1) % activeAccounts.length);
    }
  };

  const handlePrevCard = () => {
    if (activeAccounts.length > 0) {
      setCurrentCard((prevCard) => (prevCard - 1 + activeAccounts.length) % activeAccounts.length);
    }
  };

  const renderAccountCard = () => {
    const account = activeAccounts[currentCard] || initialAccount;

    const formatBalance = (balance) => {
      return formatCurrency(balance);
    };

    return (
      <div className="card-carousel">
        <button className="card-nav left" onClick={handlePrevCard}><i className="fat fa-chevron-left"></i></button>
        <div className="card-display">
          <div className={`premium-card ${account.accountType?.toLowerCase()}`}>
            <div className="card-chip"></div>
            <div className="card-top">
              <span className="card-bank-name">{account.accountName}</span>
              <span className="card-status">{account.status === STATUS.ACTIVE ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <div className="card-middle">
              <span className="balance-label">Current Balance</span>
              <h3 className="balance-value">{formatBalance(account.currentBalance)}</h3>
            </div>
            <div className="card-bottom">
              <div className="card-number">
                {account.accountNumber ? formatAccountNumber(account.accountNumber) : '•••• •••• •••• ••••'}
              </div>
            </div>
          </div>
        </div>
        <button className="card-nav right" onClick={handleNextCard}><i className="fat fa-chevron-right"></i></button>
      </div>
    );
  };

  if (loading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="dashboard-page purple-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>Financial Dashboard</h2>
          <p className="subtitle">Welcome back! Here's your financial overview.</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="accounts-section">
          <div className="section-header">
            <h3><i className="fat fa-credit-card"></i> Your Accounts</h3>
          </div>
          {renderAccountCard()}
        </section>

        <section className="overview-section">
          <div className="section-header">
            <h3><i className="fat fa-chart-pie"></i> Quick Overview</h3>
          </div>
          <div className="summary-grid">
            <div className="stat-card income">
              <div className="stat-icon"><i className="fad fa-arrow-down-to-bracket"></i></div>
              <div className="stat-info">
                <span className="stat-label">Monthly Income</span>
                <span className="stat-value text-emerald">{formatCurrency(totalIncomeMonth)}</span>
              </div>
            </div>
            <div className="stat-card expense">
              <div className="stat-icon"><i className="fad fa-arrow-up-from-bracket"></i></div>
              <div className="stat-info">
                <span className="stat-label">Monthly Expense</span>
                <span className="stat-value text-rose">{formatCurrency(totalExpenseMonth)}</span>
              </div>
            </div>
            <div className="stat-card balance">
              <div className="stat-icon"><i className="fad fa-wallet"></i></div>
              <div className="stat-info">
                <span className="stat-label">Net Balance</span>
                <span className="stat-value text-azure">{formatCurrency(netBalance)}</span>
              </div>
            </div>
            <div className="stat-card savings">
              <div className="stat-icon"><i className="fad fa-vault"></i></div>
              <div className="stat-info">
                <span className="stat-label">Total Savings</span>
                <span className="stat-value text-violet">{formatCurrency(savings)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="budget-section">
          <div className="section-header">
            <h3><i className="fat fa-bullseye-arrow"></i> Budget Status</h3>
          </div>
          <div className="budget-flex">
            <div className="budget-progress-item">
              <CircularProgress percentage={incomeVsBudget} size={120} strokeWidth={10} color="var(--accent-emerald)" />
              <span>Income Target</span>
            </div>
            <div className="budget-progress-item">
              <CircularProgress percentage={expenseVsBudget} size={120} strokeWidth={10} color="var(--accent-rose)" />
              <span>Expense Limit</span>
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="section-header">
            <h3><i className="fat fa-history"></i> Recent Activity</h3>
          </div>
          <div className="recent-list">
            {recentTransactions.length > 0 ? (
              recentTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.transactionId} 
                  transaction={transaction} 
                  accounts={accounts}
                  categories={categories}
                  loans={loans}
                  onDeleteSuccess={fetchData}
                />
              ))
            ) : (
              <div className="empty-state">No recent activity found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
