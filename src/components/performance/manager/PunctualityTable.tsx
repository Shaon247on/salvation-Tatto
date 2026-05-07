/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PunctualityTable = ({ data }: { data: any[] }) => {
  // Helper to get bar/status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "#10B981"; // Emerald
      case "Monitor":
        return "#F59E0B"; // Amber
      case "At Risk":
        return "#EF4444"; // Red
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="bg-[#0A0A0A] rounded-2xl overflow-hidden border border-gray-800/30">
      {/* Table Header Section */}
      <div className="p-6 flex justify-between items-start">
        <div>
          <h3 className="text-white font-bold text-lg">Staff Punctuality</h3>
          <p className="text-gray-500 text-xs mt-1">
            On-time arrival rates and task performance
          </p>
        </div>
        <div className="bg-[#111111] border border-gray-800 p-1 rounded-xl flex gap-1">
          {["Week", "Month", "Quarter"].map((t) => (
            <button
              key={t}
              className={cn(
                "px-4 py-1.5 text-[11px] font-medium rounded-lg transition-all",
                t === "Month"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-gray-900">
              <th className="px-6 py-4">Staff Member</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">On-time Rate</th>
              <th className="px-6 py-4">Tasks Done</th>
              <th className="px-6 py-4">Late Arrivals</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {data.map((staff, i) => (
              <tr
                key={i}
                className="hover:bg-[#0F0F0F] transition-colors group"
              >
                <td className="px-6 py-5 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: "#6366F1" }} // Default indigo or map to location color
                  >
                    {staff.initials}
                  </div>
                  <span className="text-white text-sm font-semibold">
                    {staff.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {staff.location}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#1A1A1A] text-gray-400 text-[10px] px-3 py-1 rounded-full font-medium">
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#141414] h-1.5 rounded-full w-24">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${staff.onTimeRate}%`,
                          backgroundColor: getStatusColor(staff.status),
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: getStatusColor(staff.status) }}
                    >
                      {staff.onTimeRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {staff.tasksDone}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#1A1A1A] text-gray-400 text-[11px] px-2 py-1 rounded-md">
                    {staff.lateArrivals} late
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(staff.status) }}
                    />
                    <span className="text-white text-xs font-medium">
                      {staff.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm font-medium">
          Showing <span className="text-white">1 to 5</span> of{" "}
          <span className="text-white">24</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          {[1, 2, 3, "...", 10].map((page, idx) => (
            <button
              key={idx}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border",
                page === 1
                  ? "bg-[#1A1A1A] border-gray-700 text-white"
                  : "border-transparent text-gray-500 hover:text-white",
              )}
            >
              {page}
            </button>
          ))}
          <button className="p-2 border border-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PunctualityTable;
