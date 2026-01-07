// import {
//   Box,
//   Typography,
//   Paper,
//   CircularProgress,
//   Alert,
//   Stack,
//   Button,
//   Modal,
//   Grid,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import DashboardLayout from "../../components/layout/DashboardLayout";
// import api from "../../utils/axios";
// import useToast from "../../hooks/useToast";

// const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const getFileViewUrl = (fileId) =>
//   `${API_BASE_URL}/api/v1/files/${fileId}/view`;

// const sectionPaperSx = {
//   p: 2.5,
//   borderRadius: 2,
//   border: "1px solid #e5e7eb",
//   boxShadow: "none",
//   bgcolor: "#ffffff",
// };

// const ALLOWED_FILE_TYPES = [
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];

// const CaseDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const [caseData, setCaseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [openUpload, setOpenUpload] = useState(false);
// const [filesToUpload, setFilesToUpload] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState("");

//   const [files, setFiles] = useState([]);
//   const [filesLoading, setFilesLoading] = useState(false);
//   const [filesError, setFilesError] = useState("");
//   const [trainingFileId, setTrainingFileId] = useState(null);

//   // Q&A state (kept as-is)
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [asking, setAsking] = useState(false);
//   const [qaError, setQaError] = useState("");

//   const removeFileExtension = (filename = "") =>
//     filename.replace(/\.[^/.]+$/, "");

//   /* ---------------- FETCH CASE ---------------- */
//   useEffect(() => {
//     const fetchCase = async () => {
//       try {
//         const { data } = await api.get(`/api/v1/cases/${id}`);
//         setCaseData(data);
//       } catch (err) {
//         setError("Failed to load case details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCase();
//   }, [id]);

//   /* ---------------- FETCH FILES ---------------- */
//   const fetchCaseFiles = async () => {
//     setFilesLoading(true);
//     try {
//       const { data } = await api.get(`/api/v1/cases/${id}/files`);
//       setFiles(Array.isArray(data) ? data : []);
//     } catch {
//       setFilesError("Failed to load case files");
//     } finally {
//       setFilesLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCaseFiles();
//   }, [id]);

//   /* ---------------- FILE VALIDATION ---------------- */
//   const validateAndSetFile = (selectedFiles) => {
//   setUploadError("");

//   const validFiles = [];
//   for (const file of selectedFiles) {
//     if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//       setUploadError("Only PDF or DOCX files are allowed.");
//       return;
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       setUploadError("Each file must be less than 25 MB.");
//       return;
//     }

//     validFiles.push(file);
//   }

//   setFilesToUpload(validFiles);
// };


//   /* ---------------- FILE UPLOAD ---------------- */
//   const handleFileUpload = async () => {
//   if (!filesToUpload.length) return;

//   setUploading(true);
//   setUploadError("");

//   try {
//     for (const file of filesToUpload) {
//       const formData = new FormData();
//       formData.append("file", file);

//       await api.post("/api/v1/files/upload", formData, {
//         params: { case_id: id },
//       });
//     }

//     await fetchCaseFiles();
//     setOpenUpload(false);
//     setFilesToUpload([]);
//   } catch {
//     setUploadError("File upload failed");
//   } finally {
//     setUploading(false);
//   }
// };

//   const handleTrainFile = async (fileId) => {
//     try {
//       setTrainingFileId(fileId);
//       const { data } = await api.post("/api/v1/files/train", null, {
//         params: { file_id: fileId },
//       });

//       showToast(data.message || "Training started", "success");
//       setFiles((prev) =>
//         prev.map((f) => (f.id === fileId ? { ...f, processed: true } : f))
//       );
//     } catch {
//       showToast("Failed to start training", "error");
//     } finally {
//       setTrainingFileId(null);
//     }
//   };

//   const handleViewFile = async (fileId) => {
//     try {
//       await api.get(`/api/v1/files/${fileId}/view`, {
//         responseType: "blob",
//       });
//       window.open(getFileViewUrl(fileId), "_blank", "noopener,noreferrer");
//     } catch {
//       showToast("File unavailable", "error");
//     }
//   };

