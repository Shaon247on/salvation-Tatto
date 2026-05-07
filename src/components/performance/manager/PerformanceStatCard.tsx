// import { cn } from "@/lib/utils";

// const PerformanceStatCard = ({
//   location,
//   percentage,
//   color,
// }: {
//   location: string;
//   percentage: number;
//   color: string;
// }) => (
//   <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 flex flex-col gap-4 flex-1 min-w-60">
//     <div className="flex items-center gap-2">
//       <div className={cn("w-2 h-2 rounded-full", color)} />
//       <span className="text-gray-500 text-xs font-medium">{location}</span>
//     </div>
//     <h2 className="text-3xl font-bold text-white tracking-tight">
//       {percentage}%
//     </h2>
//     <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
//       Task completion
//     </p>
//     <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full mt-2">
//       <div
//         className={cn("h-full rounded-full transition-all duration-500", color)}
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   </div>
// );

// export default PerformanceStatCard;

interface PerformanceStatCardProps {
  location: string;
  percentage: number;
  color: string;
}

const PerformanceStatCard = ({
  location,
  percentage,
  color,
}: PerformanceStatCardProps) => {
  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 h-40 flex flex-col justify-between transition-all hover:border-[#968B79]">
      {/* Top Section: Dot + Location */}
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-gray-400 text-xs font-medium tracking-wide">
          {location}
        </p>
      </div>

      {/* Middle Section: Percentage */}
      <div className="mt-2">
        <h2 className="text-4xl font-bold text-white tracking-tight">
          {percentage}%
        </h2>
      </div>

      {/* Bottom Section: Label + Progress Bar */}
      <div className="space-y-3">
        <p className="text-gray-500 text-[11px] font-medium">Task completion</p>

        {/* Progress Track */}
        <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceStatCard;
