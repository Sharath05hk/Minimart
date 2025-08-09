import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

import {
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Avatar,
  useTheme,
} from '@mui/material';

import { Visibility, VisibilityOff, LockOutlined, Storefront } from '@mui/icons-material';

export default function Login() {
  const [formState, setFormState] = useState({
    email: 'admin@minimart.local',
    password: 'Admin@123',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/api/auth/login', formState);
      login(data.token, data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=60)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
          textAlign: 'center'
        }}
      >
        <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.5)', p: 3, borderRadius: 2 }}>
            <Storefront sx={{ fontSize: 60, mb: 2 }} />
            <Typography component="h1" variant="h3" fontWeight="bold">
              Minimart
            </Typography>
            <Typography variant="h6" mt={1}>
              Your streamlined inventory solution.
            </Typography>
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 4,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formState.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formState.password}
                onChange={handleInputChange}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Stack>
            <Grid container sx={{ mt: 2 }}>
              <Grid item xs>
                <RouterLink to="/forgot-password" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                  <Typography variant="body2">Forgot password?</Typography>
                </RouterLink>
              </Grid>
              <Grid item>
                  <RouterLink to="/signup" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                  <Typography variant="body2">{"Don't have an account? Sign Up"}</Typography>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}