import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/axios';

const CreateCase = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    case_name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

   try {
      const { data } = await api.post('/api/v1/cases', {
        case_name: form.case_name,
        description: form.description,
      });

      console.log('Case created successfully:', data);
      navigate('/cases');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to create case. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <DashboardLayout title="Create Case">
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Case Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details to create a new case
          </Typography>
        </Box>

        {/* Card Body */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Case Name"
                name="case_name"
                value={form.case_name}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  pt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/cases")}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Create Case"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  </DashboardLayout>
);
};

export default CreateCase;
