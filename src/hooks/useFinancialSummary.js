import { useMemo } from 'react';
import { TransactionType, FrequencyType } from '../contexts/AppContext';
import { getDatePeriod } from '../utils/getDatePeriod';

const useFinancialSummary = (transactions) => {

  return useMemo(() => {
    if (!transactions) {
      return {
        totalIncomeMonth: 0,
        totalIncomeYear: 0,
        totalExpenseMonth: 0,
        totalExpenseYear: 0,
      };
    }

    const { startDate: yearStartDate, endDate: yearEndDate } = getDatePeriod(FrequencyType.YEARLY);
    const { startDate: monthStartDate, endDate: monthEndDate } = getDatePeriod(FrequencyType.MONTHLY);



    const filterTransactions = (startDate, endDate, transactionType) => {
        return transactions.filter(t => {
            if (!t.transactionDate || t.type !== transactionType) return false;
            const transactionDate = t.transactionDate;
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    };

    const yearIncomeTransactions = filterTransactions(yearStartDate, yearEndDate, TransactionType.INCOME);
    const monthIncomeTransactions = filterTransactions(monthStartDate, monthEndDate, TransactionType.INCOME);
    const yearExpenseTransactions = filterTransactions(yearStartDate, yearEndDate, TransactionType.EXPENSE);
    const monthExpenseTransactions = filterTransactions(monthStartDate, monthEndDate, TransactionType.EXPENSE);

  


    const totalIncomeYear = yearIncomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalIncomeMonth = monthIncomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenseYear = yearExpenseTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenseMonth = monthExpenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncomeMonth,
      totalIncomeYear,
      totalExpenseMonth,
      totalExpenseYear,
    };
  }, [transactions]);
};

export default useFinancialSummary;