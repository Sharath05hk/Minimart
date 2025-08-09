import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';

export default function Customers() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <PeopleAlt color="primary" />
          <Typography variant="h6" component="h1">Customers Management</Typography>
        </Box>
        <Typography variant="body1">
          This is a placeholder for the customers management page.
          You can add functionality here to view, add, edit, and delete customer records.
        </Typography>
      </Paper>
    </Box>
  );
}