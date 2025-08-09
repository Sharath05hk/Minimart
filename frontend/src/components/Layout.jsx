import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar,
  Menu, MenuItem, useTheme, Tooltip
} from '@mui/material';

import {
  Dashboard, Inventory, People, ShoppingCart, Assessment, Group,
  Menu as MenuIcon, AccountCircle, Logout
} from '@mui/icons-material';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
  { text: 'Products', icon: <Inventory />, path: '/products', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
  { text: 'Customers', icon: <People />, path: '/customers', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders', roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
  { text: 'Reports', icon: <Assessment />, path: '/reports', roles: ['ADMIN', 'MANAGER'] },
  { text: 'Users', icon: <Group />, path: '/users', roles: ['ADMIN'] },
];

export default function Layout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };
  
  const availableNavItems = navItems.filter(item => item.roles.some(r => hasRole(r)));

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ my: 2, flexGrow: 1 }}>Minimart</Typography>
      </Toolbar>
      <Divider />
      <List>
        {availableNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={NavLink} to={item.path} onClick={handleDrawerToggle}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
            Minimart
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {availableNavItems.map((item) => (
              <Button
                key={item.text}
                component={NavLink}
                to={item.path}
                sx={{ 
                  color: '#fff',
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar alt={user?.fullName || 'User'} sx={{ bgcolor: 'secondary.main' }}>
                {user?.fullName ? user.fullName.charAt(0) : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1" component="div">{user?.fullName}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}