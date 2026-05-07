import { ArrowUpRight, Clock, XCircle } from "lucide-react";

const OverdueTasksBanner = () => (
  <div className="bg-[#1C0D0D] border border-[#968B79]/60 rounded-2xl p-6">
    <div className="flex items-start gap-4 mb-4">
      <div className="p-2 bg-red-500/10 rounded-lg">
        <Clock className="text-red-500 w-5 h-5" />
      </div>
      <div>
        <h3 className="text-white font-bold">Overdue Tasks</h3>
        <p className="text-red-500/60 text-xs">
          2 tasks require immediate attention
        </p>
      </div>
    </div>
    <div className="space-y-2">
      {["Equipment maintenance check", "Ink supply reorder"].map((task, i) => (
        <div
          key={i}
          className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-black/40"
        >
          <div className="flex items-center gap-3">
            <XCircle className="text-red-900 w-4 h-4" />
            <span className="text-gray-300 text-sm">{task}</span>
          </div>
          <ArrowUpRight className="text-gray-700 w-4 h-4 group-hover:text-white" />
        </div>
      ))}
    </div>
  </div>
);

export default OverdueTasksBanner;
