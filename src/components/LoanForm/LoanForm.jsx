import React, { useState, useEffect, useCallback } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import useAppContext from '../../hooks/useAppContext';
import './LoanForm.scss';
import { LoanType, STATUS, Collections } from '../../config/constants';

const LoanForm = ({ onSave, loanToEdit, onCancel }) => {
  const { getCollection } = useAppContext();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loan, setLoan] = useState({
    personName: loanToEdit?.personName || '',
    amount: loanToEdit?.amount ?? '',
    loanType: loanToEdit?.loanType || '',
    interestRate: loanToEdit?.interestRate ?? '',
    dueDate: loanToEdit?.dueDate ? new Date(loanToEdit.dueDate).toISOString().split('T')[0] : '',
    notes: loanToEdit?.notes || '',
    accountId: loanToEdit?.accountId || '',
    status: loanToEdit?.status === undefined ? STATUS.ACTIVE : loanToEdit.status,
    paidAmount: loanToEdit?.paidAmount || 0,
  });

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await getCollection(Collections.ACCOUNTS);
      setAccounts(data || []);
    } catch (err) {
      console.error("Error fetching accounts for loan form:", err);
    }
  }, [getCollection]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const isEditMode = loanToEdit && loanToEdit.paidAmount > 0;

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setLoan((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setLoan((prev) => ({ ...prev, status: prev.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (parseFloat(loan.amount) <= 0) {
      setError('Loan amount must be greater than 0.');
      setLoading(false);
      return;
    }

    const account = accounts.find((acc) => acc.accountId === loan.accountId);

    if (loan.loanType === LoanType.LENT && account) {
      if (account.currentBalance < parseFloat(loan.amount)) {
        setError('Insufficient funds to lend out.');
        setLoading(false);
        return;
      }
    }

    const loanData = {
      ...loan,
      amount: parseFloat(loan.amount),
      interestRate: parseFloat(loan.interestRate),
    };

    try {
      if (loanToEdit) {
        await onSave({ ...loanToEdit, ...loanData });
      } else {
        await onSave(loanData);
      }
    } catch (error) {
      console.error("Error saving loan:", error);
      setError('There was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loanTypeOptions = Object.values(LoanType).map((type) => ({
    value: type,
    label: type === LoanType.LENT ? 'Given - Lent' : 'Taken - Borrowed',
  }));

  const accountOptions = (accounts || [])
    .filter((account) => account.status === STATUS.ACTIVE && account.deletedAt === null)
    .map((account) => ({
      value: account.accountId,
      label: account.accountName,
    }));

  return (
    <div className="add-loan-form">
      <form onSubmit={handleSubmit}>
        <Input label="Person Name" name="personName" value={loan.personName} onChange={handleChange} required />
        <Input label="Amount" type="number" name="amount" value={loan.amount} onChange={handleChange} required />
        {!isEditMode && (
          <>
            <Input
              label="Loan Type"
              type="select"
              name="loanType"
              value={loan.loanType}
              onChange={handleChange}
              options={loanTypeOptions}
              placeholder="Select a loan type"
            />
            <Input
              label="Account"
              type="select"
              name="accountId"
              value={loan.accountId}
              onChange={handleChange}
              options={accountOptions}
              placeholder="Select an Account"
              required
            />
          </>
        )}
        <Input
          label="Interest Rate (%)"
          type="number"
          name="interestRate"
          value={loan.interestRate}
          onChange={handleChange}
          required
        />
        <Input label="Due Date" type="date" name="dueDate" value={loan.dueDate} onChange={handleChange} />
        <Input label="Notes" type="textarea" name="notes" value={loan.notes} onChange={handleChange} placeholder="Enter notes" className="full-width" />
        <div className="toggle-switch-group">
          <label>Is Active?</label>
          <Button toggleSwitch={true} isToggled={loan.status === STATUS.ACTIVE ? true : false} onClick={handleToggle} />
        </div>
        {error && (
          <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', gridColumn: '1 / -1' }}>
            {error}
          </p>
        )}
        <div className="form-actions">
          <Button type="button" onClick={onCancel} btnType="cancel">
            Cancel
          </Button>
          <Button type="submit" loading={loading} btnType="primary">{loanToEdit ? 'Update Loan' : 'Create Loan'}</Button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;
