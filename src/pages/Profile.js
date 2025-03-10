import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Person, Notifications, Security, Download } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  currency: yup.string().required('Currency is required'),
});

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetAlerts: true,
    monthlyReport: true,
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      currency: user?.currency || 'USD',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateProfile(values);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
  });

  const handleNotificationChange = (setting) => (event) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: event.target.checked,
    }));
  };

  const handleExportData = () => {
    // Implementation for exporting user data
    const data = {
      profile: formik.values,
      settings: notifications,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-tracker-profile.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <PageHeader title="Profile Settings" />

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'primary.main',
                  mr: 2,
                }}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h6">{formik.values.name}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {formik.values.email}
                </Typography>
              </Box>
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <TextField
                fullWidth
                margin="normal"
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                fullWidth
                margin="normal"
                id="currency"
                name="currency"
                label="Preferred Currency"
                select
                SelectProps={{
                  native: true,
                }}
                value={formik.values.currency}
                onChange={formik.handleChange}
                error={formik.touched.currency && Boolean(formik.errors.currency)}
                helperText={formik.touched.currency && formik.errors.currency}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="INR">INR (₹)</option>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Notifications & Security */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
              Notification Preferences
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.emailAlerts}
                  onChange={handleNotificationChange('emailAlerts')}
                />
              }
              label="Email Alerts"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Receive important account notifications via email
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.budgetAlerts}
                  onChange={handleNotificationChange('budgetAlerts')}
                />
              }
              label="Budget Alerts"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Get notified when you're close to your budget limits
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.monthlyReport}
                  onChange={handleNotificationChange('monthlyReport')}
                />
              }
              label="Monthly Report"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive monthly spending and savings reports
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              Data & Security
            </Typography>

            <Button
              startIcon={<Download />}
              variant="outlined"
              onClick={handleExportData}
              fullWidth
            >
              Export Profile Data
            </Button>

            <Divider sx={{ my: 2 }} />

            <Button
              color="error"
              variant="outlined"
              fullWidth
            >
              Delete Account
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 