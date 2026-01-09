import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, Calendar } from "lucide-react";

export default function CaseDeadlines() {
  const deadlines = [
    { id: "1", title: "Discovery Deadline", date: "Jan 20, 2026", daysRemaining: 14, priority: "high" },
    { id: "2", title: "Expert Witness Disclosure", date: "Jan 28, 2026", daysRemaining: 22, priority: "high" },
    { id: "3", title: "Motion Filing Deadline", date: "Feb 10, 2026", daysRemaining: 35, priority: "medium" },
    { id: "4", title: "Pre-Trial Brief Due", date: "Mar 1, 2026", daysRemaining: 54, priority: "medium" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getDaysRemainingColor = (days) => {
    if (days <= 7) return "text-rose-600";
    if (days <= 14) return "text-orange-600";
    return "text-slate-600";
  };

  return (
    <Card className="p-8 shadow-md border-slate-200/60 h-[420px] flex flex-col">
      {/* HEADER */}
      <h2 className="text-2xl mb-6 text-slate-900">
        Upcoming Deadlines
      </h2>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {deadlines.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-slate-900">{d.title}</h3>
              <Badge variant="outline" className={getPriorityColor(d.priority)}>
                {d.priority}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>{d.date}</span>
              </div>

              <div
                className={`flex items-center gap-2 ${getDaysRemainingColor(
                  d.daysRemaining
                )}`}
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {d.daysRemaining} days remaining
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
