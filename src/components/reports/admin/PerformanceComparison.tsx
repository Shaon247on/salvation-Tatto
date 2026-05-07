/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";

// export const PerformanceComparison = ({
//   title,
//   data,
//   type,
// }: {
//   title: string;
//   data: any[];
//   type: "attendance" | "task";
// }) => (
//   <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-6 h-full">
//     <h3 className="text-white font-bold mb-6">{title}</h3>
//     <div className="space-y-8">
//       {data.map((item, i) => (
//         <div key={i} className="space-y-2">
//           <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
//             <span className="text-gray-400">{item.name}</span>
//             <span className="text-gray-500">
//               {item.subValue}{" "}
//               <span
//                 className={cn(
//                   item.percent >= 90
//                     ? "text-emerald-500"
//                     : item.percent >= 80
//                       ? "text-blue-400"
//                       : "text-amber-500",
//                 )}
//               >
//                 {item.percent}%
//               </span>
//             </span>
//           </div>
//           <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
//             <div
//               className={cn(
//                 "h-full rounded-full transition-all duration-1000",
//                 item.color,
//               )}
//               style={{ width: `${item.percent}%` }}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

export const PerformanceComparison = ({
  title,
  data,
  type,
}: {
  title: string;
  data: any[];
  type: "attendance" | "task";
}) => (
  <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6 h-full">
    <h3 className="text-white font-bold mb-6">{title}</h3>
    <div className="space-y-8">
      {data.map((item, i) => {
        // Map API keys to local UI variables
        const name = item.location_name;
        const percent =
          type === "attendance" ? item.attendance_rate : item.completion_rate;
        const subLabel =
          type === "attendance"
            ? `${item.staff_count} staff`
            : `${item.total_tasks} tasks`;

        return (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
              <span className="text-gray-400">{name}</span>
              <span className="text-gray-500">
                {subLabel}{" "}
                <span
                  className={cn(
                    percent >= 90
                      ? "text-emerald-500"
                      : percent >= 80
                        ? "text-blue-400"
                        : "text-amber-500",
                  )}
                >
                  {percent}
                </span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  type === "attendance" ? "bg-blue-500" : "bg-emerald-500",
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
