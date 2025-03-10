import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

const FinanceContext = createContext();

// Categories for transactions
export const CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Personal',
  'Entertainment',
  'Other'
];

export function FinanceProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransactions = localStorage.getItem('transactions');
        const savedBudgets = localStorage.getItem('budgets');
        
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
        
        if (savedBudgets) {
          setBudgets(JSON.parse(savedBudgets));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Transaction Management
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, { ...transaction, id: generateId() }]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Budget Management
  const addBudget = (budget) => {
    setBudgets((prev) => [...prev, { ...budget, id: generateId() }]);
  };

  const updateBudget = (id, updatedBudget) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBudget } : b))
    );
  };

  const deleteBudget = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Analytics
  const getMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(
        (t) =>
          t.type === 'expense' && new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(
        (t) =>
          t.type === 'income' && new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getSpendingByCategory = () => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  };

  const getMonthlySpendingByCategory = (category) => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category === category &&
          new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetByCategory = (category) => {
    return budgets.find((b) => b.category === category);
  };

  const value = {
    loading,
    transactions,
    budgets,
    CATEGORIES,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    getMonthlySpending,
    getMonthlyIncome,
    getSpendingByCategory,
    getMonthlySpendingByCategory,
    getBudgetByCategory,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
} 