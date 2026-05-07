import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  progressData?: { color: string; percent: number }[]; // For the attendance bar
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  progressData,
}: StatCardProps) {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 flex-1 min-w-75">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-white">{value}</h2>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBg,
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      <p className="text-gray-500 text-xs mb-4">{subtitle}</p>

      {progressData && (
        <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-1 mt-2">
          {progressData.map((segment, i) => (
            <div
              key={i}
              className={segment.color}
              style={{ width: `${segment.percent}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
