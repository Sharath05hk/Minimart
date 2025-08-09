import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Stack,
  TextField, Button, Box, TableContainer, IconButton, Avatar, Chip, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Snackbar, Alert, Skeleton
} from '@mui/material'

import { Add, Delete, Edit, Inventory2, WarningAmber } from '@mui/icons-material'

const fetchProducts = async () => (await api.get('/api/products')).data

const EMPTY_FORM = { id: null, name: '', sku: '', price: '0.00', stock: 0, category: '', supplier: '', imageUrl: '' };

const TableLoader = ({ columns }) => (
  Array.from(new Array(5)).map((_, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from(new Array(columns)).map((_, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ))
);

export default function Products() {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: products = [], isLoading, isError } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  const saveMutation = useMutation({
    mutationFn: (product) => 
      product.id
        ? api.put(`/api/products/${product.id}`, product)
        : api.post('/api/products', product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['products']);
      setIsFormOpen(false);
      setSnackbar({ open: true, message: `Product ${variables.id ? 'updated' : 'created'} successfully!`, severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.response?.data?.message || 'An error occurred.', severity: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setProductToDelete(null);
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete product.', severity: 'error' });
    }
  });

  const handleOpenForm = (product = null) => {
    setFormState(product ? { ...EMPTY_FORM, ...product } : EMPTY_FORM);
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
  
  const handleSave = () => {
    const payload = { ...formState, price: parseFloat(formState.price), stock: parseInt(formState.stock || 0) };
    saveMutation.mutate(payload);
  };
  
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const isAdmin = hasRole('ADMIN') || hasRole('MANAGER');

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Inventory2 color="primary" />
            <Typography variant="h6" component="h1">Product Inventory</Typography>
          </Stack>
          {isAdmin && (
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
              Add Product
            </Button>
          )}
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell>Category</TableCell>
                {isAdmin && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableLoader columns={isAdmin ? 7 : 6} />
              ) : isError ? (
                 <TableRow><TableCell colSpan={isAdmin ? 7 : 6} align="center" sx={{ py: 5 }}><Alert severity="error">Failed to load products.</Alert></TableCell></TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">No products found. Add one to get started!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Avatar src={p.imageUrl} alt={p.name} variant="rounded" sx={{ bgcolor: 'grey.200' }}>
                        <Inventory2 color="action" />
                      </Avatar>
                    </TableCell>
                    <TableCell component="th" scope="row">{p.name}</TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`}>
                        <Chip
                          label={p.stock}
                          color={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'error'}
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Edit Product">
                          <IconButton size="small" onClick={() => handleOpenForm(p)}><Edit /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <IconButton size="small" color="error" onClick={() => setProductToDelete(p)}><Delete /></IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{formState.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={8}><TextField fullWidth name="name" label="Product Name" value={formState.name} onChange={handleFormChange} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth name="sku" label="SKU" value={formState.sku} onChange={handleFormChange} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth name="price" label="Price" type="number" value={formState.price} onChange={handleFormChange} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth name="stock" label="Stock Quantity" type="number" value={formState.stock} onChange={handleFormChange} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth name="category" label="Category" value={formState.category} onChange={handleFormChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth name="supplier" label="Supplier" value={formState.supplier} onChange={handleFormChange} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth name="imageUrl" label="Image URL" value={formState.imageUrl} onChange={handleFormChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saveMutation.isLoading}>
            {saveMutation.isLoading ? 'Saving...' : 'Save Product'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!productToDelete} onClose={() => setProductToDelete(null)} maxWidth="xs">
        <DialogTitle sx={{display: 'flex', alignItems: 'center', gap: 1}}>
          <WarningAmber color="error" /> Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the product: <strong>{productToDelete?.name}</strong>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductToDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteMutation.isLoading}>
            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}