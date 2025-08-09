import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Customers from './pages/Customers';

const qc = new QueryClient();

function ProtectedRoute({ children, roles }) {
  const { user, hasRole } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.some(r => hasRole(r))) return <Navigate to="/" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProtectedRoute roles={['ADMIN','MANAGER','CASHIER']}><Products /></ProtectedRoute>} />
              <Route path="customers" element={<ProtectedRoute roles={['ADMIN','MANAGER','CASHIER']}><Customers /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute roles={['ADMIN','MANAGER','CASHIER']}><Orders /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute roles={['ADMIN','MANAGER']}><Reports /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute roles={['ADMIN']}><Users /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);