import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Add,
  CloudUpload,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip } from 'recharts';
import { useFinance } from '../contexts/FinanceContext';
import { LoadingSpinner, EmptyState, AddTransactionDialog } from '../components';
import ImportTransactions from '../components/ImportTransactions';
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  calculatePercentage,
} from '../utils/helpers';

export default function Dashboard() {
  const {
    transactions,
    loading,
    getMonthlySpending,
    getMonthlyIncome,
    getSpendingByCategory,
  } = useFinance();

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  if (loading) return <LoadingSpinner />;

  // Calculate summary data
  const totalBalance = transactions.reduce((sum, t) => 
    t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlySpending();

  // Prepare chart data
  const spendingByCategory = getSpendingByCategory();
  const chartData = Object.entries(spendingByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  // Get recent transactions
  const recentTransactions = transactions
    .slice(0, 5)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (transactions.length === 0) {
    return (
      <Container maxWidth="lg">
        <EmptyState
          title="Welcome to Finance Tracker!"
          description="Start by importing your bank statement or adding your first transaction."
          action={() => setIsImportOpen(true)}
          actionLabel="Import Bank Statement"
        />
        <ImportTransactions
          open={isImportOpen}
          onClose={() => setIsImportOpen(false)}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Quick Actions */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setIsImportOpen(true)}
        >
          Import Statement
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setIsAddTransactionOpen(true)}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Balance</Typography>
              </Box>
              <Typography variant="h4" color={totalBalance >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(totalBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Income</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {formatCurrency(monthlyIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Expenses</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {formatCurrency(monthlyExpenses)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {calculatePercentage(monthlyExpenses, monthlyIncome)}% of income
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Recent Transactions */}
      <Grid container spacing={3}>
        {/* Spending by Category Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Spending by Category</Typography>
              </Box>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={getCategoryColor(entry.name)}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Transactions</Typography>
                <Button
                  component={RouterLink}
                  to="/app/transactions"
                  color="primary"
                >
                  View All
                </Button>
              </Box>
              <Paper variant="outlined" sx={{ bgcolor: 'background.default' }}>
                {recentTransactions.map((transaction) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      p: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle2">
                          {transaction.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(transaction.date)} • {transaction.category}
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle1"
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <AddTransactionDialog
        open={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
      />
      <ImportTransactions
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </Container>
  );
} 