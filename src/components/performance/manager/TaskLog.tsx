"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TaskLog({ data }: { data: any[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const statusStyles: any = {
    Approved: "border-green-500/30 text-green-500 bg-green-500/5",
    Overdue: "border-red-500/30 text-red-500 bg-red-500/5",
    "Awaiting Review": "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
    Pending: "border-blue-500/30 text-blue-500 bg-blue-500/5",
    Rejected: "border-red-500/30 text-red-500 bg-red-500/5",
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl overflow-hidden mt-8">
      <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Task Log</h3>
        <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          {data.length} tasks total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Assigned By</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-white/2 transition-colors">
                <td className="px-6 py-4 text-gray-200 text-sm font-medium">
                  {item.task}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {item.assignedTo}
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {item.location}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-semibold border inline-block",
                      item.assignedBy === "Super Admin"
                        ? "border-purple-500/30 text-purple-400 bg-purple-500/5"
                        : item.assignedBy === "District Manager"
                          ? "border-blue-500/30 text-blue-400 bg-blue-500/5"
                          : "border-green-500/30 text-green-400 bg-green-500/5",
                    )}
                  >
                    {item.assignedBy}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {item.dueDate}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-bold border inline-block min-w-28 text-center",
                      statusStyles[item.status],
                    )}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#1A1A1A] flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Showing {paginatedData.length} of {data.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="p-1 border border-[#262626] rounded-lg disabled:opacity-20 hover:bg-white/5"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="p-1 border border-[#262626] rounded-lg disabled:opacity-20 hover:bg-white/5"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
