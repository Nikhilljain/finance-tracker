import React, { createContext, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  
  const importTransactions = (newTransactions, bankType) => {
    // Add source bank and ID to each transaction
    const processedTransactions = newTransactions.map((transaction, index) => ({
      ...transaction,
      id: `${bankType}-${Date.now()}-${index}`,
      bank: bankType
    }));
    
    // Add to existing transactions and sort by date
    const updatedTransactions = [...transactions, ...processedTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setTransactions(updatedTransactions);
    
    return Promise.resolve();
  };
  
  const updateTransactionCategory = (transactionId, category) => {
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === transactionId) {
        return { ...transaction, category };
      }
      return transaction;
    });
    
    setTransactions(updatedTransactions);
  };
  
  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        importTransactions, 
        updateTransactionCategory 
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};