// Format currency based on user's locale and currency preference
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date to a readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Get month name
export const getMonthName = (month) => {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString('en-IN', { month: 'long' });
};

// Parse bank statement
export const parseCSV = (content) => {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  const transactions = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    const transaction = {};
    
    headers.forEach((header, index) => {
      transaction[header.trim()] = values[index]?.trim();
    });
    
    transactions.push(transaction);
  }
  
  return transactions;
};

// Get current month's date range
export const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0],
  };
};

// Group transactions by date
export const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

// Calculate total balance
export const calculateBalance = (transactions) => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'income') {
      return balance + transaction.amount;
    } else {
      return balance - transaction.amount;
    }
  }, 0);
};

// Format large numbers
export const formatNumber = (number) => {
  if (number >= 10000000) { // 1 Crore
    return (number / 10000000).toFixed(2) + ' Cr';
  } else if (number >= 100000) { // 1 Lakh
    return (number / 100000).toFixed(2) + ' L';
  } else if (number >= 1000) { // 1 Thousand
    return (number / 1000).toFixed(2) + ' K';
  }
  return number.toString();
};

// Get a color for a category (for charts and UI elements)
export const getCategoryColor = (category) => {
  const colors = {
    Housing: '#2196f3',
    Transportation: '#f44336',
    Food: '#4caf50',
    Utilities: '#ff9800',
    Insurance: '#9c27b0',
    Healthcare: '#e91e63',
    Savings: '#3f51b5',
    Personal: '#009688',
    Entertainment: '#ff5722',
    Other: '#607d8b',
  };
  return colors[category] || colors.Other;
}; 