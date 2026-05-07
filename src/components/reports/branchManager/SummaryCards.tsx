import { CheckCircle2, AlertCircle, TrendingUp, Calendar } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  type: "completed" | "overdue" | "in-progress" | "attendance";
}

export default function PerformanceSummaryCard({
  label,
  value,
  subtitle,
  type,
}: SummaryCardProps) {
  const icons = {
    completed: <CheckCircle2 className="text-emerald-500 w-4 h-4" />,
    overdue: <AlertCircle className="text-red-500 w-4 h-4" />,
    "in-progress": <TrendingUp className="text-blue-500 w-4 h-4" />,
    attendance: <Calendar className="text-purple-500 w-4 h-4" />,
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-5 flex-1 min-w-50">
      <div className="flex items-center gap-2 mb-4">
        {icons[type]}
        <span className="text-gray-400 text-xs font-medium">{label}</span>
      </div>
      <h2 className="text-3xl font-bold text-white mb-1">{value}</h2>
      <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
        {subtitle}
      </p>
    </div>
  );
}
