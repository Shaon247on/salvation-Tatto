/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

const LocationSummaryTable = ({ data }: { data: any[] }) => {
  // Helper to get color based on completion percentage
  const getCompletionColor = (value: number) => {
    if (value >= 80) return "text-emerald-500 bg-emerald-500";
    if (value >= 60) return "text-amber-500 bg-amber-500";
    return "text-red-500 bg-red-500";
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl overflow-hidden mt-6">
      {/* Table Header Section */}
      <div className="p-6">
        <h3 className="text-white font-bold text-lg">Location Summary</h3>
        <p className="text-gray-500 text-xs mt-1">
          Complete performance breakdown per location
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-900">
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4">Tasks Done</th>
              <th className="px-6 py-4">Completion</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4 text-right">Overdue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {data.map((loc, i) => {
              const colorClasses = getCompletionColor(loc.completion);
              const textColor = colorClasses.split(" ")[0];
              const bgColor = colorClasses.split(" ")[1];

              return (
                <tr key={i} className="hover:bg-[#0F0F0F] transition-all group">
                  {/* 1. Location with Dot */}
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div
                      className={cn("w-2.5 h-2.5 rounded-full", loc.dotColor)}
                    />
                    <span className="text-gray-300 text-sm font-medium">
                      {loc.name}
                    </span>
                  </td>

                  {/* 2. Staff Count */}
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {loc.staff}
                  </td>

                  {/* 3. Tasks Done Ratio */}
                  <td className="px-6 py-4 text-gray-300 text-sm font-medium">
                    {loc.tasksDone}
                  </td>

                  {/* 4. Completion Bar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-700",
                            bgColor,
                          )}
                          style={{ width: `${loc.completion}%` }}
                        />
                      </div>
                      <span className={cn("text-xs font-bold", textColor)}>
                        {loc.completion}%
                      </span>
                    </div>
                  </td>

                  {/* 5. Attendance Percentage */}
                  <td className="px-6 py-4 text-gray-300 text-sm font-medium">
                    {loc.attendance}%
                  </td>

                  {/* 6. Overdue Pill */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      {loc.overdue > 0 ? (
                        <span className="bg-red-500/10 text-red-500 text-[10px] px-3 py-1 rounded-full font-bold border border-red-500/20">
                          {loc.overdue} tasks
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationSummaryTable;
