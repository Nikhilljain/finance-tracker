import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// Simple authentication state
function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  
  const login = (email, password) => {
    // In a real app, you would validate credentials with a server
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    return true;
  };
  
  const signup = (name, email, password) => {
    // In a real app, you would send registration to a server
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    return true;
  };
  
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };
  
  return { isLoggedIn, login, signup, logout };
}

// Budget management state
function useBudgets() {
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : {};
  });
  
  const setBudget = (category, amount) => {
    const updatedBudgets = { ...budgets, [category]: parseFloat(amount) };
    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
  };
  
  const removeBudget = (category) => {
    const updatedBudgets = { ...budgets };
    delete updatedBudgets[category];
    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
  };
  
  return { budgets, setBudget, removeBudget };
}

// Home page component
function Home() {
  const auth = useAuth();
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h2>Take Control of Your Finances</h2>
          <p className="hero-subtitle">
            Track expenses, manage budgets, and gain insights into your spending habits with our personal finance tracker.
          </p>
          {!auth.isLoggedIn ? (
            <div className="hero-actions">
              <Link to="/signup" className="btn-primary">Get Started</Link>
              <Link to="/login" className="btn-secondary">Sign In</Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <div className="finance-illustration"></div>
        </div>
      </div>
      
      <div className="features-section">
        <h3>Key Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon upload-icon"></div>
            <h4>Bank Statement Upload</h4>
            <p>Easily upload statements from major Indian banks including ICICI, HDFC, and Axis to automatically import your transactions.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon category-icon"></div>
            <h4>Smart Categorization</h4>
            <p>Transactions are automatically categorized, helping you understand your spending patterns with minimal effort.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon chart-icon"></div>
            <h4>Insightful Analytics</h4>
            <p>Visual charts and reports show where your money goes and help identify areas where you can save.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon budget-icon"></div>
            <h4>Budget Management</h4>
            <p>Set monthly budgets for different categories and track your progress to stay on top of your financial goals.</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Connect Your Bank</h4>
            <p>Upload your bank statements securely from major Indian banks.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h4>Categorize Transactions</h4>
            <p>Transactions are automatically categorized, or you can manually adjust them.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h4>Set Budgets</h4>
            <p>Create monthly budgets for different spending categories.</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h4>Track & Analyze</h4>
            <p>Monitor your spending and gain insights with detailed analytics.</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <div className="cta-content">
          <h3>Ready to take control of your finances?</h3>
          <p>Start your journey to financial clarity today.</p>
          {!auth.isLoggedIn ? (
            <Link to="/signup" className="btn-primary">Get Started for Free</Link>
          ) : (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Login page component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demo purposes, any email/password will work
    const success = auth.login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };
  
  if (auth.isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="page">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn-primary">Login</button>
        <p className="form-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

// Signup page component
function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // For demo purposes, any valid input will work
    const success = auth.signup(name, email, password);
    if (!success) {
      setError('Registration failed');
    }
  };
  
  if (auth.isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="page">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Create a password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="btn-primary">Create Account</button>
        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

// Dashboard page component
function Dashboard() {
  const auth = useAuth();
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { budgets } = useBudgets();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];
  
  useEffect(() => {
    // Load any existing transactions from localStorage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Generate chart data
  const generateChartData = (transactionData) => {
    // Filter transactions for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonthTransactions = transactionData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             transaction.type === 'debit'; // Only expenses
    });
    
    // Group by category and sum amounts
    const categoryMap = {};
    thisMonthTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += transaction.amount;
    });
    
    // Convert to array for chart
    const chartData = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));
    
    return chartData;
  };

  // Calculate summary data
  const calculateSummary = (transactionData) => {
    if (!transactionData || transactionData.length === 0) {
      return {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for the current month
    const thisMonthTransactions = transactionData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate monthly income and expenses
    const monthlyIncome = thisMonthTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlyExpenses = thisMonthTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate total balance (latest balance from most recent transaction)
    // Sort transactions by date (descending)
    const sortedTransactions = [...transactionData].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    const totalBalance = sortedTransactions.length > 0 && sortedTransactions[0].balance 
      ? sortedTransactions[0].balance 
      : 0;
    
    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses
    };
  };

  // Get summary data
  const summary = calculateSummary(transactions);
  
  // Handle bank selection
  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if bank and file are selected
    if (!selectedBank) {
      setUploadStatus('Please select a bank');
      return;
    }
    
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload');
      return;
    }
    
    // Start upload process
    setIsUploading(true);
    setUploadStatus('Processing file...');
    
    try {
      // Read the file content
      const fileContent = await readFileContent(selectedFile);
      
      // For now, simulate parsed transactions
      // In a real implementation, you would use the actual parsers
      // const { parseStatement } = await import('./utils/bankStatementParsers');
      // const parsedTransactions = parseStatement(selectedFile, fileContent, selectedBank);
      
      // Simulate parsed transactions for demo purposes
      const demoTransactions = [
        { date: '2025-02-21', description: 'SALARY FEB 2025', amount: 50000, type: 'credit', balance: 82500, category: 'Income' },
        { date: '2025-02-19', description: 'UPI-SWIGGY-SWIG1234567-OTHR', amount: 850.50, type: 'debit', balance: 32500, category: 'Food' },
        { date: '2025-02-18', description: 'UPI-AMAZON-AMZN1234567-OTHR', amount: 2499, type: 'debit', balance: 33350.50, category: 'Shopping' },
        { date: '2025-02-15', description: 'ATM WITHDRAWAL', amount: 10000, type: 'debit', balance: 35849.50, category: 'Miscellaneous' },
        { date: '2025-02-12', description: 'UPI-BIGBASKET-BASK1234567-OTHR', amount: 1250.75, type: 'debit', balance: 45849.50, category: 'Grocery' }
      ];
      
      // Store in localStorage and update state
      localStorage.setItem('transactions', JSON.stringify(demoTransactions));
      setTransactions(demoTransactions);
      setUploadStatus(`Successfully processed ${demoTransactions.length} transactions from ${selectedFile.name}`);
      
    } catch (error) {
      console.error('Error parsing file:', error);
      setUploadStatus(`Error processing file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file); // For CSV files
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsArrayBuffer(file); // For Excel files
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Balance</h3>
          <p className="amount">₹{summary.totalBalance.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}</p>
        </div>
        <div className="summary-card">
          <h3>Monthly Income</h3>
          <p className="amount income">₹{summary.monthlyIncome.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}</p>
        </div>
        <div className="summary-card">
          <h3>Monthly Expenses</h3>
          <p className="amount expense">₹{summary.monthlyExpenses.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}</p>
        </div>
      </div>
      
      <div className="upload-section">
        <h3>Upload Bank Statement</h3>
        
        {uploadStatus && (
          <div className={`status-message ${uploadStatus.includes('Success') ? 'success' : uploadStatus.includes('Error') ? 'error' : ''}`}>
            {uploadStatus}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="bankType">Select Bank</label>
            <select 
              id="bankType" 
              value={selectedBank} 
              onChange={handleBankChange}
            >
              <option value="">-- Select Bank --</option>
              <option value="icici">ICICI Bank</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="sbi">State Bank of India</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="statementFile">Upload Statement</label>
            <input 
              type="file" 
              id="statementFile" 
              onChange={handleFileChange}
              accept=".csv,.xls,.xlsx"
            />
            <small className="file-help">Supported formats: CSV, Excel (XLS, XLSX)</small>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Upload'}
          </button>
        </form>
      </div>
      
      {/* Charts Section */}
      {transactions.length > 0 && (
        <div className="charts-section">
          <h3>Monthly Spending Analysis</h3>
          <div className="charts-container">
            <div className="chart-card">
              <h4>Spending by Category</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={generateChartData(transactions)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {generateChartData(transactions).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-card">
              <h4>Top Spending Categories</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={generateChartData(transactions).sort((a, b) => b.value - a.value).slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#8884d8">
                    {generateChartData(transactions).sort((a, b) => b.value - a.value).slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Budget Status Section */}
      {Object.keys(budgets).length > 0 && transactions.length > 0 && (
        <div className="budget-status-section">
          <h3>Budget Status</h3>
          <div className="budget-status-cards">
            {Object.entries(budgets).map(([category, budget]) => {
              // Calculate current spending for this category this month
              const currentDate = new Date();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();
              
              const thisMonthTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate.getMonth() === currentMonth && 
                      transactionDate.getFullYear() === currentYear &&
                      transaction.type === 'debit' &&
                      transaction.category === category;
              });
              
              const spent = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
              const percentUsed = (spent / budget) * 100;
              
              return (
                <div key={category} className="budget-status-card">
                  <div className="budget-status-header">
                    <h4>{category}</h4>
                    <span className={percentUsed > 100 ? 'over-budget' : ''}>{percentUsed.toFixed(0)}% used</span>
                  </div>
                  <div className="budget-progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(100, percentUsed)}%`,
                        backgroundColor: percentUsed > 100 ? '#dc3545' : percentUsed > 80 ? '#ffc107' : '#28a745'
                      }}
                    ></div>
                  </div>
                  <div className="budget-status-detail">
                    <span>₹{spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })} of ₹{budget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span className={percentUsed > 100 ? 'over-budget' : ''}>
                      {percentUsed > 100 
                        ? `Over by ₹${(spent - budget).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` 
                        : `₹${(budget - spent).toLocaleString('en-IN', { maximumFractionDigits: 0 })} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {transactions.length > 0 && (
        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <table className="transactions-table">
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
              {transactions.slice(0, 5).map((transaction, index) => (
                <tr key={index} className={transaction.type === 'debit' ? 'debit-row' : 'credit-row'}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>₹{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.type === 'debit' ? 'Expense' : 'Income'}</td>
                  <td>{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="view-all">
            <Link to="/transactions" className="btn-link">View All Transactions</Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Budget management component
function Budget() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const { budgets, setBudget, removeBudget } = useBudgets();
  const [categories] = useState([
    'Food', 'Grocery', 'Transportation', 'Shopping', 
    'Entertainment', 'Utilities', 'Housing', 'Healthcare', 'Miscellaneous'
  ]);
  const auth = useAuth();
  
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);
  
  // Calculate current spending by category
  const calculateSpending = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             transaction.type === 'debit';
    });
    
    const spendingByCategory = {};
    categories.forEach(cat => {
      spendingByCategory[cat] = 0;
    });
    
    thisMonthTransactions.forEach(transaction => {
      const category = transaction.category || 'Miscellaneous';
      if (spendingByCategory[category] !== undefined) {
        spendingByCategory[category] += transaction.amount;
      }
    });
    
    return spendingByCategory;
  };
  
  const spending = calculateSpending();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (category && amount && !isNaN(amount)) {
      setBudget(category, parseFloat(amount));
      setCategory('');
      setAmount('');
    }
  };
  
  const handleEdit = (category, currentBudget) => {
    setEditingCategory(category);
    setAmount(currentBudget.toString());
  };
  
  const handleUpdate = () => {
    if (amount && !isNaN(amount)) {
      setBudget(editingCategory, parseFloat(amount));
      setEditingCategory(null);
      setAmount('');
    }
  };
  
  const handleCancel = () => {
    setEditingCategory(null);
    setAmount('');
  };
  
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="page">
      <h2>Budget Management</h2>
      
      <div className="budget-form-section">
        <h3>Set New Budget</h3>
        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Monthly Budget (₹)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="100"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Set Budget</button>
        </form>
      </div>
      
      <div className="budget-list-section">
        <h3>Current Budgets</h3>
        {Object.keys(budgets).length === 0 ? (
          <p className="no-budgets">No budgets set yet. Use the form above to set category budgets.</p>
        ) : (
          <div className="budget-list">
            {Object.entries(budgets).map(([category, budget]) => (
              <div key={category} className="budget-item">
                <div className="budget-details">
                  <h4>{category}</h4>
                  {editingCategory === category ? (
                    <div className="budget-edit">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="100"
                        autoFocus
                      />
                      <div className="budget-actions">
                        <button onClick={handleUpdate} className="btn-small">Save</button>
                        <button onClick={handleCancel} className="btn-small secondary">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="budget-amount">
                        <span>Budget: {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }).format(budget)}</span>
                        <span>Spent: {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }).format(spending[category] || 0)}</span>
                      </div>
                      <div className="budget-progress">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${Math.min(100, ((spending[category] || 0) / budget) * 100)}%`,
                            backgroundColor: (spending[category] || 0) > budget ? '#dc3545' : '#4a8cff'
                          }}
                        ></div>
                      </div>
                      <div className="budget-status">
                        {spending[category] > budget ? (
                          <span className="over-budget">Over budget by {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format(spending[category] - budget)}</span>
                        ) : (
                          <span className="under-budget">Remaining: {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format(budget - (spending[category] || 0))}</span>
                        )}
                      </div>
                      <div className="budget-actions">
                        <button onClick={() => handleEdit(category, budget)} className="btn-small">Edit</button>
                        <button onClick={() => removeBudget(category)} className="btn-small danger">Remove</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Transactions page component
