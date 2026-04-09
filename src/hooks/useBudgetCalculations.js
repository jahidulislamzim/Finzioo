import { useMemo } from 'react';
import { getDatePeriod } from '../utils/getDatePeriod';
import { FrequencyType } from '../contexts/AppContext';

const useBudgetCalculations = (budgets, transactions) => {

  return useMemo(() => {
    if (!budgets || !transactions) return [];

    return budgets.map(budget => {
      const { startDate, endDate } = getDatePeriod(budget.budgetFrequency);
      let spent = 0;
      
      // For recurring budgets, filter transactions within the calculated period
      if (startDate && endDate) {
        const periodStartDate = startDate;
        const periodEndDate = endDate;
        const periodTransactions = transactions.filter(t => {
          if (!t.transactionDate || !t.categoryId) return false;
          const transactionDate = t.transactionDate;
          return (
            t.categoryId === budget.categoryId &&
            transactionDate >= periodStartDate &&
            transactionDate <= periodEndDate
          );
        });

        spent = periodTransactions.reduce((acc, t) => acc + t.amount, 0);
      } 

      else if (budget.budgetFrequency === FrequencyType.ONE_TIME) {
        const allTimeTransactions = transactions.filter(t => t.categoryId === budget.categoryId);
        spent = allTimeTransactions.reduce((acc, t) => acc + t.amount, 0);
      }
      
      const remaining = budget.limit - spent;
      const progress = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      

      return {
        ...budget,
        spent,
        remaining,
        progress,
        periodStartDate: startDate,
        periodEndDate: endDate,
      };
    });
  }, [budgets, transactions]);
};

export default useBudgetCalculations;