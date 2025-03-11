import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { PageHeader } from '../components';
import { getCategoryColor } from '../utils/helpers';

// Default categories from our helper
const DEFAULT_CATEGORIES = {
  'Income': '#4CAF50',
  'Investments': '#2196F3',
  'Housing': '#9C27B0',
  'Bills & Utilities': '#FF9800',
  'Transportation': '#F44336',
  'Insurance': '#3F51B5',
  'Healthcare': '#E91E63',
  'Food & Dining': '#009688',
  'Shopping': '#FF5722',
  'Entertainment': '#673AB7',
  'Education': '#00BCD4',
  'Loan Payment': '#795548',
  'EMI': '#607D8B',
  'Other': '#9E9E9E',
};

const Categories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#000000');

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category);
      setCategoryColor(categories[category]);
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryColor('#000000');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor('#000000');
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    setCategories(prev => {
      const newCategories = { ...prev };
      if (editingCategory) {
        delete newCategories[editingCategory];
      }
      newCategories[categoryName] = categoryColor;
      return newCategories;
    });

    handleCloseDialog();
  };

  const handleDeleteCategory = (category) => {
    if (category === 'Other') return; // Prevent deleting the default 'Other' category
    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[category];
      return newCategories;
    });
  };

  return (
    <Box>
      <PageHeader 
        title="Categories"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        }
      />

      <Grid container spacing={3}>
        {Object.entries(categories).map(([category, color]) => (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {category}
                    </Typography>
                    <Chip
                      sx={{
                        backgroundColor: color,
                        width: 100,
                        height: 24,
                      }}
                    />
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(category)}
                      disabled={category === 'Other'}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category)}
                      disabled={category === 'Other'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Color</Typography>
              <input
                type="color"
                value={categoryColor}
                onChange={(e) => setCategoryColor(e.target.value)}
                style={{ width: '100%', height: 40 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories; 