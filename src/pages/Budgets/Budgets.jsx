import React, { useState, useEffect, useCallback } from 'react';
import useBudgetCalculations from '../../hooks/useBudgetCalculations';
import Button from '../../components/Button/Button';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import Modal from '../../components/Modal/Modal';
import BudgetForm from '../../components/BudgetForm/BudgetForm';
import Loader from '../../components/Loader/Loader';
import useAppContext from '../../hooks/useAppContext';
import { Collections, STATUS } from '../../config/constants';
import './Budgets.scss';

const Budgets = () => {
  const { getCollection, addBudget, updateBudget, deleteBudget, settings } = useAppContext();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const calculatedBudgets = useBudgetCalculations(budgets, transactions);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  const fetchBudgetsData = useCallback(async () => {
    setLoading(true);
    try {
      const [budgetsData, categoriesData, transactionsData] = await Promise.all([
        getCollection(Collections.BUDGETS),
        getCollection(Collections.CATEGORIES),
        getCollection(Collections.TRANSACTIONS)
      ]);
      setBudgets(budgetsData || []);
      setCategories(categoriesData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error("Error fetching budgets data:", error);
    } finally {
      // Small artificial delay for premium feel
      setTimeout(() => setLoading(false), 600);
    }
  }, [getCollection]);

  useEffect(() => {
    fetchBudgetsData();
  }, [fetchBudgetsData]);

  const handleOpenBudgetModal = (budget = null) => {
    setBudgetToEdit(budget);
    setIsBudgetModalOpen(true);
  };

  const handleCloseBudgetModal = () => {
    setIsBudgetModalOpen(false);
    setBudgetToEdit(null);
  };

  const handleSaveBudget = async (formData) => {
    if (budgetToEdit) {
      await updateBudget({ ...budgetToEdit, ...formData });
    } else {
      await addBudget(formData);
    }
    fetchBudgetsData();
    handleCloseBudgetModal();
  };

  const handleDeleteBudget = async (budgetId) => {
    await deleteBudget(budgetId);
    fetchBudgetsData();
  };

  // Filter categories
  const existingBudgetCategoryIds = budgets.map(b => b.categoryId);
  const availableCategories = categories.filter(c => {
    const isCurrentBudgetCategory = budgetToEdit && c.categoryId === budgetToEdit.categoryId;
    const isNotUsed = !existingBudgetCategoryIds.includes(c.categoryId);
    const isActive = c.status === STATUS.ACTIVE && !c.deletedAt;
    
    return (isCurrentBudgetCategory || isNotUsed) && isActive;
  });

  if (loading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="budgets-page emerald-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>Budgets</h2>
          <p className="subtitle">Set financial boundaries and grow your wealth consciously.</p>
        </div>
        <div className="header-actions">
          <Button onClick={() => handleOpenBudgetModal()} btnType="success">
            <i className="fal fa-plus-circle"></i> New Budget
          </Button>
        </div>
      </header>

      <div className="budgets-content">
        <div className="budgets-grid">
          {(calculatedBudgets || []).filter(b => settings.showDeletedAccounts ? true : !b.deletedAt).length > 0 ? (
            calculatedBudgets
              .filter(b => settings.showDeletedAccounts ? true : !b.deletedAt)
              .map((budget) => (
              <BudgetCard 
                key={budget.budgetId} 
                budget={budget} 
                onEdit={handleOpenBudgetModal} 
                onDelete={handleDeleteBudget} 
              />
            ))
          ) : (
            <div className="empty-state">
              <i className="fal fa-bullseye-arrow"></i>
              <p>No budgets set yet. Start by creating one!</p>
            </div>
          )}
        </div>
      </div>

      {isBudgetModalOpen && (
        <Modal onClose={handleCloseBudgetModal} title={budgetToEdit ? "Edit Budget" : "New Budget"}>
          <BudgetForm
            onSave={handleSaveBudget}
            budgetToEdit={budgetToEdit}
            onCancel={handleCloseBudgetModal}
            categories={availableCategories}
          />
        </Modal>
      )}
    </div>
  );
};

export default Budgets;
