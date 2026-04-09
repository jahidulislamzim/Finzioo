import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './BudgetForm.scss';
import { FrequencyType } from '../../contexts/AppContext';

const BudgetForm = ({ onSave, budgetToEdit, onCancel, categories }) => {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [budgetFrequency, setBudgetFrequency] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setCategoryId(budgetToEdit.categoryId || '');
      setAmount(budgetToEdit.limit || '');
      setNotes(budgetToEdit.notes || '');
      setBudgetFrequency(budgetToEdit.budgetFrequency || '');
    } else {
      setCategoryId('');
      setAmount('');
      setNotes('');
      setBudgetFrequency('');
    }
  }, [budgetToEdit]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        categoryId: categoryId,
        limit: parseFloat(amount),
        notes: notes,
        budgetFrequency: budgetFrequency,
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({ value: cat.categoryId, label:cat.name}));
  const frequencyOptions = Object.entries(FrequencyType).map(([key, value]) => ({
    value: value,
    label: `${key.replace('_', ' ')}`,
  }));

  return (
    <div className="add-budget-form">
      <form onSubmit={handleSubmit}>
        <Input
          label="Category"
          type="select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categoryOptions}
          placeholder="Select a category"
        />
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter budget amount"
        />
        <Input
          label="Frequency"
          type="select"
          value={budgetFrequency}
          onChange={(e) => setBudgetFrequency(e.target.value)}
          options={frequencyOptions}
          placeholder="Select frequency"
        />
        <Input
          label="Notes"
          type="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter notes"
          className="full-width"
        />
        <div className="form-actions">
          <Button type="submit" btnType="primary" loading={loading}>
            {budgetToEdit ? 'Save' : 'Add Budget'}
          </Button>
          <Button type="button" onClick={onCancel} btnType="cancel">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
