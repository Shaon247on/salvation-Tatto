/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";

export const NotificationStats = ({ stats }: { stats: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {stats.map((stat, i) => (
      <div
        key={i}
        className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 min-h-35 flex flex-col justify-between"
      >
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border border-white/5",
            stat.bg,
          )}
        >
          <stat.icon size={18} className={stat.color} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
          <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
            {stat.label}
          </p>
        </div>
      </div>
    ))}
  </div>
);
