import React, { useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  IconButton,
  Stack,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useFinance } from '../contexts/FinanceContext';
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  ConfirmDialog,
  AddTransactionDialog,
} from '../components';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Transactions() {
  const { transactions, loading, deleteTransaction, CATEGORIES } = useFinance();
  
  // State for filtering and pagination
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  if (loading) return <LoadingSpinner />;

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    if (filters.category !== 'all' && transaction.category !== filters.category) return false;
    if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) return false;
    return true;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Paginate transactions
  const paginatedTransactions = sortedTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setPage(0);
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTransaction) {
      deleteTransaction(selectedTransaction.id);
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <Container maxWidth="lg">
        <EmptyState
          title="No Transactions Yet"
          description="Start by adding your first transaction to track your expenses."
          action={() => setIsAddDialogOpen(true)}
          actionLabel="Add Transaction"
        />
        <AddTransactionDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Transactions"
        action={() => setIsAddDialogOpen(true)}
        actionLabel="Add Transaction"
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="Type"
            value={filters.type}
            onChange={handleFilterChange('type')}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>

          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={handleFilterChange('category')}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="From Date"
            value={filters.dateFrom}
            onChange={handleFilterChange('dateFrom')}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="To Date"
            value={filters.dateTo}
            onChange={handleFilterChange('dateTo')}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Paper>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      transaction.type === 'income'
                        ? 'success.main'
                        : 'error.main',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{' '}
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(transaction)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Dialogs */}
      <AddTransactionDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
        confirmText="Delete"
        severity="error"
      />
    </Container>
  );
} 