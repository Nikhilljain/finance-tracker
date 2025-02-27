import React, { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';

const TransactionsPage = () => {
  const { transactions } = useContext(TransactionContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="transactions-container">
      <h1>Your Transactions</h1>
      
      {transactions.length === 0 ? (
        <p>No transactions yet. Upload a bank statement to get started.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className={transaction.type === 'debit' ? 'debit-row' : 'credit-row'}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                <td>{formatAmount(transaction.amount)}</td>
                <td>{transaction.type === 'debit' ? 'Expense' : 'Income'}</td>
                <td>{transaction.category || 'Uncategorized'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsPage;