import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

import {
  Paper, Typography, Stack, TextField, Button, Box, Grid, Divider,
  CircularProgress, Alert, Skeleton, Snackbar
} from '@mui/material';
import { Assessment, CalendarMonth, Download, BarChart, Star } from '@mui/icons-material';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon }) => (
  <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 2 }}>
    <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>
    <Box>
      <Typography color="text.secondary" variant="body2">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: new Date().toISOString().split('T')[0],
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const generateReportMutation = useMutation({
    mutationFn: () => api.get('/api/reports/sales', { params: dateRange }),
  });
  
  const downloadPdfMutation = useMutation({
    mutationFn: () => api.get('/api/reports/sales.pdf', { params: dateRange, responseType: 'blob' }),
    onSuccess: (res) => {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report_${dateRange.from}_to_${dateRange.to}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: 'Report download started!', severity: 'success' });
    },
    onError: () => {
       setSnackbar({ open: true, message: 'Failed to download PDF.', severity: 'error' });
    }
  });

  const handleDateChange = (e) => setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  const handleGenerateReport = () => generateReportMutation.mutate();

  const summary = generateReportMutation.data?.data;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Assessment color="primary" />
              <Typography variant="h6" component="h1">Sales Report Generator</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField fullWidth name="from" type="date" label="From" value={dateRange.from} onChange={handleDateChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth name="to" type="date" label="To" value={dateRange.to} onChange={handleDateChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => downloadPdfMutation.mutate()}
                    disabled={!summary || downloadPdfMutation.isLoading}
                    startIcon={downloadPdfMutation.isLoading ? <CircularProgress size={20} /> : <Download />}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleGenerateReport}
                    disabled={generateReportMutation.isLoading}
                    startIcon={generateReportMutation.isLoading ? <CircularProgress size={20} /> : <CalendarMonth />}
                  >
                    Generate
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        <Box>
          {generateReportMutation.isLoading ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}><Skeleton variant="rounded" height={80} /></Grid>
              <Grid item xs={12} md={4}><Skeleton variant="rounded" height={80} /></Grid>
              <Grid item xs={12} md={4}><Skeleton variant="rounded" height={80} /></Grid>
              <Grid item xs={12}><Skeleton variant="rounded" height={300} /></Grid>
            </Grid>
          ) : generateReportMutation.isError ? (
            <Alert severity="error">Failed to load report data. Please check your backend.</Alert>
          ) : summary ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <StatCard title="Total Revenue" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalRevenue)} icon={<BarChart />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard title="Total Orders" value={summary.totalOrders} icon={<Assessment />} />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard title="Top Product" value={summary.topProduct || 'N/A'} icon={<Star />} />
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" mb={2}>Revenue Over Time</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={summary.salesByDay || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Daily Revenue" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', borderColor: 'divider', borderWidth: 2, borderRadius: 2 }}>
              <Typography variant="h6">Your Report Awaits</Typography>
              <Typography color="text.secondary">Select a date range and click "Generate" to see your sales data.</Typography>
            </Paper>
          )}
        </Box>
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}