import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Modal,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/axios';
import useToast from '../../hooks/useToast';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getFileViewUrl = (fileId) =>
  `${API_BASE_URL}/api/v1/files/${fileId}/view`;

const formatDate = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString();
};

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Case state
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload modal state
  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  //File details state
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState('');

  //file train state
  const [trainingFileId, setTrainingFileId] = useState(null);

  // ---------------- CASE Q&A STATE ----------------
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const [qaError, setQaError] = useState('');

  const removeFileExtension = (filename = '') =>
    filename.replace(/\.[^/.]+$/, '');

  // ---------------- FETCH CASE DETAILS ----------------
  useEffect(() => {
    const fetchCaseById = async () => {
      try {
        const { data } = await api.get(`/api/v1/cases/${id}`);
        setCaseData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load case details');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseById();
  }, [id]);

  // ---------------- FETCH CASE FILES (REUSABLE) ----------------
  const fetchCaseFiles = async () => {
    setFilesLoading(true);
    setFilesError('');

    try {
      const { data } = await api.get(`/api/v1/cases/${id}/files`);
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setFilesError(err.response?.data?.message || 'Failed to load case files');
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseFiles();
  }, [id]);

  // ---------------- FILE VALIDATION ----------------
  const validateAndSetFile = (selectedFile) => {
    setUploadError('');

    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError('File size must be less than 25 MB.');
      return;
    }

    setFile(selectedFile);
  };

  // ---------------- DRAG & DROP HANDLERS ----------------
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  //
  const handleTrainFile = async (fileId) => {
    try {
      setTrainingFileId(fileId);

      const { data } = await api.post('/api/v1/files/train', null, {
        params: { file_id: fileId },
      });

      // Success toast from backend message
      showToast(data.message || 'Training started', 'success');

      // Optimistically update UI
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, processed: true } : f))
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Failed to start training';

      showToast(message, 'error');
    } finally {
      setTrainingFileId(null);
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = async () => {
    if (!file) {
      setUploadError('Please select a valid PDF file.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      await api.post('/api/v1/files/upload', formData, {
        params: { case_id: id },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchCaseFiles();

      setOpenUpload(false);
      setFile(null);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleViewFile = async (fileId) => {
    try {
      // Lightweight check (GET or HEAD)
      await api.get(`/api/v1/files/${fileId}/view`, {
        responseType: 'blob',
      });

      // If no error → open in new tab
      window.open(getFileViewUrl(fileId), '_blank', 'noopener,noreferrer');
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'File is missing or unavailable';

      showToast(message, 'error');
    }
  };
  // ---------------- ASK CASE QUESTION ----------------
  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setAsking(true);
    setQaError('');
    setAnswer('');

    try {
      const { data } = await api.post('/api/v1/qa/ask', {
        case_id: Number(id),
        question,
      });

      setAnswer(data.answer || 'No answer returned');
    } catch (err) {
      setQaError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          'Failed to get answer'
      );
    } finally {
      setAsking(false);
    }
  };

  return (
    <DashboardLayout title='Case Details'>
      {/* Header */}
      <Stack direction='row' justifyContent='flex-end' mb={2}>
        {/* <Typography variant='h5'>Case Details</Typography> */}

        <Stack direction='row' spacing={2}>
          <Button variant='outlined' onClick={() => setOpenUpload(true)}>
            Upload File
          </Button>

          <Button variant='outlined' onClick={() => navigate('/cases')}>
            Back
          </Button>
        </Stack>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity='error'>{error}</Alert>}

      {!loading && !error && caseData && (
        <Paper sx={{ p: 2.5 }}>
          <Stack spacing={1}>
            <Typography>
              <strong>Case Name:</strong> {caseData.case_name}
            </Typography>

            <Typography>
              <strong>Case Number:</strong> {caseData.case_no}
            </Typography>

            <Typography>
              <strong>Description:</strong> {caseData.description || '-'}
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* ---------------- CASE FILES ---------------- */}
      <Paper sx={{ p: 2, mt: 1 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h6' fontWeight={600}>
            Case Files
          </Typography>
        </Stack>

        {filesLoading && <CircularProgress size={24} />}

        {filesError && <Alert severity='error'>{filesError}</Alert>}

        {!filesLoading && !filesError && files.length === 0 && (
          <Typography variant='body2' color='text.secondary'>
            No files uploaded for this case yet.
          </Typography>
        )}

        {!filesLoading && !filesError && files.length > 0 && (
          <Stack spacing={1}>
            {files.map((file) => {
              const isTrained = file.processed;

              return (
                <Box
                  key={file.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    border: '1px solid #e5e7eb',
                    borderRadius: 1,
                  }}
                >
                  {/* File info */}
                  <Box>
                    <Typography fontSize={14} fontWeight={500}>
                      {removeFileExtension(file.filename)}
                    </Typography>

                    <Typography
                      fontSize={12}
                      color={isTrained ? 'success.main' : 'text.secondary'}
                    >
                      {isTrained ? 'Trained' : 'Not trained'}
                    </Typography>
                  </Box>

                  {/* Per-file Train button */}
                  <Stack direction='row' spacing={1}>
                    {/* View File */}
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => handleViewFile(file.id)}
                    >
                      View
                    </Button>

                    {/* Train File */}
                    <Button
                      size='small'
                      variant={isTrained ? 'outlined' : 'contained'}
                      disabled={isTrained || trainingFileId === file.id}
                      //   onClick={() => {
                      //     console.log('Train file ID:', file.id);
                      //   }}
                      // >
                      //   {isTrained ? 'Trained' : 'Train'}
                      onClick={() => handleTrainFile(file.id)}
                    >
                      {trainingFileId === file.id
                        ? 'Starting...'
                        : isTrained
                        ? 'Trained'
                        : 'Train'}
                    </Button>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Paper>

      {/* ---------------- CASE Q&A ---------------- */}
      <Paper sx={{ p: 1.5, mt: 1 }}>
        <Stack spacing={1}>
          <Typography variant='h6' fontWeight={600}>
            Ask Case Question
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Ask questions based on uploaded and trained case files.
          </Typography>

          <Box
            component='textarea'
            rows={3}
            value={question}
            disabled={asking}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='e.g. What were the crime scene observations?'
            style={{
              width: '100%',
              boxSizing: 'border-box', 
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #cbd5f5',
              fontFamily: 'inherit',
              fontSize: '16px',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
            }}
          />

          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Button
              variant='contained'
              onClick={handleAskQuestion}
              disabled={asking || !question.trim()}
            >
              {asking ? 'Analyzing...' : 'Ask'}
            </Button>

            {asking && <CircularProgress size={20} />}
          </Stack>

          {qaError && <Alert severity='error'>{qaError}</Alert>}

          {answer && (
            <Paper variant='outlined' sx={{ p: 2, bgcolor: '#f8fafc' }}>
              <Typography variant='body2' whiteSpace='pre-line'>
                {answer}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>

      {/* ---------------- UPLOAD MODAL ---------------- */}
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            border: '2px dashed #94a3b8',
            cursor: 'pointer',
          }}
        >
          <Typography variant='h6' mb={1}>
            Upload PDF File
          </Typography>

          <Typography variant='body2' color='text.secondary' mb={2}>
            Drag & drop a PDF here, or click to browse (Max size: 25 MB)
          </Typography>

          {uploadError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          <input
            type='file'
            accept='application/pdf'
            style={{ display: 'none' }}
            id='file-upload'
            onChange={(e) => validateAndSetFile(e.target.files[0])}
          />

          <label htmlFor='file-upload'>
            <Button variant='outlined' component='span'>
              Choose File
            </Button>
          </label>

          {file && (
            <Typography mt={2} fontSize={14}>
              Selected: <strong>{file.name}</strong>
            </Typography>
          )}

          <Stack direction='row' spacing={2} mt={3} justifyContent='center'>
            <Button
              variant='contained'
              onClick={handleFileUpload}
              disabled={uploading || !file}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>

            <Button
              variant='outlined'
              onClick={() => setOpenUpload(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default CaseDetails;
