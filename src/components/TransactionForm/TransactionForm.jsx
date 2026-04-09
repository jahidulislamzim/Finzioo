import React, { useState, useEffect } from 'react';
import { LoanType, TransactionType } from '../../contexts/AppContext';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './TransactionForm.scss';
import { calculateTotalWithInterest } from '../../utils/loanCalculations';
import useAppContext from '../../hooks/useAppContext';
import { STATUS, Collections } from '../../config/constants';

const TransactionForm = ({ type, onSave, onCancel, transactionToEdit }) => {
  const { getCollection, formatCurrency } = useAppContext();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!getCollection) return;
      try {
        // Fetch all dependencies concurrently
        const [fetchedAccounts, fetchedCategories, fetchedLoans] = await Promise.all([
          getCollection(Collections.ACCOUNTS),
          getCollection(Collections.CATEGORIES),
          getCollection(Collections.LOANS)
        ]);
        setAccounts(fetchedAccounts || []);
        setCategories(fetchedCategories || []);
        setLoans(fetchedLoans || []);
      } catch (err) {
        console.error("Failed to fetch dependencies for transaction form", err);
      }
    };
    fetchDependencies();
  }, [getCollection]);

  const [formData, setFormData] = useState({
    amount: '',
    accountId: '',
    fromAccountId: '',
    toAccountId: '',
    notes: '',
    categoryId: '',
    loanId: '',
    transactionDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        amount: transactionToEdit.amount || '',
        accountId: transactionToEdit.accountId || '',
        fromAccountId: transactionToEdit.fromAccountId || '',
        toAccountId: transactionToEdit.toAccountId || '',
        notes: transactionToEdit.notes || '',
        categoryId: transactionToEdit.categoryId || '',
        loanId: transactionToEdit.loanId || '',
        transactionDate: transactionToEdit.transactionDate ? new Date(transactionToEdit.transactionDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        amount: '',
        accountId: '',
        fromAccountId: '',
        toAccountId: '',
        notes: '',
        categoryId: '',
        loanId: '',
        transactionDate: '',
      });
    }
  }, [transactionToEdit, type]);

  const accountOptions = (accounts || [])
    .filter(account => account.status === STATUS.ACTIVE && account.deletedAt === null)
    .map(account => ({
      value: account.accountId,
      label: account.accountName,
    }));

  const getLoanOptions = (loans) =>
    loans
      .filter(loan =>
        loan.status === STATUS.ACTIVE &&
        loan.deletedAt === null &&
        parseFloat(loan.paidAmount || 0) < parseFloat(calculateTotalWithInterest(loan.amount, loan.interestRate)) - 0.01
      )
      .map(loan => ({
        value: loan.loanId,
        label: `${loan.personName} (${loan.loanType.toUpperCase()})`
      }));

  const loanOptions = getLoanOptions(loans);




  const categoryOptions = (categories || [])
    .filter(category => category.type === type && category.status === STATUS.ACTIVE && category.deletedAt === null)
    .map(category => ({
      value: category.categoryId,
      label: category.name,
    }));

  const toAccountOptions = accountOptions.filter(
    (option) => option.value !== formData.fromAccountId
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    getLoanOptions(loans);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFromAccountChange = (e) => {
    const newFromAccountId = e.target.value;
    setFormData(prev => ({
      ...prev,
      fromAccountId: newFromAccountId,
      toAccountId: newFromAccountId === prev.toAccountId ? '' : prev.toAccountId
    }));
  };



  const handleSubmit = async (e) => {
    isLoading(true);
    e.preventDefault();
    setError('');

    if (!formData.transactionDate) {
      setError('Please select a date.');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (type === TransactionType.TRANSFER) {
      if (!formData.fromAccountId || !formData.toAccountId) {
        setError('Please select both a "From" and "To" account.');
        return;
      }
      if (formData.fromAccountId === formData.toAccountId) {
        setError('From and To accounts cannot be the same.');
        return;
      }
      const fromAccount = accounts.find(acc => acc.accountId === formData.fromAccountId);
      if (fromAccount && fromAccount.currentBalance < parseFloat(formData.amount)) {
        setError('Insufficient funds for the transfer.');
        return;
      }
    } else if (type === TransactionType.LOAN) {
      if (!formData.loanId) {
        setError('Please select a loan to make a payment to.');
        return;
      }
      if (!formData.accountId) {
        setError('Please select an account to make the payment from.');
        return;
      }

      const loan = loans.find(l => l.loanId === formData.loanId);

      if (loan) {
        const totalWithInterest = calculateTotalWithInterest(loan.amount, loan.interestRate);
        const outstandingBalance = totalWithInterest - (loan.paidAmount || 0);

        if (parseFloat(formData.amount) > outstandingBalance) {
          setError(`Max payment: ${formatCurrency(outstandingBalance)}`);
          return;
        }

        if (loan.loanType === LoanType.BORROWED) {
          const account = accounts.find(acc => acc.accountId === formData.accountId);
          if (account && account.currentBalance < parseFloat(formData.amount)) {
            setError('Insufficient funds for this payment.');
            return;
          }
        }
      }
    } else { // For INCOME and EXPENSE
      if (!formData.accountId) {
        setError('Please select an account.');
        return;
      }
      if (type === TransactionType.EXPENSE) {
        const account = accounts.find(acc => acc.accountId === formData.accountId);
        if (account && account.currentBalance < parseFloat(formData.amount)) {
          setError('Insufficient funds for this expense.');
          return;
        }
      }
      if (!formData.categoryId) {
        setError('Please select a category.');
        return;
      }
    }

    const transactionDate = new Date(formData.transactionDate);
    if (!transactionToEdit) {
      const now = new Date();
      transactionDate.setHours(now.getHours());
      transactionDate.setMinutes(now.getMinutes());
      transactionDate.setSeconds(now.getSeconds());
      transactionDate.setMilliseconds(now.getMilliseconds());
    }

    try {
      let transactionData = {
        ...formData,
        type,
        amount: parseFloat(formData.amount),
        transactionDate: transactionDate.toISOString(),
      };

      await onSave(transactionData, transactionToEdit?.id);
    } finally {
      isLoading(false);
    }
  };

  const renderTitle = () => {
    const action = transactionToEdit ? 'Edit' : 'Add';
    if (type === TransactionType.INCOME) return `${action} Income`;
    if (type === TransactionType.EXPENSE) return `${action} Expense`;
    if (type === TransactionType.TRANSFER) return `${action} Transfer`;
    if (type === TransactionType.LOAN) return `Loan Payment`;
    return `${action} Transaction`;
  };

  return (
    <div className="add-transaction-form">
      <form onSubmit={handleSubmit}>

        <Input
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="full-width"
          required
        />

        {type === TransactionType.LOAN && (
          <>
            <Input
              label="Loan"
              type="select"
              name="loanId"
              value={formData.loanId}
              onChange={handleChange}
              options={loanOptions}
              placeholder="Select a Loan"
              required
            />
            <Input
              label="Account"
              type="select"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              options={accountOptions}
              placeholder="Select an Account"
              required
            />
          </>
        )}

        {type === TransactionType.TRANSFER && (
          <>
            <Input
              label="From Account"
              type="select"
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleFromAccountChange}
              options={accountOptions}
              placeholder="Select From Account"
              required
            />
            <Input
              label="To Account"
              type="select"
              name="toAccountId"
              value={formData.toAccountId}
              onChange={handleChange}
              options={toAccountOptions}
              placeholder="Select To Account"
              required
            />
          </>
        )}

        {(type === TransactionType.INCOME || type === TransactionType.EXPENSE) && (
          <>
            <Input
              label="Account"
              type="select"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              options={accountOptions}
              placeholder="Select an Account"
              required
            />
            <Input
              label="Category"
              type="select"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={categoryOptions}
              placeholder="Select a Category"
              required
            />
          </>
        )}

        <Input
          label="Date"
          type="date"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={handleChange}
          placeholder="Select a Date"
          required
        />
        <Input
          label="Notes"
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter notes"
          className="full-width"
        />

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <Button type="submit" btnType="success" loading={loading}>
            Save Transaction
          </Button>
          <Button type="button" onClick={onCancel} btnType="cancel">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
