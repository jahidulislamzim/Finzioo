import { useCallback } from 'react';
import { generateUniqueId } from '../utils/generateUniqueId';
import { generateAccountNumber } from '../utils/generateAccountNumber';
import useAccounts from './useAccounts';
import useTransactions from './useTransactions';
import { Collections, LoanType, STATUS } from '../config/constants';
import { TransactionType } from '../contexts/AppContext';
import { calculateTotalWithInterest } from '../utils/loanCalculations';

const useLoans = (dependencies) => {
  const {
    data,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getCollection,
  } = dependencies;

  const { updateAccount } = useAccounts(dependencies);
  const { addTransaction } = useTransactions(dependencies);


  const addLoan = useCallback(async (loan) => {
    const now = new Date();
    const nowISO = now.toISOString();

    const newLoan = {
      ...loan,
      loanId: generateUniqueId('loan'),
      loanNumber: generateAccountNumber(now),
      paidAmount: 0,
      paymentFrequency: 'ONE_TIME',
      createdAt: nowISO,
      updatedAt: nowISO,
      deletedAt: null,
    };

    const accounts = await getCollection(Collections.ACCOUNTS);
    const accountToUpdate = accounts.find(
      (acc) => acc.accountId === loan.accountId
    );

    if (!accountToUpdate) return;

    let newBalance = parseFloat(accountToUpdate.currentBalance) || 0;
    const amount = parseFloat(loan.amount) || 0;

    if (loan.loanType === LoanType.LENT) {
      newBalance -= amount;
    }

    if (loan.loanType === LoanType.BORROWED) {
      newBalance += amount;
    }

    const transactionData = {
      amount: amount,
      accountId: loan.accountId,
      fromAccountId: null,
      toAccountId: null,
      notes: loan.notes,
      categoryId: null,
      loanId: newLoan.loanId,
      type: TransactionType.LOAN,
      isOpeningEntry: true,
      transactionDate: nowISO,
    }

    await addDocument(Collections.LOANS, newLoan);
    await updateAccount({ ...accountToUpdate, currentBalance: newBalance });
    await addTransaction(transactionData);
    
    return { success: true, message: "Loan created successfully." };
  }, [addDocument, updateAccount, addTransaction, getCollection]);


  const deleteLoan = useCallback(async (id) => {
    const existingLoan = await getDocument(Collections.LOANS, id);
    if (!existingLoan) return { success: false, message: "Loan not found" };

    if ((parseFloat(existingLoan.paidAmount) || 0) > 0) {
      return { 
        success: false, 
        message: "Cannot delete loan because repayment transactions exist." 
      };
    }

    // Hard delete opening transaction
    const transactions = await getCollection(Collections.TRANSACTIONS);
    const openingTxn = transactions.find(t => t.loanId === existingLoan.loanId && t.isOpeningEntry === true);
    if (openingTxn && openingTxn.id) {
      await deleteDocument(Collections.TRANSACTIONS, openingTxn.id);
    }

    // Revert account balance
    const accounts = await getCollection(Collections.ACCOUNTS);
    const account = accounts.find(acc => acc.accountId === existingLoan.accountId);
    if (account) {
      let newBalance = parseFloat(account.currentBalance) || 0;
      const amount = parseFloat(existingLoan.amount) || 0;
      if (existingLoan.loanType === LoanType.LENT) {
        newBalance += amount;
      } else if (existingLoan.loanType === LoanType.BORROWED) {
        newBalance -= amount;
      }
      await updateAccount({ id: account.id, currentBalance: newBalance });
    }

    // Hard delete the loan Document
    await deleteDocument(Collections.LOANS, id);

    return { success: true, message: "Loan and initial transaction deleted successfully." };
  }, [updateAccount, deleteDocument, getDocument, getCollection]);



  const updateLoan = useCallback(async (updatedLoan) => {
    const existingLoan = await getDocument(Collections.LOANS, updatedLoan.id);
    if (!existingLoan) return;

    const loanId = updatedLoan.id;
    const nowISO = new Date().toISOString();

    const hasPayments = parseFloat(existingLoan.paidAmount || 0) > 0;

    // Detect if financial fields changed
    const isFinancialChange =
      existingLoan.amount !== updatedLoan.amount ||
      existingLoan.loanType !== updatedLoan.loanType ||
      existingLoan.accountId !== updatedLoan.accountId;

    // Prepare loan data
    const { id: _, ...loanData } = updatedLoan;
    loanData.updatedAt = nowISO;

    if (isFinancialChange) {
      const isAccountChanged = existingLoan.accountId !== updatedLoan.accountId;

      if (isAccountChanged && hasPayments) {
        throw new Error("Account cannot be changed after loan payments start.");
      }

      if(existingLoan.amount > updatedLoan.amount && hasPayments) {
        throw new Error("Loan amount cannot be reduced.");
      }

      const accounts = await getCollection(Collections.ACCOUNTS);
      const oldAccount = accounts.find(
        acc => acc.accountId === existingLoan.accountId
      );
      const newAccount = accounts.find(
        acc => acc.accountId === updatedLoan.accountId
      );

      if (!oldAccount || !newAccount) {
        throw new Error("One or both accounts not found.");
      }

      const oldAmount = parseFloat(existingLoan.amount) || 0;
      const newAmount = parseFloat(updatedLoan.amount) || 0;

      let oldAccountNewBalance = parseFloat(oldAccount.currentBalance) || 0;

      if (existingLoan.loanType === LoanType.LENT) {
        oldAccountNewBalance += oldAmount;
      } else if (existingLoan.loanType === LoanType.BORROWED) {
        oldAccountNewBalance -= oldAmount;
      }

      let newAccountNewBalance =
        oldAccount.accountId === newAccount.accountId
          ? oldAccountNewBalance
          : parseFloat(newAccount.currentBalance) || 0;

      if (updatedLoan.loanType === LoanType.LENT) {
        newAccountNewBalance -= newAmount;
      } else if (updatedLoan.loanType === LoanType.BORROWED) {
        newAccountNewBalance += newAmount;
      }

      
      if (oldAccount.accountId === newAccount.accountId) {
        await updateAccount({
          id: oldAccount.id,
          currentBalance: newAccountNewBalance,
        });
      } else {
        await updateAccount({
          id: oldAccount.id,
          currentBalance: oldAccountNewBalance,
        });

        await updateAccount({
          id: newAccount.id,
          currentBalance: newAccountNewBalance,
        });
      }
    }

    await updateDocument(Collections.LOANS, loanId, loanData);
    return { success: true, message: "Loan updated successfully."};
  }, [updateDocument, updateAccount, getDocument, getCollection]);







  return {
    addLoan,
    deleteLoan,
    updateLoan
  };
};

export default useLoans;
