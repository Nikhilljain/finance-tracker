import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Security,
  Speed,
} from '@mui/icons-material';

const features = [
  {
    icon: <AccountBalance fontSize="large" color="primary" />,
    title: 'Track Your Finances',
    description: 'Keep track of your income and expenses in one place.',
  },
  {
    icon: <TrendingUp fontSize="large" color="primary" />,
    title: 'Budget Management',
    description: 'Set and monitor budgets for different spending categories.',
  },
  {
    icon: <Speed fontSize="large" color="primary" />,
    title: 'Real-time Analytics',
    description: 'Get insights into your spending patterns with visual analytics.',
  },
  {
    icon: <Security fontSize="large" color="primary" />,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and never shared.',
  },
];

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Take Control of Your Finances
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            A simple and intuitive way to track your expenses, manage budgets,
            and achieve your financial goals. Start your journey to financial
            freedom today.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Ready to Start?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
          >
            Join thousands of users who are already managing their finances
            smarter with our app.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
            >
              Create Free Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 