//   /* ---------------- ASK QUESTION ---------------- */
//   const handleAskQuestion = async () => {
//     if (!question.trim()) return;

//     setAsking(true);
//     setAnswer("");
//     setQaError("");

//     try {
//       const { data } = await api.post("/api/v1/qa/ask", {
//         case_id: Number(id),
//         question,
//       });
//       setAnswer(data.answer || "No answer returned");
//     } catch {
//       setQaError("Failed to get answer");
//     } finally {
//       setAsking(false);
//     }
//   };

//   return (
//     <DashboardLayout title="Case Details">
//       {/* Header Actions */}
//       <Stack direction="row" justifyContent="flex-end" mb={2}>
//         <Stack direction="row" spacing={1.5}>
//           <Button
//             variant="contained"
//             sx={{ height: 36, textTransform: "none" }}
//             onClick={() => setOpenUpload(true)}
//           >
//             Upload File
//           </Button>
//           <Button
//             variant="outlined"
//             sx={{ height: 36, textTransform: "none" }}
//             onClick={() => navigate("/cases")}
//           >
//             Back
//           </Button>
//         </Stack>
//       </Stack>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}

//       {/* Case Summary */}
//       {!loading && caseData && (
//         <Paper sx={sectionPaperSx}>
//           <Typography fontSize={16} fontWeight={600} mb={2}>
//             Case Summary
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <Typography fontSize={12} color="#6b7280">
//                 Case Name
//               </Typography>
//               <Typography fontSize={14} fontWeight={500}>
//                 {caseData.case_name}
//               </Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Typography fontSize={12} color="#6b7280">
//                 Case Number
//               </Typography>
//               <Typography fontSize={14}>{caseData.case_no}</Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <Typography fontSize={12} color="#6b7280">
//                 Description
//               </Typography>
//               <Typography fontSize={14}>
//                 {caseData.description || "-"}
//               </Typography>
//             </Grid>
//           </Grid>
//         </Paper>
//       )}

//       {/* Files */}
//       <Paper sx={{ ...sectionPaperSx, mt: 2 }}>
//   <Typography fontSize={16} fontWeight={600} mb={2}>
//     Case Files
//   </Typography>

//   {filesLoading && <CircularProgress size={22} />}
//   {filesError && <Alert severity="error">{filesError}</Alert>}

//   <Stack spacing={1.5}>
//     {files.map((file) => {
//       const isTrained = file.processed;

//       return (
//         <Box
//           key={file.id}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: 2,
//             py: 1.75,
//             borderRadius: 2,
//             border: "1px solid #e5e7eb",
//             bgcolor: "#ffffff",
//           }}
//         >
//           {/* File info */}
//           <Box>
//             <Typography fontSize={14.5} fontWeight={500}>
//               {removeFileExtension(file.filename)}
//             </Typography>
//             <Typography
//               fontSize={12.5}
//               color={isTrained ? "success.main" : "text.secondary"}
//             >
//               {isTrained ? "Trained" : "Not trained"}
//             </Typography>
//           </Box>

//           {/* Actions */}
//           <Stack direction="row" spacing={1}>
//             {/* View */}
//             <Button
//               size="small"
//               variant="contained"
//               onClick={() => handleViewFile(file.id)}
//               sx={{
//                 height: 32,
//                 px: 1.75,
//                 fontSize: 12.5,
//                 textTransform: "none",
//                 bgcolor: "var(--primary)",
//                 boxShadow: "none",
//                 "&:hover": {
//                   bgcolor: "var(--primary)",
//                   opacity: 0.9,
//                 },
//               }}
//             >
//               View
//             </Button>

