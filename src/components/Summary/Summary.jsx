import React from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudgets } from '../../hooks/useBudgets';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import useAppContext from '../../hooks/useAppContext';
import './Summary.scss';

const Summary = () => {
  const { formatCurrency } = useAppContext();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();

  const totalBalance = accounts.reduce((total, acc) => total + acc.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);
  const totalBudgeted = budgets.reduce((total, b) => total + b.limit, 0);
  const totalSpent = budgets.reduce((total, b) => total + b.spent, 0);

  return (
    <div className="summary-grid">
      <SummaryCard 
        title="Total Balance" 
        value={formatCurrency(totalBalance)} 
        icon="fa-wallet"
      />
      <SummaryCard 
        title="Total Income" 
        value={formatCurrency(totalIncome)} 
        icon="fa-arrow-up"
      />
      <SummaryCard 
        title="Total Expenses" 
        value={formatCurrency(totalExpenses)} 
        icon="fa-arrow-down"
      />
      <SummaryCard 
        title="Budget vs. Spent" 
        value={`${formatCurrency(totalSpent)} / ${formatCurrency(totalBudgeted)}`} 
        icon="fa-chart-pie"
      />
    </div>
  );
};

export default Summary;
