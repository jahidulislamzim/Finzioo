import { useMemo } from 'react';
import { LoanType } from '../contexts/AppContext';
import { calculateTotalWithInterest } from '../utils/loanCalculations';

const useLoanSummary = (loans) => {
  return useMemo(() => {
    if (!loans) {
      return {
        totalToBePaid: 0,
        totalToBeReceived: 0,
      };
    }

    let totalToBePaid = 0;
    let totalToBeReceived = 0;


    loans.forEach(loan => {
        if(loan.isActive){
            if (loan.loanType === LoanType.BORROWED) {
              totalToBePaid += calculateTotalWithInterest(loan.amount, loan.interestRate) - loan.paidAmount;
            } else if (loan.loanType === LoanType.LENT) {
                totalToBeReceived += calculateTotalWithInterest(loan.amount, loan.interestRate) - loan.paidAmount;
            }
        }
    });

    return {
      totalToBePaid,
      totalToBeReceived,
    };
  }, [loans]);
};

export default useLoanSummary;