//             {/* Train / Trained */}
//             <Button
//               size="small"
//               variant="contained"
//               disabled={isTrained || trainingFileId === file.id}
//               onClick={() => handleTrainFile(file.id)}
//               sx={{
//                 height: 34,               // 👈 slightly bigger
//                 px: 2,
//                 fontSize: 13,
//                 fontWeight: 500,
//                 textTransform: "none",
//                 bgcolor: isTrained ? "#e5e7eb" : "var(--primary)",
//                 color: isTrained ? "#374151" : "#ffffff",
//                 boxShadow: "none",
//                 "&:hover": {
//                   bgcolor: isTrained
//                     ? "#e5e7eb"
//                     : "var(--primary)",
//                   opacity: isTrained ? 1 : 0.9,
//                 },
//               }}
//             >
//               {trainingFileId === file.id
//                 ? "Starting..."
//                 : isTrained
//                 ? "Trained"
//                 : "Train"}
//             </Button>
//           </Stack>
//         </Box>
//       );
//     })}
//   </Stack>
// </Paper>


//       {/* Q&A (left untouched as requested) */}
//       <Paper sx={{ ...sectionPaperSx, mt: 2 }}>
//         <Typography fontSize={16} fontWeight={600} mb={1}>
//           Ask Case Question
//         </Typography>

//         <Typography fontSize={13} color="text.secondary" mb={1.5}>
//           Ask questions based on uploaded and trained files.
//         </Typography>

//         <Box
//           component="textarea"
//           rows={3}
//           value={question}
//           disabled={asking}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Type your question..."
//           style={{
//             width: "100%",
//             padding: "12px",
//             borderRadius: "8px",
//             border: "1px solid #cbd5f5",
//             fontSize: "14px",
//             lineHeight: "1.6",
//           }}
//         />

//         <Stack direction="row" spacing={1.5} mt={1.5}>
//           <Button
//             variant="contained"
//             onClick={handleAskQuestion}
//             disabled={asking || !question.trim()}
//           >
//             {asking ? "Analyzing..." : "Ask"}
//           </Button>
//           {asking && <CircularProgress size={20} />}
//         </Stack>

//         {qaError && <Alert severity="error">{qaError}</Alert>}

//         {answer && (
//           <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: "#f8fafc" }}>
//             <Typography fontSize={14} whiteSpace="pre-line">
//               {answer}
//             </Typography>
//           </Paper>
//         )}
//       </Paper>

//       {/* Upload Modal */}
//       <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 420,
//             bgcolor: "#ffffff",
//             borderRadius: 2,
//             border: "1px solid #e5e7eb",
//             p: 3,
//             textAlign: "center",
//           }}
//         >
//           <Typography fontSize={16} fontWeight={600} mb={1} bgcolor={"#e5e7eb"}>
//             Upload File
//           </Typography>

//           {uploadError && <Alert severity="error">{uploadError}</Alert>}

//           <input
//             type="file"
//             accept=".pdf,.docx"
//             hidden
//             id="file-upload"
//             onChange={(e) => validateAndSetFile(e.target.files[0])}
//           />

//           <label htmlFor="file-upload">
//             <Button variant="outlined" component="span" sx={{ mt: 2 }}>
//               Choose File
//             </Button>
//           </label>

//           {file && (
//             <Typography fontSize={13} mt={1}>
//               {file.name}
//             </Typography>
//           )}

//           <Stack direction="row" spacing={2} mt={3} justifyContent="center">
//             <Button
//               variant="contained"
//               onClick={handleFileUpload}
//               disabled={uploading || !file}
//             >
//               {uploading ? "Uploading..." : "Upload"}
//             </Button>
//             <Button variant="outlined" onClick={() => setOpenUpload(false)}>
//               Cancel
//             </Button>
//           </Stack>
//         </Box>
//       </Modal>
//     </DashboardLayout>
//   );
// };

// export default CaseDetails;
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Modal,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../utils/axios";
import useToast from "../../hooks/useToast";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getFileViewUrl = (fileId) =>
  `${API_BASE_URL}/api/v1/files/${fileId}/view`;

