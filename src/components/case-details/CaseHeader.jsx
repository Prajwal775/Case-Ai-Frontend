import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../utils/axios';

export default function CaseHeader({
  caseId,
  caseNumericId,
  status,
  priority,
  caseType,
  nextCourtDate,
}) {
  const navigate = useNavigate();

  const [pptLoading, setPptLoading] = useState(false);

  if (nextCourtDate) {
    const today = new Date();
    const courtDate = new Date(nextCourtDate);
    const diffTime = courtDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 5) {
      effectivePriority = 'High';
    } else if (diffDays <= 10) {
      effectivePriority = 'Medium';
    } else {
      effectivePriority = 'Low';
    }
  }

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    pending: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    closed: 'bg-slate-500/10 text-slate-700 border-slate-500/30',
    archived: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  };

  const priorityColors = {
    high: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    medium: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
    low: 'bg-teal-500/10 text-teal-700 border-teal-500/30',
  };
  /* ---------- PRIORITY DERIVED FROM DEADLINE ---------- */
  let effectivePriority = 'Low';
  const safePriority = priorityColors[effectivePriority]
    ? effectivePriority
    : 'low';

  /* ---------- GENERATE PPT ---------- */
  const handleGeneratePPT = async () => {
    try {
      setPptLoading(true);

      const response = await api.post(
        `/api/v1/case_ppt/cases/${caseNumericId}/generate-ppt`,
        {},
        {
          responseType: 'blob',
          headers: {
            Accept:
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          },
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `case-${caseId}.pptx`);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PPT', error);
    } finally {
      setPptLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200/60 shadow-sm'>
      <div className='max-w-7xl mx-auto px-8 py-6'>
        <div className='flex items-center justify-between'>
          {/* LEFT */}
          <div className='flex items-center gap-4'>
            <div className='bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-600/20'>
              <Gavel className='w-6 h-6 text-white' />
            </div>

            <div>
              <div className='flex items-center gap-3 mb-1'>
                <h1 className='text-2xl text-slate-900'> {caseId}</h1>

                <Badge className={`${statusColors[status]} px-3 py-1`}>
                  {status}
                </Badge>

                <Badge className={`${priorityColors[safePriority]} px-3 py-1`}>
                  {safePriority} Priority
                </Badge>
              </div>

              <p className='text-slate-600'>{caseType}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={handleGeneratePPT}
              disabled={pptLoading}
            >
              {pptLoading ? 'Generating PPT…' : 'Generate PPT'}
            </Button>

            <Button
              variant='outline'
              onClick={() => navigate('/cases')}
              className='shadow-sm'
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
