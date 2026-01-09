// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Paper,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import DashboardLayout from "../../components/layout/DashboardLayout";
// import api from "../../utils/axios";
// import { createCaseSchema } from "../../validation/case.schema";
// import { getYupErrors } from "../../utils/yupErrors";

// const MAX_FILE_SIZE = 25 * 1024 * 1024;

// const ALLOWED_FILE_TYPES = [
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];

// const CreateCase = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     case_name: "",
//   });

//   const [file, setFile] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});

//   /* ---------------- VALIDATION ---------------- */
//   const validateForm = async (values) => {
//     try {
//       await createCaseSchema.validate(values, { abortEarly: false });
//       setFieldErrors({});
//       return true;
//     } catch (err) {
//       setFieldErrors(getYupErrors(err));
//       return false;
//     }
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;

//     const updatedForm = {
//       ...form,
//       [name]: value,
//     };

//     setForm(updatedForm);
//     await validateForm(updatedForm);
//   };

//   /* ---------------- FILE VALIDATION ---------------- */
//   const handleFileSelect = (selectedFile) => {
//     setError("");

//     if (!selectedFile) return;

//     if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
//       setError("Only PDF or DOCX files are allowed.");
//       return;
//     }

//     if (selectedFile.size > MAX_FILE_SIZE) {
//       setError("File size must be less than 25 MB.");
//       return;
//     }

//     setFile(selectedFile);
//   };

//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const isValid = await validateForm(form);
//     if (!isValid) return;

//     setError("");
//     setLoading(true);

//     try {
//       /* 1️⃣ CREATE CASE */
//       const { data } = await api.post("/api/v1/cases", {
//         case_name: form.case_name,
//         description: "",
//       });

//       const caseId = data.id;

//       /* 2️⃣ UPLOAD FILE (OPTIONAL) */
//       if (file) {
//         const formData = new FormData();
//         formData.append("file", file);

//         await api.post("/api/v1/files/upload", formData, {
//           params: { case_id: caseId },
//         });
//       }

//       /* 3️⃣ NAVIGATE */
//       navigate(`/cases/${caseId}`);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to create case. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout title="Create Case">
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <Paper
//           sx={{
//             width: "100%",
//             maxWidth: 600,
//             borderRadius: 3,
//             border: "1px solid #e5e7eb",
//             boxShadow: "none",
//           }}
//         >
//           {/* Header */}
//           <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #e5e7eb" }}>
//             <Typography fontSize={18} fontWeight={600}>
//               Create Case
//             </Typography>
//             <Typography fontSize={13} color="text.secondary">
//               Create a new case and optionally upload a file
//             </Typography>
//           </Box>

//           {/* Body */}
//           <Box sx={{ p: 3 }}>
//             {error && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <Box component="form" onSubmit={handleSubmit}>
//               <Stack spacing={3}>
//                 {/* Case Name */}
//                 <TextField
//                   label="Case Name"
//                   name="case_name"
//                   value={form.case_name}
//                   onChange={handleChange}
//                   required
//                   fullWidth
//                   error={Boolean(fieldErrors.case_name)}
//                   helperText={`${form.case_name.length}/50 ${
//                     fieldErrors.case_name || ""
//                   }`}
//                   inputProps={{ maxLength: 50 }}
//                 />

//                 {/* File Upload */}
//                 <Box>
//                   <Typography fontSize={13} color="#6b7280" mb={0.5}>
//                     Upload File (Optional)
//                   </Typography>

//                   <Button
//                     variant="outlined"
//                     component="label"
//                     sx={{ textTransform: "none" }}
//                   >
//                     Choose File
//                     <input
//                       type="file"
//                       hidden
//                       accept=".pdf,.docx"
//                       onChange={(e) =>
//                         handleFileSelect(e.target.files[0])
//                       }
//                     />
//                   </Button>

//                   {file && (
//                     <Typography fontSize={13} mt={1}>
//                       Selected: <strong>{file.name}</strong>
//                     </Typography>
//                   )}
//                 </Box>

//                 {/* Actions */}
//                 <Stack
//                   direction="row"
//                   justifyContent="flex-end"
//                   spacing={2}
//                 >
//                   <Button
//                     variant="outlined"
//                     onClick={() => navigate("/cases")}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     disabled={
//                       loading || Object.keys(fieldErrors).length > 0
//                     }
//                   >
//                     {loading ? (
//                       <CircularProgress size={20} />
//                     ) : (
//                       "Create Case"
//                     )}
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </DashboardLayout>
//   );
// };

