import { useCallback, useMemo } from 'react';
import { generateUniqueId } from '../utils/generateUniqueId';
import { Collections } from '../config/constants';

const useBudgets = (dependencies) => {
  const { addDocument, updateDocument, deleteDocument } = dependencies;

  const addBudget = useCallback(async (budget) => {
    try {
      const newBudget = {
        ...budget,
        budgetId: generateUniqueId('bud'),
        limit: parseFloat(budget.limit),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addDocument(Collections.BUDGETS, newBudget);
      return { success: true, message: "Budget added successfully." };
    } catch (error) {
      console.error("Error adding budget:", error);
      return { success: false, message: "Failed to add budget." };
    }
  }, [addDocument]);

  const updateBudget = useCallback(async (updatedBudget) => {
    try {
      const budgetId = updatedBudget.id;
      const now = new Date().toISOString();
      const updateBudgetData = {
        ...updatedBudget,
        updatedAt: now,
      };
      await updateDocument(Collections.BUDGETS, budgetId, updateBudgetData);
      return { success: true, message: "Budget updated successfully." };
    } catch (error) {
      console.error("Error updating budget:", error);
      return { success: false, message: "Failed to update budget." };
    }
  }, [updateDocument]);

  const deleteBudget = useCallback(async (budgetId) => {
    try {
      await deleteDocument(Collections.BUDGETS, budgetId);
      return { success: true, message: "Budget deleted successfully." };
    } catch (error) {
      console.error("Error deleting budget:", error);
      return { success: false, message: "Failed to delete budget." };
    }
  }, [deleteDocument]);

  return {
    addBudget,
    updateBudget,
    deleteBudget,
  };
};

export default useBudgets;