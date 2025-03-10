import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function PageHeader({ title, action, actionLabel }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {action && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={action}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
} 