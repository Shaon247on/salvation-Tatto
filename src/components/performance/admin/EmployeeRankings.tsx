/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

export const EmployeeRankings = ({ rankings }: { rankings: any[] }) => (
  <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-[2rem] overflow-hidden mt-8">
    <div className="p-6 md:p-8 border-b border-[#1A1A1A]">
      <h3 className="text-white font-bold text-lg">Employee Rankings</h3>
      <p className="text-gray-500 text-xs mt-1">
        Performance breakdown for all employees
      </p>
    </div>

    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
            <th className="px-8 py-5">Rank</th>
            <th className="px-8 py-5">Employee</th>
            {/* Header set to Center */}
            <th className="px-8 py-5 text-center">Tasks</th>
            <th className="px-8 py-5 text-center">Overdue</th>
            <th className="px-8 py-5">Attendance</th>
            {/* Header set to Right to match row value */}
            <th className="px-8 py-5 text-right">Completion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A1A1A]">
          {rankings.length > 0 ? (
            rankings.map((emp) => (
              <tr
                key={emp.rank}
                className="hover:bg-white/2 transition-all group"
              >
                <td className="px-8 py-6 font-bold text-amber-500">
                  #{emp.rank} {emp.rank <= 3 && "🏆"}
                </td>
                <td className="px-8 py-6 flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                      emp.avatarColor,
                    )}
                  >
                    {emp.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{emp.name}</p>
                    <p className="text-gray-600 text-xs italic">{emp.email}</p>
                  </div>
                </td>

                {/* Value set to Center under 'Tasks' */}
                <td className="px-8 py-6 text-center">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-lg font-bold text-xs",
                      emp.tasks > 0
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-gray-500/10 text-gray-500",
                    )}
                  >
                    {emp.tasks ?? "0"}
                  </span>
                </td>

                {/* Value set to Center under 'Overdue' */}
                <td
                  className={cn(
                    "px-8 py-6 text-center text-xs font-bold",
                    emp.overdue !== "0%" ? "text-red-500" : "text-gray-600",
                  )}
                >
                  {emp.overdue || "—"}
                </td>

                {/* Value aligned with 'Attendance' */}
                <td className="px-8 py-6">
                  <ProgressBar
                    value={emp.attendance}
                    color="bg-blue-500"
                    align="left"
                  />
                </td>

                {/* Value set to Right under 'Completion' */}
                <td className="px-8 py-6">
                  <ProgressBar
                    value={emp.completion}
                    color="bg-emerald-500"
                    align="right"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-8 py-20 text-center text-gray-500 italic"
              >
                No performance data available for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

interface ProgressBarProps {
  value: number;
  color: string;
  align?: "left" | "right";
}

const ProgressBar = ({ value, color, align = "left" }: ProgressBarProps) => {
  const safeValue = value ?? 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "right" ? "justify-end" : "justify-start",
      )}
    >
      <div className="w-20 md:w-24 bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-bold min-w-8.75",
          safeValue > 0 ? "text-gray-400" : "text-gray-600",
        )}
      >
        {safeValue}%
      </span>
    </div>
  );
};
