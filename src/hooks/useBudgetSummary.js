import { useMemo } from 'react';
import { getDatePeriod } from '../utils/getDatePeriod';

const useBudgetSummary = (budgets, transactions) => {
  return useMemo(() => {
    if (!budgets || !transactions) {
      return {
        incomeVsBudget: 0,
        expenseVsBudget: 0,
      };
    }

    let totalIncomeBudget = 0;
    let totalExpenseBudget = 0;
    let totalIncomeSpent = 0;
    let totalExpenseSpent = 0;

    budgets.forEach(budget => {
      const { startDate, endDate } = getDatePeriod(budget.budgetFrequency);

      if (budget.isIncome) {
        totalIncomeBudget += budget.limit;
        if (startDate && endDate) {
          const periodTransactions = transactions.filter(t => {
            if (!t.transactionDate || !t.categoryId) return false;
            const transactionDate = t.transactionDate;
            return (
              t.categoryId === budget.categoryId &&
              transactionDate >= startDate &&
              transactionDate <= endDate
            );
          });
          totalIncomeSpent += periodTransactions.reduce((acc, t) => acc + t.amount, 0);
        }
      } else {
        totalExpenseBudget += budget.limit;
        if (startDate && endDate) {
          const periodTransactions = transactions.filter(t => {
            if (!t.transactionDate || !t.categoryId) return false;
            const transactionDate = t.transactionDate;
            return (
              t.categoryId === budget.categoryId &&
              transactionDate >= startDate &&
              transactionDate <= endDate
            );
          });
          totalExpenseSpent += periodTransactions.reduce((acc, t) => acc + t.amount, 0);
        }
      }
    });

    const incomeVsBudget = totalIncomeBudget > 0 ? (totalIncomeSpent / totalIncomeBudget) * 100 : 0;
    const expenseVsBudget = totalExpenseBudget > 0 ? (totalExpenseSpent / totalExpenseBudget) * 100 : 0;

    return {
      incomeVsBudget,
      expenseVsBudget,
    };
  }, [budgets, transactions]);
};

export default useBudgetSummary;