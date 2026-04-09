import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import useFirestore from '../hooks/useFirestore';
import { Collections } from '../config/constants';
import useAccounts from '../hooks/useAccounts';
import useBudgets from '../hooks/useBudgets';
import useCategories from '../hooks/useCategories';
import useLoans from '../hooks/useLoans';
import useTransactions from '../hooks/useTransactions';

export const AppContext = createContext();

export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
  LOAN: "loan"
};

export const LoanType = {
  BORROWED: "borrowed",
  LENT: "lent"
};



export const FrequencyType = {
  ONE_TIME: "one-time",
  DAILY: "daily",
  WEEKLY: "weekly",
  BI_WEEKLY: "bi-weekly",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  HALF_YEARLY: "half-yearly",
  YEARLY: "yearly",
};



const AppProvider = ({ children }) => {
  const { data, error, refetchData, addLocalDocument, updateLocalDocument, deleteLocalDocument } = useFinanceData();
  const {
    getCollection,
    getPaginatedCollection,
    getCollectionCount,
    getDocument,
    findDocumentByField,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useFirestore();

  const [settings, setSettings] = useState({
    currency: '$',
    userName: 'Jahid',
    userEmail: 'jahid@example.com',
    theme: 'dark',
    showDeletedAccounts: false,
  });

  const loadSettings = useCallback(async () => {
    if (!getCollection) return;
    try {
      const settingsData = await getCollection(Collections.SETTINGS);
      if (settingsData && settingsData.length > 0) {
        setSettings(prev => ({ ...prev, ...settingsData[0] }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }, [getCollection]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (newSettings) => {
    try {
      const mergedSettings = { ...settings, ...newSettings };
      setSettings(mergedSettings);

      // Persist to Firestore
      const settingsList = await getCollection(Collections.SETTINGS);
      if (settingsList && settingsList.length > 0) {
        await updateDocument(Collections.SETTINGS, settingsList[0].id, newSettings);
      } else {
        await addDocument(Collections.SETTINGS, newSettings);
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
      throw err;
    }
  };

  const formatCurrency = (amount) => {
    const value = parseFloat(amount) || 0;
    const absValue = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return value < 0 ? `-${settings.currency}${absValue}` : `${settings.currency}${absValue}`;
  };


  const hookDependencies = {
    data,
    getCollection,
    getPaginatedCollection,
    getCollectionCount,
    getDocument,
    findDocumentByField,
    addDocument,
    updateDocument,
    deleteDocument,
    addLocalDocument,
    updateLocalDocument,
    deleteLocalDocument,
  };



  const accounts = useAccounts(hookDependencies);
  const budgets = useBudgets(hookDependencies);
  const categories = useCategories(hookDependencies);
  const loans = useLoans(hookDependencies);
  const transactions = useTransactions(hookDependencies);

  const contextValue = useMemo(() => ({
    error,
    refetchData,
    getCollection,
    getPaginatedCollection,
    getCollectionCount,
    getDocument,
    ...accounts,
    ...budgets,
    ...categories,
    ...loans,
    ...transactions,
    settings,
    updateSettings,
    formatCurrency
  }), [error, refetchData, getCollection, getPaginatedCollection, getCollectionCount, getDocument, data, accounts, budgets, categories, loans, transactions, settings]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;