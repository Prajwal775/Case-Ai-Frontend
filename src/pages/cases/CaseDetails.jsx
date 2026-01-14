import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios';

import CaseHeader from '../../components/case-details/CaseHeader';
import CaseOverview from '../../components/case-details/CaseOverview';
import CaseDeadlines from '../../components/case-details/CaseDeadlines';
import CaseInsights from '../../components/case-details/CaseInsights';
import CaseDescription from '../../components/case-details/CaseDescription';
import CaseDocuments from '../../components/case-details/CaseDocuments';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCase = async () => {
    setLoading(true);
    const { data } = await api.get(`/api/v1/cases/${id}`);
    setCaseData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  if (loading) return null;

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* HEADER */}
      <CaseHeader
        caseId={caseData?.case_no}
        caseNumericId={id}
        status={caseData?.status}
        priority={caseData?.priority}
        caseType={caseData?.case_type}
      />

      {/* CONTENT */}
      <div className='max-w-7xl mx-auto px-8 py-8 space-y-8'>
        {/* OVERVIEW + DEADLINES */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch'>
          {/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch'> */}
          <div className='lg:col-span-2'>
            <CaseOverview
              plaintiff={
                caseData.case_metadata?.parties
                  ? caseData.case_metadata.parties.split(' vs ')[0]
                  : null
              }
              defendant={
                caseData.case_metadata?.parties
                  ? caseData.case_metadata.parties.split(' vs ')[1]
                  : null
              }
              filingDate={
                caseData.created_at
                  ? new Date(caseData.created_at).toLocaleDateString()
                  : '—'
              }
              courtDate={
                caseData.case_metadata?.next_court_date
                  ? new Date(
                      caseData.case_metadata.next_court_date
                    ).toLocaleDateString()
                  : null
              }
              court={caseData.case_metadata?.court_name || null}
              judge={caseData.case_metadata?.judge || null}
              attorney={caseData.case_metadata?.attorney || null}
            />
          </div>

          <div className='lg:col-span-1'>
            <CaseDeadlines />
          </div>
        </div>

        {/* INSIGHTS */}
        <CaseInsights caseMetadata={caseData?.case_metadata} />

        {/* DESCRIPTION */}
        <CaseDescription
          description={caseData?.case_metadata?.case_description}
        />

        <CaseDocuments
          caseId={id}
          files={caseData.files || []}
          refreshCase={fetchCase}
        />

        {/* NEXT */}
        {/* <CaseDocuments /> */}

        {/* <CaseTabs /> */}
      </div>
    </div>
  );
}
