"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TaskLogItem, TaskLogMeta } from "@/types/branchManager/report";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TaskLogProps {
  data: TaskLogItem[];
  meta: TaskLogMeta;
}

// ─── Status Style Map ──────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TaskLogItem["status"], string> = {
  approved: "border-green-500/30 text-green-500 bg-green-500/5",
  overdue: "border-red-500/30 text-red-500 bg-red-500/5",
  pending: "border-blue-500/30 text-blue-500 bg-blue-500/5",
  rejected: "border-red-500/30 text-red-400 bg-red-500/5",
};

// assignedBy is a free-form string from the API (e.g. "Store Manager", "Super Admin")
const getAssignedByStyle = (assignedBy: string): string => {
  const lower = assignedBy.toLowerCase();
  if (lower.includes("super")) return "border-purple-500/30 text-purple-400 bg-purple-500/5";
  if (lower.includes("district")) return "border-blue-500/30 text-blue-400 bg-blue-500/5";
  return "border-green-500/30 text-green-400 bg-green-500/5";
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function TaskLog({ data, meta }: TaskLogProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Client-side pagination (server returns all matching task_log items)
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl overflow-hidden mt-8">
      {/* Header */}
      <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Task Log</h3>
        <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          {meta.count} tasks total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Assigned By</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-600 text-sm"
                >
                  No tasks found for the selected filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/2 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-200 text-sm font-medium">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {item.assigned_to}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-semibold border inline-block",
                        getAssignedByStyle(item.assigned_by),
                      )}
                    >
                      {item.assigned_by}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {item.due_date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={cn(
                        "px-4 py-1 rounded-full text-[10px] font-bold border inline-block min-w-28 text-center capitalize",
                        STATUS_STYLES[item.status],
                      )}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#1A1A1A] flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Showing {paginatedData.length} of {data.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 border border-[#262626] rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-1 border border-[#262626] rounded-lg disabled:opacity-20 hover:bg-white/5 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}