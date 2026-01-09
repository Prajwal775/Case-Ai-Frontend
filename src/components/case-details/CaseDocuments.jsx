// import { useEffect, useState } from 'react';
// import api from '../../utils/axios';
// import useToast from '../../hooks/useToast';

// import { Card } from '../ui/card';
// import { Button } from '../ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '../ui/table';
// import { Badge } from '../ui/badge';

// import { Upload, FileText, Eye, Download, Cpu } from 'lucide-react';

// const MAX_FILE_SIZE = 25 * 1024 * 1024;
// const ALLOWED_FILE_TYPES = [
//   'application/pdf',
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// ];

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function CaseDocuments({ caseId, files = [], refreshCase }) {
//   const { showToast } = useToast();

//   // const [files, setFiles] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [trainingFileId, setTrainingFileId] = useState(null);
//   // const [error, setError] = useState('');

//   const formatFileSize = (bytes) => {
//     if (!bytes) return '—';
//     return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
//   };

//   /* ---------------- FETCH FILES ---------------- */
//   // const fetchCaseFiles = async () => {
//   //   if (!caseId) return;

//   //   setLoading(true);
//   //   setError('');

//   //   try {
//   //     const { data } = await api.get(`/api/v1/cases/${caseId}/files`);
//   //     setFiles(Array.isArray(data) ? data : []);
//   //   } catch {
//   //     setError('Failed to load case documents');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchCaseFiles();
//   // }, [caseId]);

//   /* ---------------- FILE UPLOAD (MULTI) ---------------- */
//   const handleFileUpload = async (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     if (!selectedFiles.length) return;

//     for (const file of selectedFiles) {
//       if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//         showToast('Only PDF or DOCX files are allowed', 'error');
//         return;
//       }
//       if (file.size > MAX_FILE_SIZE) {
//         showToast('Each file must be under 25 MB', 'error');
//         return;
//       }
//     }

//     setUploading(true);

//     try {
//       for (const file of selectedFiles) {
//         const formData = new FormData();
//         formData.append('file', file);

//         await api.post('/api/v1/files/upload', formData, {
//           params: { case_id: caseId },
//         });
//       }

//       showToast('Files uploaded successfully', 'success');
//       await refreshCase();
//     } catch {
//       showToast('File upload failed', 'error');
//     } finally {
//       setUploading(false);
//       e.target.value = ''; // reset input
//     }
//   };

//   /* ---------------- TRAIN FILE ---------------- */
//   const handleTrainFile = async (fileId) => {
//     setTrainingFileId(fileId);

//     try {
//       await api.post('/api/v1/files/train', null, {
//         params: { file_id: fileId },
//       });

//       showToast('Embedding process started', 'success');
//       refreshCase();

//       // optimistic UI update
//       setFiles((prev) =>
//         prev.map((f) => (f.id === fileId ? { ...f, processed: true } : f))
//       );
//     } catch {
//       showToast('Failed to start training', 'error');
//     } finally {
//       setTrainingFileId(null);
//     }
//   };

//   /* ---------------- VIEW FILE ---------------- */
//   const handleViewFile = (fileId) => {
//     const url = `${API_BASE_URL}/api/v1/files/${fileId}/view`;
//     window.open(url, '_blank', 'noopener,noreferrer');
//   };

//   /* ---------------- HELPERS ---------------- */
//   const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '—');

//   /* ---------------- RENDER ---------------- */
//   return (
//     <Card className='p-8 shadow-md border-slate-200/60 hover:shadow-lg transition-shadow'>
//       {/* Header */}
//       <div className='flex items-center justify-between mb-8'>
//         <div>
//           <h2 className='text-2xl text-slate-900 mb-2'>Case Documents</h2>
//           <p className='text-sm text-slate-500'>
//             {files.length} files uploaded
//           </p>
//         </div>

//         <label className='cursor-pointer'>
//           {/* Hidden input */}
//           <input
//             id='case-doc-upload'
//             type='file'
//             multiple
//             hidden
//             onChange={handleFileUpload}
//           />
//           {/* Label triggers input */}
//           <label htmlFor='case-doc-upload'>
//             <Button
//               asChild
//               disabled={uploading}
//               className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//             >
//               <span>
//                 <Upload className='w-4 h-4 mr-2' />
//                 {uploading ? 'Uploading...' : 'Upload Documents'}
//               </span>
//             </Button>
//           </label>
//         </label>
//       </div>

//       {/* States */}
//       {loading && (
//         <div className='text-center py-10 text-slate-500'>
//           Loading documents…
//         </div>
//       )}

//       {error && <div className='text-center py-10 text-rose-600'>{error}</div>}

//       {!loading && !error && (
//         <div className='border border-slate-200 rounded-xl overflow-hidden'>
//           <Table>
//             <TableHeader>
//               <TableRow className='bg-slate-50/50'>
//                 <TableHead>Document</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Size</TableHead>
//                 <TableHead className='text-right'>Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {files.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     className='text-center py-12 text-slate-500'
//                   >
//                     No documents uploaded yet
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 files.map((file) => (
//                   <TableRow key={file.id} className='hover:bg-slate-50/50'>
//                     <TableCell>
//                       <div className='flex items-center gap-3'>
//                         <div className='bg-blue-100 p-2 rounded-lg'>
//                           <FileText className='w-4 h-4 text-blue-600' />
//                         </div>
//                         <span className='text-slate-900'>{file.filename}</span>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       {file.processed ? (
//                         <Badge className='bg-emerald-100 text-emerald-700 border-emerald-200'>
//                           Trained
//                         </Badge>
//                       ) : (
//                         <Badge className='bg-amber-100 text-amber-700 border-amber-200'>
//                           Not Trained
//                         </Badge>
//                       )}
//                     </TableCell>

//                     <TableCell className='text-slate-600'>
//                       {formatFileSize(file.file_size)}
//                     </TableCell>

//                     <TableCell className='text-right'>
//                       <div className='flex justify-end gap-1'>
//                         <Button
//                           variant='ghost'
//                           size='sm'
//                           onClick={() => handleViewFile(file.id)}
//                         >
//                           <Eye className='w-4 h-4' />
//                         </Button>

//                         {!file.processed && (
//                           <Button
//                             size='sm'
//                             disabled={trainingFileId === file.id}
//                             onClick={() => handleTrainFile(file.id)}
//                             className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
//                           >
//                             <Cpu className='w-4 h-4 mr-1' />
//                             {trainingFileId === file.id
//                               ? 'Starting...'
//                               : 'Train'}
//                           </Button>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </Card>
//   );
// }

import api from '../../utils/axios';
import useToast from '../../hooks/useToast';
import { useState } from 'react';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

import { Upload, FileText, Eye, Cpu } from 'lucide-react';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CaseDocuments({ caseId, files = [], refreshCase }) {
  const { showToast } = useToast();

  const [uploading, setUploading] = useState(false);
  const [trainingFileId, setTrainingFileId] = useState(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /* ---------------- FILE UPLOAD ---------------- */
  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    for (const file of selectedFiles) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showToast('Only PDF or DOCX files are allowed', 'error');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showToast('Each file must be under 25 MB', 'error');
        return;
      }
    }

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        await api.post('/api/v1/files/upload', formData, {
          params: { case_id: caseId },
        });
      }

      showToast('Files uploaded successfully', 'success');
      await refreshCase();
    } catch {
      showToast('File upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  /* ---------------- TRAIN FILE ---------------- */
  const handleTrainFile = async (fileId) => {
    setTrainingFileId(fileId);

    try {
      await api.post('/api/v1/files/train', null, {
        params: { file_id: fileId },
      });

      showToast('Embedding process started', 'success');
      await refreshCase();
    } catch {
      showToast('Failed to start training', 'error');
    } finally {
      setTrainingFileId(null);
    }
  };

  /* ---------------- VIEW FILE ---------------- */
  const handleViewFile = (fileId) => {
    window.open(
      `${API_BASE_URL}/api/v1/files/${fileId}/view`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <Card className='p-8 shadow-md border-slate-200/60 hover:shadow-lg transition-shadow'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-2xl text-slate-900 mb-2'>Case Documents</h2>
          <p className='text-sm text-slate-500'>
            {files.length} files uploaded
          </p>
        </div>

          <input
            id='case-doc-upload'
            type='file'
            multiple
            hidden
            onChange={handleFileUpload}
          />

          <Button
            asChild
            disabled={uploading}
            className='bg-gradient-to-r from-blue-600 to-indigo-600'
          >
            <label
              htmlFor='case-doc-upload'
              className='cursor-pointer flex items-center'
            >
              <Upload className='w-4 h-4 mr-2' />
              {uploading ? 'Uploading...' : 'Upload Documents'}
            </label>
          </Button>
      </div>

      <div className='border border-slate-200 rounded-xl overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-12'>
                  No documents uploaded yet
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <FileText className='w-4 h-4 text-blue-600' />
                      {file.filename}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge>{file.processed ? 'Trained' : 'Not Trained'}</Badge>
                  </TableCell>

                  <TableCell>{formatFileSize(file.file_size)}</TableCell>

                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleViewFile(file.id)}
                    >
                      <Eye className='w-4 h-4' />
                    </Button>

                    {!file.processed && (
                      <Button
                        size='sm'
                        disabled={trainingFileId === file.id}
                        onClick={() => handleTrainFile(file.id)}
                      >
                        <Cpu className='w-4 h-4 mr-1' />
                        Train
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
