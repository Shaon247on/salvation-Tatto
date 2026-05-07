/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

const AttendanceDetailView = ({ data }: { data: any }) => {
  const stats = [
    {
      label: "Total Present",
      value: data.stats.total_present,
      color: "text-emerald-500",
    },
    {
      label: "Total Late",
      value: data.stats.total_late,
      color: "text-amber-500",
    },
    {
      label: "Total Absent",
      value: data.stats.total_absent,
      color: "text-red-500",
    },
    {
      label: "Total Weekday",
      value: data.stats.total_weekdays,
      color: "text-gray-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-[#0A0A0A] border border-[#262626] p-6 rounded-[24px] text-center"
          >
            <div className="flex items-center justify-center gap-1">
              <span className={cn("text-3xl font-bold", s.color)}>
                {s.value}
              </span>
              <span className="text-xs text-gray-500">
                /{data.period_label}
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Log Table */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-[24px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0D0D0D] border-b border-[#1A1A1A]">
            <tr className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
              <th className="px-6 py-5">Employee</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {data?.attendance_log?.results.map((log: any, idx: number) => (
              <tr key={idx} className="text-sm">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-[10px] font-bold border border-purple-600/30">
                    {data.employee.initials}
                  </div>
                  {data.employee.name}
                </td>
                <td className="px-6 py-4 text-gray-400">{log.role}</td>
                <td className="px-6 py-4 text-gray-400">
                  {log.location || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-400">{log.date_display}</td>
                <td
                  className={cn(
                    "px-6 py-4 text-right font-bold capitalize",
                    log.status === "present"
                      ? "text-emerald-500"
                      : log.status === "absent"
                        ? "text-red-500"
                        : log.status === "late"
                          ? "text-amber-500"
                          : "text-gray-500",
                  )}
                >
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDetailView;
