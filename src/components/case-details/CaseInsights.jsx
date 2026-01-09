import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CircleAlert, CircleCheck, Info } from 'lucide-react';

export default function CaseInsights({ caseMetadata }) {
  const insights = [];

  const formatEvidenceText = (text) => {
    if (!text) return '';

    return text
      .replace(' and ', ', ')
      .split(',')
      .map((item) =>
        item
          .trim()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
      .join(', ');
  };

  /* ---------- STRONG EVIDENCE ---------- */
  if (caseMetadata?.strong_evidence) {
    insights.push({
      type: 'success',
      title: 'Strong Evidence',
      description: formatEvidenceText(caseMetadata.strong_evidence),
    });
  }

  /* ---------- APPROACHING DEADLINE ---------- */
  if (caseMetadata?.next_court_date) {
    const today = new Date();
    const courtDate = new Date(caseMetadata.next_court_date);
    const diffTime = courtDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      insights.push({
        type: 'warning',
        title: 'Approaching Deadline',
        description: `Discovery deadline is in ${diffDays} days.`,
      });
    }
  }

  /* ---------- FALLBACK ---------- */
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'No Critical Insights',
      description:
        'There are currently no urgent insights or risks identified for this case.',
    });
  }

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <CircleAlert className='w-5 h-5 text-orange-600' />;
      case 'success':
        return <CircleCheck className='w-5 h-5 text-emerald-600' />;
      case 'info':
      default:
        return <Info className='w-5 h-5 text-blue-600' />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/60';
      case 'success':
        return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/60';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60';
    }
  };
  
  return (
    <Card className='p-8 shadow-md border-slate-200/60 hover:shadow-lg transition-shadow'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl text-slate-900'>Case Insights Summary</h2>

        <Badge
          variant='outline'
          className='bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/60 px-4 py-1.5'
        >
          AI-Powered
        </Badge>
      </div>

      <div className='space-y-4'>
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl border ${getBgColor(
              insight.type
            )} hover:shadow-md transition-all`}
          >
            <div className='flex gap-4'>
              <div className='mt-0.5'>{getIcon(insight.type)}</div>

              <div className='flex-1'>
                <h3 className='text-slate-900 mb-2'>{insight.title}</h3>
                <p className='text-sm text-slate-600 leading-relaxed'>
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
