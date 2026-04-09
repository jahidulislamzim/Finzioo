import { useCallback } from 'react';
import { generateUniqueId } from '../utils/generateUniqueId';
import { LoanType } from '../contexts/AppContext';
import { Collections, STATUS, TransactionType } from '../config/constants';

const useTransactions = (dependencies) => {
  const { getDocument, findDocumentByField, addDocument, updateDocument, deleteDocument } = dependencies;

  const getAccountByManualId = useCallback(async (accountId) => {
    if (!accountId) return null;
    return await findDocumentByField(Collections.ACCOUNTS, 'accountId', accountId);
  }, [findDocumentByField]);

  const getLoanByManualId = useCallback(async (loanId) => {
    if (!loanId) return null;
    return await findDocumentByField(Collections.LOANS, 'loanId', loanId);
  }, [findDocumentByField]);

  const addTransaction = useCallback(async (transaction) => {
    const now = new Date();

    let newTransaction = {
      transactionId: generateUniqueId('txn'),
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      notes: transaction.notes || '',
      categoryId: transaction.categoryId || null,
      accountId: transaction.accountId || null,
      fromAccountId: transaction.fromAccountId || null,
      toAccountId: transaction.toAccountId || null,
      loanId: transaction.loanId || null,
      isOpeningEntry: transaction.isOpeningEntry || false,
      transactionDate: transaction.transactionDate || now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: null
    };

    if (newTransaction.type === TransactionType.TRANSFER) {
      newTransaction.accountId = null;
    } else {
      newTransaction.fromAccountId = null;
      newTransaction.toAccountId = null;
    }

    if (newTransaction.type === TransactionType.LOAN || newTransaction.type === TransactionType.TRANSFER) {
      newTransaction.categoryId = null;
    }

    if (newTransaction.type !== TransactionType.LOAN) {
      newTransaction.loanId = null;
    }

    switch (newTransaction.type) {
      case TransactionType.INCOME: {
        const account = await getAccountByManualId(newTransaction.accountId);
        if (account) {
          const newBalance = (parseFloat(account.currentBalance) || 0) + newTransaction.amount;
          await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
        }
        break;
      }
      case TransactionType.EXPENSE: {
        const account = await getAccountByManualId(newTransaction.accountId);
        if (account) {
          const newBalance = (parseFloat(account.currentBalance) || 0) - newTransaction.amount;
          await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
        }
        break;
      }
      case TransactionType.TRANSFER: {
        const fromAccount = await getAccountByManualId(newTransaction.fromAccountId);
        if (fromAccount) {
          const newBalance = (parseFloat(fromAccount.currentBalance) || 0) - newTransaction.amount;
          await updateDocument(Collections.ACCOUNTS, fromAccount.id, { currentBalance: newBalance });
        }
        const toAccount = await getAccountByManualId(newTransaction.toAccountId);
        if (toAccount) {
          const newBalance = (parseFloat(toAccount.currentBalance) || 0) + newTransaction.amount;
          await updateDocument(Collections.ACCOUNTS, toAccount.id, { currentBalance: newBalance });
        }
        break;
      }
      case TransactionType.LOAN: {
        const loanToUpdate = await getLoanByManualId(newTransaction.loanId);
        if (loanToUpdate && newTransaction.isOpeningEntry === false) {
          const newPaidAmount = (parseFloat(loanToUpdate.paidAmount) || 0) + newTransaction.amount;
          const updatedLoanData = { paidAmount: newPaidAmount };
          
          if (newPaidAmount >= (parseFloat(loanToUpdate.amount) || 0)) {
            updatedLoanData.status = STATUS.CLOSED;
          }
          await updateDocument(Collections.LOANS, loanToUpdate.id, updatedLoanData);

          const account = await getAccountByManualId(newTransaction.accountId);
          if (account) {
            let newBalance;
            if (loanToUpdate.loanType === LoanType.LENT) {
              newBalance = (parseFloat(account.currentBalance) || 0) + newTransaction.amount;
            } else {
              newBalance = (parseFloat(account.currentBalance) || 0) - newTransaction.amount;
            }
            await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
          }
        }
        break;
      }
      default:
        break;
    }

    await addDocument(Collections.TRANSACTIONS, newTransaction);
  }, [getAccountByManualId, getLoanByManualId, addDocument, updateDocument]);

  const updateTransaction = useCallback(async (updatedTransaction) => {
    const transactionId = updatedTransaction.id;
    const now = new Date();
    const transactionData = { ...updatedTransaction, updatedAt: now.toISOString() };
    await updateDocument(Collections.TRANSACTIONS, transactionId, transactionData);
  }, [updateDocument]);

  const deleteTransaction = useCallback(async (transactionId) => {
    const transactionToDelete = await getDocument(Collections.TRANSACTIONS, transactionId);
    if (!transactionToDelete) return;

    switch (transactionToDelete.type) {
      case TransactionType.INCOME: {
        const account = await getAccountByManualId(transactionToDelete.accountId);
        if (account) {
          const newBalance = (parseFloat(account.currentBalance) || 0) - transactionToDelete.amount;
          await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
        }
        break;
      }
      case TransactionType.EXPENSE: {
        const account = await getAccountByManualId(transactionToDelete.accountId);
        if (account) {
          const newBalance = (parseFloat(account.currentBalance) || 0) + transactionToDelete.amount;
          await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
        }
        break;
      }
      case TransactionType.TRANSFER: {
        const fromAccount = await getAccountByManualId(transactionToDelete.fromAccountId);
        if (fromAccount) {
          const newBalance = (parseFloat(fromAccount.currentBalance) || 0) + transactionToDelete.amount;
          await updateDocument(Collections.ACCOUNTS, fromAccount.id, { currentBalance: newBalance });
        }
        const toAccount = await getAccountByManualId(transactionToDelete.toAccountId);
        if (toAccount) {
          const newBalance = (parseFloat(toAccount.currentBalance) || 0) - transactionToDelete.amount;
          await updateDocument(Collections.ACCOUNTS, toAccount.id, { currentBalance: newBalance });
        }
        break;
      }
      case TransactionType.LOAN: {
        const loanToUpdate = await getLoanByManualId(transactionToDelete.loanId);
        if (loanToUpdate) {
          if (transactionToDelete.isOpeningEntry) {
            if ((parseFloat(loanToUpdate.paidAmount) || 0) > 0) {
              throw new Error("Cannot delete initial loan transaction. Repayment transactions exist.");
            }

            const account = await getAccountByManualId(transactionToDelete.accountId);
            if (account) {
              let newBalance = parseFloat(account.currentBalance) || 0;
              if (loanToUpdate.loanType === LoanType.LENT) {
                newBalance += transactionToDelete.amount;
              } else {
                newBalance -= transactionToDelete.amount;
              }
              await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
            }

            await deleteDocument(Collections.LOANS, loanToUpdate.id);
          } else {
            const newPaidAmount = (parseFloat(loanToUpdate.paidAmount) || 0) - transactionToDelete.amount;
            const updatedLoanData = { paidAmount: newPaidAmount };
            if (newPaidAmount < (parseFloat(loanToUpdate.amount) || 0)) {
              updatedLoanData.status = STATUS.ACTIVE;
            }
            await updateDocument(Collections.LOANS, loanToUpdate.id, updatedLoanData);

            const account = await getAccountByManualId(transactionToDelete.accountId);
            if (account) {
              let newBalance;
              if (loanToUpdate.loanType === LoanType.LENT) {
                newBalance = (parseFloat(account.currentBalance) || 0) - transactionToDelete.amount;
              } else {
                newBalance = (parseFloat(account.currentBalance) || 0) + transactionToDelete.amount;
              }
              await updateDocument(Collections.ACCOUNTS, account.id, { currentBalance: newBalance });
            }
          }
        }
        break;
      }
      default:
        break;
    }

    await deleteDocument(Collections.TRANSACTIONS, transactionId);
  }, [getAccountByManualId, getLoanByManualId, getDocument, updateDocument, deleteDocument]);

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};

export default useTransactions;