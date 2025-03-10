import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { useFinance } from '../contexts/FinanceContext';
import { generateId } from '../utils/helpers';

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  date: yup.date().required('Date is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  category: yup.string().required('Category is required'),
});

export default function AddTransactionDialog({ open, onClose }) {
  const { addTransaction, CATEGORIES } = useFinance();

  const formik = useFormik({
    initialValues: {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const transaction = {
        id: generateId(),
        ...values,
        amount: parseFloat(values.amount),
        date: new Date(values.date).toISOString(),
      };

      addTransaction(transaction);
      resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Transaction</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="description"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            fullWidth
            margin="normal"
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />

          <TextField
            fullWidth
            margin="normal"
            id="date"
            name="date"
            label="Date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            id="type"
            name="type"
            label="Type"
            select
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            id="category"
            name="category"
            label="Category"
            select
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          >
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Transaction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 