// export default CreateCase;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { createCaseSchema } from '../../validation/case.schema';
import { getYupErrors } from '../../utils/yupErrors';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

import { Gavel, Upload, FileText, X, ArrowLeft, Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const CreateCase = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ case_name: '' });
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  /* ---------------- VALIDATION ---------------- */
  const validateForm = async (values) => {
    try {
      await createCaseSchema.validate(values, { abortEarly: false });
      setFieldErrors({});
      return true;
    } catch (err) {
      setFieldErrors(getYupErrors(err));
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    await validateForm(updated);
  };

  /* ---------------- FILE ---------------- */
  const handleFileSelect = (selectedFile) => {
    setError('');

    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setError('Only PDF or DOCX files are allowed.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 25 MB.');
      return;
    }

    setFile(selectedFile);
  };

  /* ---------------- SUBMIT ---------------- */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const isValid = await validateForm(form);
  //   if (!isValid || !file) {
  //     if (!file) setError("A case document is required.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const { data } = await api.post("/api/v1/cases", {
  //       case_name: form.case_name,
  //       description: "",
  //     });

  //     const caseId = data.id;

  //     const formData = new FormData();
  //     formData.append("case_name", form.case_name);

  //     formData.append("file", file);

  //     await api.post("/api/v1/files/upload", formData, {
  //       params: { case_id: caseId },
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     navigate(`/cases/${caseId}`);
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message ||
  //         "Failed to create case. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = await validateForm(form);
  if (!isValid) return;

  if (!file) {
    setError("A case document is required.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("case_name", form.case_name);
    formData.append("file", file); // 🔑 REQUIRED

    const { data } = await api.post(
      "/api/v1/cases",
      formData
      // ❌ DO NOT set Content-Type manually
    );

    navigate(`/cases/${data.id}`);
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to create case. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'>
      {/* Header */}
      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200/60 shadow-sm'>
        <div className='max-w-4xl mx-auto px-8 py-8'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              onClick={() => navigate('/cases')}
              className='hover:bg-slate-100'
            >
              <ArrowLeft className='w-4 h-4 mr-1' />
              Back
            </Button>

            <div className='bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-600/20'>
              <Gavel className='w-6 h-6 text-white' />
            </div>

            <div>
              <h1 className='text-3xl text-slate-900 mb-1'>Create Case</h1>
              <p className='text-slate-600'>
                Register a new legal case and upload the primary document
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-8 py-10'>
        <Card className='shadow-lg border-slate-200/60'>
          <form onSubmit={handleSubmit} className='p-8 space-y-8'>
            {/* Error */}
            {error && (
              <div className='border border-rose-200 bg-rose-50 text-rose-700 rounded-lg px-4 py-3 text-sm'>
                {error}
              </div>
            )}

            {/* Case Name */}
            <div>
              <label className='block text-sm text-slate-600 mb-2'>
                Case Name <span className='text-rose-500'>*</span>
              </label>
              <Input
                name='case_name'
                value={form.case_name}
                onChange={handleChange}
                placeholder='e.g. Acme Corp vs Global Tech'
                className='py-6 text-base'
                maxLength={50}
              />
              <div className='flex justify-between text-xs mt-1'>
                <span className='text-rose-600'>{fieldErrors.case_name}</span>
                <span className='text-slate-500'>
                  {form.case_name.length}/50
                </span>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className='block text-sm text-slate-600 mb-2'>
                Case Document <span className='text-rose-500'>*</span>
              </label>

              <div className='border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/50'>
                {!file ? (
                  <label className='flex flex-col items-center justify-center gap-3 cursor-pointer'>
                    <Upload className='w-8 h-8 text-slate-400' />
                    <p className='text-sm text-slate-600'>
                      Click to upload PDF or DOCX
                    </p>
                    <p className='text-xs text-slate-400'>Max size 25MB</p>
                    <input
                      type='file'
                      hidden
                      accept='.pdf,.docx'
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                  </label>
                ) : (
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <FileText className='w-6 h-6 text-blue-600' />
                      <div>
                        <p className='text-sm text-slate-900 font-medium'>
                          {file.name}
                        </p>
                        <p className='text-xs text-slate-500'>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => setFile(null)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-3 pt-4 border-t border-slate-200'>
              <Button
                type='button'
                variant='outline'
                disabled={loading}
                onClick={() => navigate('/cases')}
              >
                Cancel
              </Button>

              <Button
                type='submit'
                disabled={loading}
                className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Creating…
                  </>
                ) : (
                  'Create Case'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCase;