function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [categories, setCategories] = useState([
    'Income', 'Food', 'Grocery', 'Transportation', 'Shopping', 
    'Entertainment', 'Utilities', 'Housing', 'Healthcare', 'Miscellaneous'
  ]);
  const auth = useAuth();
  
// Load transactions from localStorage on component mount
useEffect(() => {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    setTransactions(JSON.parse(storedTransactions));
  }
}, []);

// Handle category change
const handleCategoryChange = (index, newCategory) => {
  const updatedTransactions = [...transactions];
  updatedTransactions[index].category = newCategory;
  setTransactions(updatedTransactions);
  localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  setEditingIndex(null);
};

// Export transactions to CSV
const exportTransactions = () => {
  // Convert transactions to CSV
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category'];
  
  const csvRows = [
    headers.join(','),
    ...filteredTransactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
      t.amount,
      t.type,
      t.category
    ].join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Filter the transactions based on selected filters
const filteredTransactions = transactions.filter(transaction => {
  // Filter by category if selected
  if (filterCategory && transaction.category !== filterCategory) {
    return false;
  }
  
  // Filter by date range if selected
  if (filterDateFrom) {
    const transactionDate = new Date(transaction.date);
    const fromDate = new Date(filterDateFrom);
    if (transactionDate < fromDate) {
      return false;
    }
  }
  
  if (filterDateTo) {
    const transactionDate = new Date(transaction.date);
    const toDate = new Date(filterDateTo);
    // Set to end of day
    toDate.setHours(23, 59, 59, 999);
    if (transactionDate > toDate) {
      return false;
    }
  }
  
  return true;
});

// Reset all filters
const resetFilters = () => {
  setFilterCategory('');
  setFilterDateFrom('');
  setFilterDateTo('');
};

if (!auth.isLoggedIn) {
  return <Navigate to="/login" />;
}

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Format amount
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

return (
  <div className="page">
    <h2>Transactions</h2>
    
    {transactions.length === 0 ? (
      <div className="empty-state">
        <p>No transactions found. Upload a bank statement to get started.</p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    ) : (
      <>
        <div className="page-actions">
          <button onClick={exportTransactions} className="btn-primary">
            Export to CSV
          </button>
        </div>
        
        <div className="filters">
          <div className="filter-section">
            <h3>Filter Transactions</h3>
            <div className="filter-row">
              <div className="filter-item">
                <label>Category</label>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label>From Date</label>
                <input 
                  type="date" 
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <label>To Date</label>
                <input 
                  type="date" 
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <button 
                  className="btn-secondary"
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="transactions-list">
          <div className="transaction-count">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <table className="transactions-table">
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
              {filteredTransactions.map((transaction, index) => (
                <tr key={index} className={transaction.type === 'debit' ? 'debit-row' : 'credit-row'}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td>{formatAmount(transaction.amount)}</td>
                  <td>{transaction.type === 'debit' ? 'Expense' : 'Income'}</td>
                  <td>
                    {editingIndex === index ? (
                      <select 
                        value={transaction.category}
                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                        className="category-select"
                        autoFocus
                        onBlur={() => setEditingIndex(null)}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    ) : (
                      <span onClick={() => setEditingIndex(index)} className="editable-cell">
                        {transaction.category}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
);
}

// Navigation component
function Navigation({ isLoggedIn, onLogout }) {
return (
  <nav>
    <Link to="/">Home</Link>
    {isLoggedIn ? (
      <>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budgets">Budgets</Link>
        <button onClick={onLogout} className="nav-button">Logout</button>
      </>
    ) : (
      <>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </>
    )}
  </nav>
);
}

// Main App component
function App() {
const auth = useAuth();

return (
  <BrowserRouter>
    <div className="App">
      <header>
        <h1>Finance Tracker</h1>
        <Navigation isLoggedIn={auth.isLoggedIn} onLogout={auth.logout} />
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budget />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);
}

export default App;