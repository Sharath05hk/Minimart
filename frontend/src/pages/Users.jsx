import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Stack,
  TextField, Button, MenuItem, Box, TableContainer, IconButton, Avatar, Chip,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Snackbar,
  Alert, Skeleton
} from '@mui/material';

import { Group, Add, Edit, Delete, WarningAmber } from '@mui/icons-material';

const fetchUsers = async () => (await api.get('/api/users')).data;

const EMPTY_FORM = { id: null, email: '', fullName: '', password: '', roles: ['CASHIER'] };
const ROLES = ['ADMIN', 'MANAGER', 'CASHIER'];

const TableLoader = ({ columns }) => (
  Array.from(new Array(5)).map((_, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from(new Array(columns)).map((_, colIndex) => (
        <TableCell key={colIndex}><Skeleton variant="text" /></TableCell>
      ))}
    </TableRow>
  ))
);

export default function Users() {
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: users = [], isLoading, isError } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

  const saveUserMutation = useMutation({
    mutationFn: (user) => user.id ? api.put(`/api/users/${user.id}`, user) : api.post('/api/users', user),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['users']);
      setIsFormOpen(false);
      setSnackbar({ open: true, message: `User ${variables.id ? 'updated' : 'created'} successfully!`, severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.response?.data?.message || 'An error occurred.', severity: 'error' });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setUserToDelete(null);
      setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete user.', severity: 'error' });
    }
  });

  const handleOpenForm = (user = null) => {
    const initialFormState = user ? { ...user, password: '' } : EMPTY_FORM;
    setFormState(initialFormState);
    setIsFormOpen(true);
  };
  
  const handleSaveUser = () => {
    const payload = { ...formState };
    if (!payload.password) delete payload.password;
    saveUserMutation.mutate(payload);
  };
  
  const handleDeleteConfirm = () => {
    if (userToDelete) deleteUserMutation.mutate(userToDelete.id);
  };

  const getRoleColor = (role) => ({
    'ADMIN': 'error',
    'MANAGER': 'warning',
    'CASHIER': 'info'
  }[role] || 'default');

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Group color="primary" />
            <Typography variant="h6" component="h1">User Management</Typography>
          </Stack>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
            Add User
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }}>&nbsp;</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableLoader columns={4} />
              ) : isError ? (
                 <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}><Alert severity="error">Failed to load users.</Alert></TableCell></TableRow>
              ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}><Typography color="text.secondary">No users found.</Typography></TableCell></TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell><Avatar sx={{ bgcolor: 'primary.light' }}>{u.fullName.charAt(0)}</Avatar></TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">{u.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {u.roles.map(role => <Chip key={role} label={role} color={getRoleColor(role)} size="small" />)}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit User"><IconButton onClick={() => handleOpenForm(u)}><Edit /></IconButton></Tooltip>
                      <Tooltip title="Delete User"><IconButton color="error" onClick={() => setUserToDelete(u)}><Delete /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formState.id ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Full Name" name="fullName" value={formState.fullName} onChange={(e) => setFormState({...formState, fullName: e.target.value})} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email Address" name="email" type="email" value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password" name="password" type="password" placeholder={formState.id ? 'Leave blank to keep current password' : ''} onChange={(e) => setFormState({...formState, password: e.target.value})} /></Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Role" value={formState.roles[0]} onChange={(e) => setFormState({...formState, roles:[e.target.value]})}>
                {ROLES.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser} disabled={saveUserMutation.isLoading}>
            {saveUserMutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!userToDelete} onClose={() => setUserToDelete(null)} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WarningAmber color="error" />Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete user: <strong>{userToDelete?.fullName}</strong>?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setUserToDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteUserMutation.isLoading}>
              {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}