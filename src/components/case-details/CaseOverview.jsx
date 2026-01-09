import { Card } from '../ui/card';
import { Users, Calendar, Building, Scale, Clock } from 'lucide-react';

const FALLBACK_TEXT = 'Details not available yet';

export default function CaseOverview({
  plaintiff,
  defendant,
  filingDate,
  courtDate,
  court,
  judge,
  attorney,
}) {
  return (
    <Card className='p-8 shadow-md border-slate-200/60 h-[420px]' >
      <h2 className='text-2xl mb-6 text-slate-900'>Case Overview</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* LEFT */}
        <div className='space-y-6'>
          <OverviewItem icon={Users} color='blue' label='Parties'>
            <div className='flex flex-col'>
              <span>{plaintiff || FALLBACK_TEXT}</span>
              <span className='text-slate-400 text-sm my-0.5'>vs.</span>
              <span>{defendant || FALLBACK_TEXT}</span>
            </div>
          </OverviewItem>

          <OverviewItem icon={Calendar} color='purple' label='Filing Date'>
            {filingDate || FALLBACK_TEXT}
          </OverviewItem>

          <OverviewItem icon={Clock} color='orange' label='Next Court Date'>
            {courtDate || FALLBACK_TEXT}
          </OverviewItem>
        </div>

        {/* RIGHT */}
        <div className='space-y-6'>
          <OverviewItem icon={Building} color='emerald' label='Court'>
            {court || FALLBACK_TEXT}
          </OverviewItem>

          <OverviewItem icon={Scale} color='indigo' label='Judge'>
            {judge || FALLBACK_TEXT}
          </OverviewItem>

          <OverviewItem icon={Users} color='teal' label='Attorney'>
            {attorney || FALLBACK_TEXT}
          </OverviewItem>
        </div>
      </div>
    </Card>
  );
}

const COLOR_CLASSES = {
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  emerald: "from-emerald-500 to-emerald-600",
  indigo: "from-indigo-500 to-indigo-600",
  teal: "from-teal-500 to-teal-600",
};

function OverviewItem({ icon: Icon, color, label, children }) {
  return (
    <div className='flex items-start gap-4'>
     <div
        className={`bg-gradient-to-br ${
          COLOR_CLASSES[color] ?? "from-slate-500 to-slate-600"
        } p-3 rounded-xl shadow-md`}
      >
        <Icon className='w-5 h-5 text-white' />
      </div>
      <div>
        <p className='text-sm text-slate-500 mb-1'>{label}</p>
        <div className='text-slate-900 space-y-1'>{children}</div>
      </div>
    </div>
  );
}
