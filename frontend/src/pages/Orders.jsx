import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

import {
  Paper, Typography, Stack, TextField, MenuItem, Button, Grid, Box,
  Divider, IconButton, CircularProgress, Alert, Skeleton, Dialog,
  DialogTitle, DialogContent, DialogActions, Snackbar
} from '@mui/material';
import { AddShoppingCart, Add, Delete, ReceiptLong } from '@mui/icons-material';

const fetchProducts = async () => (await api.get('/api/products')).data;
const fetchCustomers = async () => (await api.get('/api/customers')).data;

const OrderItemRow = ({ item, index, products, onUpdate, onRemove, disabled }) => {
  const isProductSelected = item.productId !== '';

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems="center"
      sx={{ p: 2, borderRadius: 1, bgcolor: 'action.hover' }}
    >
      <TextField
        select
        fullWidth
        label={`Product #${index + 1}`}
        value={item.productId || ''} // Use empty string for MenuItem value
        onChange={(e) => {
          const val = e.target.value;
          onUpdate(index, { productId: val === '' ? '' : Number(val) });
        }}
        disabled={disabled}
      >
        <MenuItem value=""><em>Select a Product</em></MenuItem>
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>{p.name} (${p.price})</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Quantity"
        type="number"
        value={item.quantity}
        onChange={(e) =>
          onUpdate(index, {
            quantity: Math.max(1, parseInt(e.target.value, 10) || 1)
          })
        }
        disabled={disabled || !isProductSelected}
        inputProps={{ min: 1 }}
        sx={{ width: { xs: '100%', md: 120 } }}
      />
      <IconButton onClick={() => onRemove(index)} color="error" disabled={disabled}>
        <Delete />
      </IconButton>
    </Stack>
  );
};

export default function Orders() {
  const queryClient = useQueryClient();

  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);

  const { data: products = [], isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  const { data: customers = [], isLoading: customersLoading, isError: customersError } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  });

  const createOrderMutation = useMutation({
    mutationFn: async (newOrder) => (await api.post('/api/orders', newOrder)).data,
    onSuccess: (order) => {
      setSnackbar({ open: true, message: 'Order created successfully!', severity: 'success' });
      setSuccessDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create order.',
        severity: 'error'
      });
    }
  });

  const addItem = () => setItems([...items, { productId: '', quantity: 1 }]);
  const updateItem = (idx, patch) => setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const resetForm = () => {
    setCustomerId('');
    setItems([{ productId: '', quantity: 1 }]);
    setSuccessDialogOpen(false);
    createOrderMutation.reset();
  };

  const orderSummary = useMemo(() => {
    const validItems = items.filter(item => item.productId && item.quantity > 0);
    const subtotal = validItems.reduce((acc, item) => {
      const product = products.find(p => p.id === Number(item.productId));
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total, itemCount: validItems.length };
  }, [items, products]);

  const handleCreateOrder = () => {
    const orderPayload = {
      customerId: Number(customerId),
      items: items
        .filter(i => i.productId)
        .map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
    };
    createOrderMutation.mutate(orderPayload);
  };
  
  const isFormInvalid = !customerId || orderSummary.itemCount === 0 || createOrderMutation.isLoading;

  const downloadInvoice = async (orderId) => {
    if (!orderId) {
      setSnackbar({ open: true, message: 'Missing order ID for invoice.', severity: 'error' });
      return;
    }
    try {
      const res = await api.get(`/api/orders/${orderId}/invoice.pdf`, { responseType: 'blob' });
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to download invoice.', severity: 'error' });
    }
  };

  const createdOrder = createOrderMutation.data;

  if (productsError || customersError) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        Failed to load necessary data. Please check your backend connection.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AddShoppingCart color="primary" />
                <Typography variant="h6" component="h1">Create New Order</Typography>
              </Box>
              
              {customersLoading ? (
                <Skeleton variant="rectangular" height={56} />
              ) : (
                <TextField
                  select
                  label="Select a Customer"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  disabled={createOrderMutation.isLoading}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {customers.map((c) => (<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>))}
                </TextField>
              )}

              <Divider>
                <Typography variant="overline">Products</Typography>
              </Divider>

              {productsLoading ? (
                  <Stack spacing={2}>
                   <Skeleton variant="rectangular" height={90} />
                   <Skeleton variant="rectangular" height={90} />
                  </Stack>
              ) : (
                <Stack spacing={2}>
                  {items.map((item, idx) => (
                    <OrderItemRow
                      key={idx}
                      item={item}
                      index={idx}
                      products={products}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                      disabled={createOrderMutation.isLoading}
                    />
                  ))}
                </Stack>
              )}
              
              <Button
                onClick={addItem}
                startIcon={<Add />}
                variant="outlined"
                disabled={createOrderMutation.isLoading}
              >
                Add Another Product
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 24 }}>
            <Stack spacing={2}>
              <Typography variant="h6" component="h2">Order Summary</Typography>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal ({orderSummary.itemCount} items)</Typography>
                <Typography fontWeight="medium">${orderSummary.subtotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Tax (8%)</Typography>
                <Typography fontWeight="medium">${orderSummary.tax.toFixed(2)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  ${orderSummary.total.toFixed(2)}
                </Typography>
              </Stack>
              <Box sx={{ pt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCreateOrder}
                  disabled={isFormInvalid}
                  startIcon={createOrderMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {createOrderMutation.isLoading ? 'Creating Order...' : 'Create Order & Finalize'}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog open={isSuccessDialogOpen} onClose={resetForm}>
        <DialogTitle>Order Created Successfully!</DialogTitle>
        <DialogContent>
          <Typography>Order ID: {createdOrder?.id}</Typography>
          <Typography>
            Total: $
            {Number(createdOrder?.totalAmount ?? createdOrder?.total ?? 0).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            You can now download the invoice or create a new order.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => downloadInvoice(createdOrder?.id)}
            startIcon={<ReceiptLong />}
            disabled={!createdOrder?.id}
          >
            Download Invoice
          </Button>
          <Button onClick={resetForm} variant="contained">Create Another Order</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}