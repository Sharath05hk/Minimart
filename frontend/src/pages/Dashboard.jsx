import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Paper, Typography, Box, Grid, Button, Avatar, useTheme, Stack,
} from '@mui/material';
import {
  ShoppingCart, AttachMoney, PeopleAlt, Inventory, ArrowForward,
} from '@mui/icons-material';

const mockStats = {
  salesToday: 4850.75,
  newOrders: 15,
  newCustomers: 8,
};

const quickLinks = [
  {
    title: 'Manage Products',
    description: 'Add, edit, and update your product inventory.',
    icon: <Inventory fontSize="large" color="primary" />,
    path: '/products',
  },
  {
    title: 'View Orders',
    description: 'Check recent orders, status, and customer details.',
    icon: <ShoppingCart fontSize="large" color="primary" />,
    path: '/orders',
  },
];

const StatCard = ({ title, value, icon, format = 'number' }) => {
  const formattedValue = format === 'currency'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : new Intl.NumberFormat('en-US').format(value);

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 2 }}>
      <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56, mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography color="text.secondary" variant="body2">{title}</Typography>
        <Typography variant="h5" fontWeight="bold">{formattedValue}</Typography>
      </Box>
    </Paper>
  );
};

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={4}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            color: 'common.white',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Welcome to Minimart
            </Typography>
            <Typography variant="h6" mt={1} sx={{ opacity: 0.9 }}>
              Here's a snapshot of your business activity today.
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Sales Today"
              value={mockStats.salesToday}
              icon={<AttachMoney color="action" />}
              format="currency"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="New Orders"
              value={mockStats.newOrders}
              icon={<ShoppingCart color="action" />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <StatCard
              title="New Customers"
              value={mockStats.newCustomers}
              icon={<PeopleAlt color="action" />}
            />
          </Grid>
        </Grid>

        <Box>
            <Typography variant="h6" component="h2" mb={2}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickLinks.map((link) => (
                <Grid item xs={12} md={6} key={link.title}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6],
                      }
                    }}
                  >
                    {link.icon}
                    <Box flexGrow={1}>
                      <Typography variant="h6">{link.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{link.description}</Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to={link.path}
                      endIcon={<ArrowForward />}
                    >
                      Go
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
        </Box>
      </Stack>
    </Box>
  );
}