const sectionPaperSx = {
  p: 2.5,
  borderRadius: 2,
  border: "1px solid #e5e7eb",
  boxShadow: "none",
  bgcolor: "#ffffff",
};

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openUpload, setOpenUpload] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState("");
  const [trainingFileId, setTrainingFileId] = useState(null);

  // Q&A (kept as-is)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [qaError, setQaError] = useState("");

  const removeFileExtension = (filename = "") =>
    filename.replace(/\.[^/.]+$/, "");

  /* ---------------- FETCH CASE ---------------- */
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const { data } = await api.get(`/api/v1/cases/${id}`);
        setCaseData(data);
      } catch {
        setError("Failed to load case details");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  /* ---------------- FETCH FILES ---------------- */
  const fetchCaseFiles = async () => {
    setFilesLoading(true);
    try {
      const { data } = await api.get(`/api/v1/cases/${id}/files`);
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setFilesError("Failed to load case files");
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseFiles();
  }, [id]);

  /* ---------------- FILE VALIDATION (MULTI) ---------------- */
  const validateAndSetFile = (selectedFiles) => {
    setUploadError("");

    const validFiles = [];
    for (const file of selectedFiles) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setUploadError("Only PDF or DOCX files are allowed.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setUploadError("Each file must be less than 25 MB.");
        return;
      }

      validFiles.push(file);
    }

    setFilesToUpload(validFiles);
  };

  /* ---------------- FILE UPLOAD (MULTI) ---------------- */
  const handleFileUpload = async () => {
    if (!filesToUpload.length) return;

    setUploading(true);
    setUploadError("");

    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post("/api/v1/files/upload", formData, {
          params: { case_id: id },
        });
      }

      await fetchCaseFiles();
      setOpenUpload(false);
      setFilesToUpload([]);
    } catch {
      setUploadError("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleTrainFile = async (fileId) => {
    try {
      setTrainingFileId(fileId);
      const { data } = await api.post("/api/v1/files/train", null, {
        params: { file_id: fileId },
      });

      showToast(data.message || "Training started", "success");

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, processed: true } : f))
      );
    } catch {
      showToast("Failed to start training", "error");
    } finally {
      setTrainingFileId(null);
    }
  };

  const handleViewFile = async (fileId) => {
    try {
      await api.get(`/api/v1/files/${fileId}/view`, {
        responseType: "blob",
      });
      window.open(getFileViewUrl(fileId), "_blank", "noopener,noreferrer");
    } catch {
      showToast("File unavailable", "error");
    }
  };

  /* ---------------- ASK QUESTION ---------------- */
  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setAsking(true);
    setAnswer("");
    setQaError("");

    try {
      const { data } = await api.post("/api/v1/qa/ask", {
        case_id: Number(id),
        question,
      });
      setAnswer(data.answer || "No answer returned");
    } catch {
      setQaError("Failed to get answer");
    } finally {
      setAsking(false);
    }
  };

  return (
    <DashboardLayout title="Case Details">
      {/* Header Actions */}
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            sx={{
              height: 34,
              px: 2,
              fontSize: 13,
              fontWeight: 500,
              textTransform: "none",
              bgcolor: "var(--primary)",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "var(--primary)",
                opacity: 0.9,
              },
            }}
            onClick={() => setOpenUpload(true)}
          >
            Upload File
          </Button>

          <Button
            variant="contained"
            sx={{
              height: 34,
              px: 2,
              fontSize: 13,
              fontWeight: 500,
              textTransform: "none",
              bgcolor: "#e5e7eb",
              color: "#374151",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#e5e7eb",
              },
            }}
            onClick={() => navigate("/cases")}
          >
            Back
          </Button>
        </Stack>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Case Summary */}
      {!loading && caseData && (
        <Paper sx={sectionPaperSx}>
          <Typography fontSize={16} fontWeight={600} mb={2}>
            Case Summary
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography fontSize={12} color="#6b7280">
                Case Name
              </Typography>
              <Typography fontSize={14} fontWeight={500}>
                {caseData.case_name}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontSize={12} color="#6b7280">
                Case Number
              </Typography>
              <Typography fontSize={14}>{caseData.case_no}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography fontSize={12} color="#6b7280">
                Description
              </Typography>
              <Typography fontSize={14}>
                {caseData.description || "-"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Files */}
      <Paper sx={{ ...sectionPaperSx, mt: 2 }}>
        <Typography fontSize={16} fontWeight={600} mb={2}>
          Case Files
        </Typography>

        {filesLoading && <CircularProgress size={22} />}
        {filesError && <Alert severity="error">{filesError}</Alert>}

        <Stack spacing={1.5}>
          {files.map((file) => {
            const isTrained = file.processed;

            return (
              <Box
                key={file.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                  py: 1.75,
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                }}
              >
                <Box>
                  <Typography fontSize={14.5} fontWeight={500}>
                    {removeFileExtension(file.filename)}
                  </Typography>
                  <Typography
                    fontSize={12.5}
                    color={isTrained ? "success.main" : "text.secondary"}
                  >
                    {isTrained ? "Trained" : "Not trained"}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      height: 32,
                      px: 1.75,
                      fontSize: 12.5,
                      textTransform: "none",
                      bgcolor: "var(--primary)",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "var(--primary)",
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleViewFile(file.id)}
                  >
                    View
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    disabled={isTrained || trainingFileId === file.id}
                    sx={{
                      height: 34,
                      px: 2,
                      fontSize: 13,
                      fontWeight: 500,
                      textTransform: "none",
                      bgcolor: isTrained ? "#e5e7eb" : "var(--primary)",
                      color: isTrained ? "#374151" : "#ffffff",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: isTrained
                          ? "#e5e7eb"
                          : "var(--primary)",
                        opacity: isTrained ? 1 : 0.9,
                      },
                    }}
                    onClick={() => handleTrainFile(file.id)}
                  >
                    {trainingFileId === file.id
                      ? "Starting..."
                      : isTrained
                      ? "Trained"
                      : "Train"}
                  </Button>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* Q&A (unchanged) */}
      <Paper sx={{ ...sectionPaperSx, mt: 2 }}>
        <Typography fontSize={16} fontWeight={600} mb={1}>
          Ask Case Question
        </Typography>

        <Typography fontSize={13} color="text.secondary" mb={1.5}>
          Ask questions based on uploaded and trained files.
        </Typography>

        <Box
          component="textarea"
          rows={3}
          value={question}
          disabled={asking}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #cbd5f5",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        />

        <Stack direction="row" spacing={1.5} mt={1.5}>
          <Button
            variant="contained"
            onClick={handleAskQuestion}
            disabled={asking || !question.trim()}
          >
            {asking ? "Analyzing..." : "Ask"}
          </Button>
          {asking && <CircularProgress size={20} />}
        </Stack>

        {qaError && <Alert severity="error">{qaError}</Alert>}

        {answer && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: "#f8fafc" }}>
            <Typography fontSize={14} whiteSpace="pre-line">
              {answer}
            </Typography>
          </Paper>
        )}
      </Paper>

      {/* Upload Modal */}
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "#ffffff",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography fontSize={16} fontWeight={600} mb={1}>
            Upload Files
          </Typography>

          {uploadError && <Alert severity="error">{uploadError}</Alert>}

          <input
            type="file"
            accept=".pdf,.docx"
            multiple
            hidden
            id="file-upload"
            onChange={(e) => validateAndSetFile(e.target.files)}
          />

          <label htmlFor="file-upload">
            <Button variant="outlined" component="span" sx={{ mt: 2 }}>
              Choose Files
            </Button>
          </label>

          {filesToUpload.length > 0 && (
            <Stack spacing={0.5} mt={1}>
              {filesToUpload.map((f, idx) => (
                <Typography key={idx} fontSize={13}>
                  {f.name}
                </Typography>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
            <Button
              variant="contained"
              onClick={handleFileUpload}
              disabled={uploading || filesToUpload.length === 0}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
            <Button variant="outlined" onClick={() => setOpenUpload(false)}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default CaseDetails;
