import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function EmptyState({ title, description, action, actionLabel }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {description}
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