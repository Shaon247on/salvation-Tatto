/* eslint-disable @typescript-eslint/no-explicit-any */
// export const TaskStatus = ({ data }: { data: any[] }) => (
//   <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 h-full">
//     <div className="mb-6">
//       <h3 className="text-white font-bold text-lg">Task Status</h3>
//       <p className="text-gray-500 text-xs mt-1">Current sprint</p>
//     </div>

import { cn } from "@/lib/utils";

//     {/* Horizontal Progress */}
//     <div className="space-y-4 mb-8">
//       {[
//         { label: "Pending", val: "6/10", color: "bg-amber-500", width: "60%" },
//         {
//           label: "Approved",
//           val: "2/10",
//           color: "bg-emerald-500",
//           width: "20%",
//         },
//         { label: "Rejected", val: "2/10", color: "bg-red-500", width: "20%" },
//       ].map((item) => (
//         <div key={item.label} className="space-y-1">
//           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
//             <span>{item.label}</span>
//             <span className="text-gray-300">{item.val}</span>
//           </div>
//           <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
//             <div
//               className={`h-full ${item.color} rounded-full`}
//               style={{ width: item.width }}
//             />
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* Location Breakdown */}
//     <div className="flex items-end justify-between h-32 px-2">
//       {data.map((loc) => (
//         <div
//           key={loc.name}
//           className="flex flex-col items-center gap-2 group cursor-help"
//         >
//           <div className="flex gap-1 items-end h-24">
//             <div
//               className="w-3 bg-emerald-500 rounded-t-sm"
//               style={{ height: `${loc.approved}%` }}
//             />
//             <div
//               className="w-3 bg-amber-500 rounded-t-sm"
//               style={{ height: `${loc.pending}%` }}
//             />
//             <div
//               className="w-3 bg-red-500 rounded-t-sm"
//               style={{ height: `${loc.rejected}%` }}
//             />
//           </div>
//           <span className="text-[10px] text-gray-600 font-bold uppercase">
//             {loc.name}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

export const TaskStatus = ({
  summary,
  locationData,
}: {
  summary: any;
  locationData: any[];
}) => {
  // Calculate percentage for the bars
  const getWidth = (val: number) =>
    summary.total > 0 ? (val / summary.total) * 100 : 0;

  const statusItems = [
    {
      label: "Pending",
      val: `${summary.pending}/${summary.total}`,
      color: "bg-amber-500",
      width: `${getWidth(summary.pending)}%`,
    },
    {
      label: "Approved",
      val: `${summary.approved}/${summary.total}`,
      color: "bg-emerald-500",
      width: `${getWidth(summary.approved)}%`,
    },
    {
      label: "Rejected",
      val: `${summary.rejected}/${summary.total}`,
      color: "bg-red-500",
      width: `${getWidth(summary.rejected)}%`,
    },
  ];

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Task Status</h3>
        <p className="text-gray-500 text-xs mt-1">Current status overview</p>
      </div>

      <div className="space-y-4 mb-8">
        {statusItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#7F7F81]">
              <span className="">{item.label}</span>
              <span className="text-gray-300">{item.val}</span>
            </div>
            <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", item.color)}
                style={{ width: item.width }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Location Breakdown */}
      <div className="flex items-end justify-between h-32 px-2 overflow-x-auto gap-2">
        {locationData.map((loc) => {
          const total = loc.pending + loc.approved + loc.rejected || 1; // avoid divide by zero
          return (
            <div
              key={loc.location_id}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="flex gap-1 items-end h-24">
                <div
                  className="w-2 bg-emerald-500 rounded-t-sm"
                  style={{ height: `${(loc.approved / total) * 100}%` }}
                />
                <div
                  className="w-2 bg-amber-500 rounded-t-sm"
                  style={{ height: `${(loc.pending / total) * 100}%` }}
                />
                <div
                  className="w-2 bg-red-500 rounded-t-sm"
                  style={{ height: `${(loc.rejected / total) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-white font-bold uppercase">
                {loc.location_name.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
