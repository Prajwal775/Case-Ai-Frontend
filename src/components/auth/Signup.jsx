import { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth.api';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
  //   try {
  //     // 🔌 API call goes here later
  //     console.log('Signup payload:', form);
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(form),
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       setError(data.message || 'Signup failed. Please try again.');
  //       return;
  //     }
  //     console.log('Signup successful:', data);
  //     // Temporary success redirect
  //     navigate('/login');
  //   } catch (err) {
  //     setError('Signup failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  try {
      await signup({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ mb: 1, bgcolor: 'primary.main' }}>
              <PersonAddAltIcon />
            </Avatar>

            <Typography component='h1' variant='h5' fontWeight={600}>
              Create Account
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Sign up to access the dashboard
            </Typography>

            {error && (
              <Alert severity='error' sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: '100%' }}
            >
              <TextField
                fullWidth
                label='Full Name'
                name='full_name'
                margin='normal'
                value={form.full_name}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label='Email Address'
                name='email'
                margin='normal'
                value={form.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label='Password'
                name='password'
                type='password'
                margin='normal'
                value={form.password}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label='Confirm Password'
                name='confirmPassword'
                type='password'
                margin='normal'
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, py: 1.2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Button
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign in
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
