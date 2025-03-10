import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useFinance } from '../contexts/FinanceContext';
import { LoadingSpinner, PageHeader, EmptyState } from '../components';
import { formatCurrency } from '../utils/helpers';

const validationSchema = yup.object({
  category: yup.string().required('Category is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive'),
});

function BudgetDialog({ open, onClose, initialBudget = null }) {
  const { CATEGORIES, addBudget, updateBudget } = useFinance();
  
  const formik = useFormik({
    initialValues: {
      category: initialBudget?.category || '',
      amount: initialBudget?.amount || '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (initialBudget) {
        updateBudget(initialBudget.id, values);
      } else {
        addBudget(values);
      }
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialBudget ? 'Edit Budget' : 'Add Budget'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="category"
            name="category"
            label="Category"
            select
            SelectProps={{
              native: true,
            }}
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            disabled={initialBudget}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            id="amount"
            name="amount"
            label="Monthly Budget Amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialBudget ? 'Update' : 'Add'} Budget
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function BudgetCard({ budget, onEdit }) {
  const { getMonthlySpendingByCategory } = useFinance();
  const spent = getMonthlySpendingByCategory(budget.category);
  const progress = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{budget.category}</Typography>
          <IconButton size="small" onClick={() => onEdit(budget)}>
            <Edit />
          </IconButton>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Spent: {formatCurrency(spent)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Budget: {formatCurrency(budget.amount)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            color={progress > 90 ? 'error' : progress > 75 ? 'warning' : 'primary'}
          />
        </Box>

        <Typography
          variant="subtitle2"
          color={remaining >= 0 ? 'success.main' : 'error.main'}
        >
          {remaining >= 0 ? 'Remaining: ' : 'Over budget by '}
          {formatCurrency(Math.abs(remaining))}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Budget() {
  const { budgets, loading } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  if (loading) return <LoadingSpinner />;

  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBudget(null);
  };

  if (budgets.length === 0) {
    return (
      <Container maxWidth="lg">
        <EmptyState
          title="No Budgets Set"
          description="Start by setting a budget for your spending categories."
          action={() => setIsDialogOpen(true)}
          actionLabel="Set Budget"
        />
        <BudgetDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          initialBudget={selectedBudget}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Budget Management"
        action={() => setIsDialogOpen(true)}
        actionLabel="Add Budget"
      />

      <Grid container spacing={3}>
        {budgets.map((budget) => (
          <Grid item xs={12} sm={6} md={4} key={budget.id}>
            <BudgetCard budget={budget} onEdit={handleEditBudget} />
          </Grid>
        ))}
      </Grid>

      <BudgetDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        initialBudget={selectedBudget}
      />
    </Container>
  );
} 