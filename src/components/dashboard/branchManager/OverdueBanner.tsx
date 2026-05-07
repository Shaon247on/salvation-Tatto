import { AlertTriangle, ArrowRight } from "lucide-react";

export default function OverdueBanner({ count }: { count: number }) {
  return (
    <div className="bg-[#1C0D0D] border border-red-900/30 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-red-900/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
          <AlertTriangle className="text-red-500 w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">
            {count} overdue tasks need attention
          </h3>
          <p className="text-red-500/60 text-xs">
            Some assigned tasks have passed their due date without completion.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
        View tasks <ArrowRight size={14} />
      </div>
    </div>
  );
}
