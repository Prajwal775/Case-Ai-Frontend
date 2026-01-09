import { Card } from "../ui/card";

export default function CaseDescription({ description }) {
  return (
    <Card className="p-8 shadow-md border-slate-200/60 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl text-slate-900 mb-6">Case Description</h2>

      <div
        className={`
          min-h-[140px]
          rounded-xl
          border
          border-slate-200
          bg-slate-50/50
          p-5
          text-slate-700
          leading-relaxed
          whitespace-pre-wrap
        `}
      >
        {description && description.trim().length > 0 ? (
          description
        ) : (
          <span className="text-slate-400 italic">
            No case description has been added yet.
          </span>
        )}
      </div>
    </Card>
  );
}
