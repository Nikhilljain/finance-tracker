import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { 
  Download as DownloadIcon, 
  TrendingUp, 
  TrendingDown,
  AccountBalance,
  ShoppingCart,
  LocalAtm,
  Info,
} from '@mui/icons-material';
import { useFinance } from '../contexts/FinanceContext';
import { PageHeader } from '../components';
import { formatCurrency, getCategoryColor } from '../utils/helpers';

const StatCard = ({ title, value, icon, trend, subtitle, color }) => {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                width: 48,
                height: 48,
                bgcolor: color + '10',
                color: color,
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
                {value}
              </Typography>
            </Box>
          </Box>
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: trend > 0 ? theme.palette.success.light + '20' : theme.palette.error.light + '20',
                color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {trend > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500 }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default function Reports() {
  const theme = useTheme();
  const {
    transactions,
    getMonthlyIncome,
    getMonthlySpending,
    getSpendingByCategory,
    CATEGORIES,
  } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get all available years from transactions
  const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort();
  
  // Filter transactions for selected month and year
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  // Calculate monthly statistics
  const monthlyStats = {
    income: monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expenses: monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    savings: 0,
    topExpenseCategory: '',
    mostFrequentCategory: '',
    unusualSpending: [],
  };

  monthlyStats.savings = monthlyStats.income - monthlyStats.expenses;

  // Calculate category-wise spending
  const categorySpending = {};
  const categoryCount = {};
  monthlyTransactions.forEach(t => {
    if (t.type === 'expense') {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    }
  });

  // Find top expense category
  monthlyStats.topExpenseCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  // Find most frequent category
  monthlyStats.mostFrequentCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  // Prepare data for charts
  const spendingByCategory = Object.entries(categorySpending).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Daily spending trend data
  const dailySpending = {};
  monthlyTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const day = new Date(t.date).getDate();
      dailySpending[day] = (dailySpending[day] || 0) + t.amount;
    });

  const dailyTrendData = Object.entries(dailySpending).map(([day, amount]) => ({
    day: day,
    amount: amount,
  }));

  // Generate insights
  const generateInsights = () => {
    const insights = [];
    
    // Savings insight
    const savingsRate = (monthlyStats.savings / monthlyStats.income) * 100;
    insights.push({
      type: savingsRate > 20 ? 'positive' : 'negative',
      message: `Your savings rate is ${savingsRate.toFixed(1)}% of your income`,
      detail: savingsRate > 20 
        ? 'Great job! You\'re saving more than the recommended 20%'
        : 'Try to save at least 20% of your income',
    });

    // Top spending category insight
    insights.push({
      type: 'info',
      message: `Your highest expense category was ${monthlyStats.topExpenseCategory}`,
      detail: `You spent ${formatCurrency(categorySpending[monthlyStats.topExpenseCategory])} in this category`,
    });

    // Daily average spending
    const dailyAvg = monthlyStats.expenses / Object.keys(dailySpending).length;
    insights.push({
      type: 'info',
      message: `Your daily average spending was ${formatCurrency(dailyAvg)}`,
      detail: 'Based on days with transactions',
    });

    return insights;
  };

  const handleDownloadReport = () => {
    // Implementation for downloading report as PDF/Excel
    console.log('Downloading report...');
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Monthly Reports & Analysis"
        action={
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
            sx={{ px: 3 }}
          >
            Download Report
          </Button>
        }
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <MenuItem key={i} value={i}>
              {new Date(2000, i).toLocaleString('default', { month: 'long' })}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          size="small"
          sx={{ minWidth: 100 }}
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </Stack>

      <Grid container spacing={3}>
        {/* Monthly Summary Cards */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Income"
            value={formatCurrency(monthlyStats.income)}
            icon={<LocalAtm />}
            trend={12}
            subtitle="vs. last month"
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Expenses"
            value={formatCurrency(monthlyStats.expenses)}
            icon={<ShoppingCart />}
            trend={-5}
            subtitle="vs. last month"
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Net Savings"
            value={formatCurrency(monthlyStats.savings)}
            icon={<AccountBalance />}
            trend={8}
            subtitle="vs. last month"
            color={theme.palette.info.main}
          />
        </Grid>

        {/* Insights */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Key Insights</Typography>
              <Tooltip title="Based on your spending patterns">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              {generateInsights().map((insight, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper 
                    sx={{ 
                      p: 2,
                      bgcolor: theme.palette[insight.type === 'positive' ? 'success' : insight.type === 'negative' ? 'error' : 'info'].light + '10',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      {insight.type === 'positive' ? (
                        <TrendingUp color="success" />
                      ) : insight.type === 'negative' ? (
                        <TrendingDown color="error" />
                      ) : (
                        <Info color="info" />
                      )}
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {insight.message}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {insight.detail}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Spending by Category</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={index} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Daily Spending Trend</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip formatter={(value) => formatCurrency(value)} />
                  <Bar 
                    dataKey="amount" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Transactions Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Monthly Transactions</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'action.hover' },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: getCategoryColor(transaction.category) + '20',
                            color: getCategoryColor(transaction.category),
                          }}
                        >
                          {transaction.category}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: transaction.type === 'income' 
                            ? theme.palette.success.main 
                            : theme.palette.error.main,
                          fontWeight: 500,
                        }}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: transaction.type === 'income' 
                              ? theme.palette.success.light + '20'
                              : theme.palette.error.light + '20',
                            color: transaction.type === 'income'
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          }}
                        >
                          {transaction.type}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 