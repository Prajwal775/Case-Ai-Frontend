import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../utils/axios';

const formatDate = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString();
};

const Cases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data } = await api.get('/api/v1/cases/list-cases', {
          params: { skip: 0, limit: 10 },
        });

        setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Something went wrong while fetching cases'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <DashboardLayout title='Cases'>
      {/* Header */}
      <Stack
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        mb={3}
      >
        <Button variant='contained' onClick={() => navigate('/cases/create')}>
          Create Case
        </Button>
      </Stack>

      {/* Loading / Error */}
      {loading && <CircularProgress />}
      {error && <Alert severity='error'>{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography align='center' color='text.secondary'>
                      No cases found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <DescriptionOutlinedIcon color='primary' />
                        <Box>
                          <Typography fontWeight={500}>
                            {c.case_name}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {c.case_no}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{c.description || '-'}</TableCell>

                    <TableCell>{formatDate(c.created_at)}</TableCell>
                    <TableCell align='right'>
                      <Button
                        size='small'
                        variant='outlined'
                        onClick={() => navigate(`/cases/${c.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DashboardLayout>
  );
};

export default Cases;
