import { useMemo } from 'react';
import { AccountType } from '../contexts/AppContext';

const useSavingsAndInvestments = (accounts, transactions) => {
  return useMemo(() => {
    if (!accounts || !transactions) {
      return {
        savingsGoalProgress: 0,
        investmentPortfolioGrowth: 0,
      };
    }

    let totalSavingsGoal = 0;
    let totalSavingsBalance = 0;
    let totalInvestmentInitial = 0;
    let totalInvestmentCurrent = 0;

    accounts.forEach(account => {
      if (account.accountType === AccountType.SAVINGS) {
        totalSavingsGoal += account.goal || 0;
        totalSavingsBalance += account.currentBalance || 0;
      }
      if (account.accountType === AccountType.INVESTMENT) {
        totalInvestmentInitial += account.initialBalance || 0;
        totalInvestmentCurrent += account.currentBalance || 0;
      }
    });

    const savingsGoalProgress = totalSavingsGoal > 0 ? (totalSavingsBalance / totalSavingsGoal) * 100 : 0;
    const investmentPortfolioGrowth = totalInvestmentInitial > 0 ? ((totalInvestmentCurrent - totalInvestmentInitial) / totalInvestmentInitial) * 100 : 0;

    return {
      savingsGoalProgress,
      investmentPortfolioGrowth,
    };
  }, [accounts, transactions]);
};

export default useSavingsAndInvestments;