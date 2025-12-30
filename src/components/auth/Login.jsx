import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { login } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [checkIsAuthenticated, setCheckIsAuthenticated] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (localStorage.getItem('authToken')) {
  //     console.log('User is already authenticated, redirecting to dashboard');
  //     navigate('/dashboard');
  //   }
  //   setCheckIsAuthenticated(false);
  // }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated,loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    //   setLoading(true);
    
    //   try {
    //     const data = await login(email, password);
    //     console.log('Login success:', data);
    //     // localStorage.setItem('auth', JSON.stringify(data));
    //     localStorage.setItem('authToken', data.access_token);
    //     localStorage.setItem('refreshToken', data.refresh_token);

    //     // window.location.href = "/dashboard";
    //     navigate('/dashboard');

    //     // Example: store token

    //     // alert("Login successful");
    //   } catch (err) {
    //     setError('Invalid email or password');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // if (checkIsAuthenticated) {
    //   console.log('Checking authentication status...');
    //   return <CircularProgress />;
    // } else {

    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component='h1' variant='h5'>
          Admin Login
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            label='Email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant='body2' color='text.secondary'>
            Don't have an account?{' '}
            <Button onClick={() => navigate('/signup')} color='primary'>
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
export default Login;
