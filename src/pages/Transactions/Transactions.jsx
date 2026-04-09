import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import Pagination from '../../components/Pagination/Pagination';
import { TransactionType } from '../../contexts/AppContext';
import Loader from '../../components/Loader/Loader';
import useAppContext from '../../hooks/useAppContext';
import usePagination from '../../hooks/usePagination';
import toast from '../../components/Toast/Toast';
import { STATUS, Collections } from '../../config/constants';
import './Transactions.scss';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(TransactionType.INCOME);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const [accounts, setAccounts] = useState([]);
  const [loans, setLoans] = useState([]);
  const [categories, setCategories] = useState([]);

  const { getCollection, addTransaction, updateTransaction } = useAppContext();

  const {
    data: transactions,
    loading: transactionsLoading,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage,
    refresh: refreshTransactions
  } = usePagination(Collections.TRANSACTIONS, 15, 'transactionDate');

  const loadDependencies = useCallback(async () => {
    if (!getCollection) return;
    try {
      const [fetchedAccounts, fetchedLoans, fetchedCategories] = await Promise.all([
        getCollection(Collections.ACCOUNTS),
        getCollection(Collections.LOANS),
        getCollection(Collections.CATEGORIES)
      ]);
      setAccounts(fetchedAccounts || []);
      setLoans(fetchedLoans || []);
      setCategories(fetchedCategories || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh auxiliary data.');
    }
  }, [getCollection]);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);


  const { left: leftTransactions, right: rightTransactions } = useMemo(() => {
    const sorted = [...transactions];
    const midpoint = Math.ceil(sorted.length / 2);
    const left = sorted.slice(0, midpoint);
    const right = sorted.slice(midpoint);
    return { left, right };
  }, [transactions]);

  const activeAccounts = useMemo(() => {
    return accounts.filter(account => account.status === STATUS.ACTIVE && account.deletedAt === null);
  }, [accounts]);

  const activeLoans = useMemo(() => {
    return loans.filter(loan => loan.status === STATUS.ACTIVE && loan.deletedAt === null);
  }, [loans]);


  const handleOpenModal = useCallback((type, transaction = null) => {
    if (activeAccounts.length === 0) {
      toast.error('No accounts found. Please add an account first.');
      return;
    }
    if (type === TransactionType.LOAN && activeLoans.length === 0) {
      toast.error('No loans found. Please add a loan first.')
      return;
    }
    if (type === TransactionType.TRANSFER && activeAccounts.length <= 1) {
      toast.error('Please add at least two accounts to make a transfer.');
      return;
    }
    setFormType(type);
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  }, [activeAccounts.length, activeLoans.length]);

  const handleCloseModal = useCallback(() => {
    setTransactionToEdit(null);
    setIsModalOpen(false);
  }, []);

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (transactionToEdit) {
        await updateTransaction({ ...transactionToEdit, ...transactionData });
        toast.success('Transaction updated successfully.');
      } else {
        await addTransaction(transactionData);
        toast.success('Transaction added successfully.')
      }
      refreshTransactions();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      toast.error('Failed to save transaction.');
    }
  };


  if (transactionsLoading && transactions.length === 0) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="transactions-page slate-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>Transactions</h2>
          <p className="subtitle">Track and review every financial movement in detail.</p>
        </div>
        <div className="header-actions">
          <Button btnType="income" onClick={() => handleOpenModal(TransactionType.INCOME)}>
            <i className="fal fa-plus-circle"></i> Income
          </Button>
          <Button btnType="expense" onClick={() => handleOpenModal(TransactionType.EXPENSE)}>
            <i className="fal fa-minus-circle"></i> Expense
          </Button>
          <Button btnType="secondary" onClick={() => handleOpenModal(TransactionType.TRANSFER)}>
            <i className="fal fa-money-transfer"></i> Transfer
          </Button>
          <Button btnType="warning" onClick={() => handleOpenModal(TransactionType.LOAN)}>
            <i className="fal fa-hand-holding-dollar"></i> Loan
          </Button>
        </div>
      </header>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={transactionToEdit ? "Edit Transaction" : "New Transaction"}>
          <TransactionForm
            type={formType}
            onSave={handleSaveTransaction}
            onCancel={handleCloseModal}
            transactionToEdit={transactionToEdit}
          />
        </Modal>
      )}

      <div className="transactions-content">
        <div className="transactions-columns">
          <div className="column">
            <ul className="transaction-list">
              {leftTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.transactionId} 
                  transaction={transaction} 
                  accounts={accounts}
                  categories={categories}
                  loans={loans}
                  onDeleteSuccess={refreshTransactions}
                />
              ))}
            </ul>
          </div>
          <div className="column">
            <ul className="transaction-list">
              {rightTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.transactionId} 
                  transaction={transaction} 
                  accounts={accounts}
                  categories={categories}
                  loans={loans}
                  onDeleteSuccess={refreshTransactions}
                />
              ))}
            </ul>
          </div>
        </div>
        
        {transactions.length === 0 && !transactionsLoading && (
          <div className="empty-state">
            <i className="fal fa-receipt"></i>
            <p>No transactions found for this period.</p>
          </div>
        )}

        <div className="pagination-footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
            onGoToPage={goToPage}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            loading={transactionsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
