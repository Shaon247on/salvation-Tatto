"use client";

import React, { useState } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import type { EmployeeBreakdownItem } from "@/types/branchManager/report";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface EmployeeBreakdownProps {
  data: EmployeeBreakdownItem[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Component ─────────────────────────────────────────────────────────────────

export default function EmployeeBreakdown({ data }: EmployeeBreakdownProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-white font-bold">Employee Breakdown</h3>
        </div>
        <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          {data.length} employees
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4 text-center">Total Present</th>
              <th className="px-6 py-4 text-center">Total Absent</th>
              <th className="px-6 py-4 text-center">Total Late</th>
              <th className="px-6 py-4 text-center">Completed</th>
              <th className="px-6 py-4 text-center">Overdue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-600 text-sm"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              paginatedData.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* Employee Name + Role */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1E1B2E] flex items-center justify-center text-[11px] font-bold text-[#9171F8] shrink-0">
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <p className="text-gray-200 text-xs font-bold">
                          {emp.name}
                        </p>
                        <p className="text-gray-500 text-[10px]">{emp.role}</p>
                      </div>
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="px-6 py-4 text-center text-emerald-500 font-bold text-sm">
                    {emp.total_present}
                  </td>
                  <td className="px-6 py-4 text-center text-red-500 font-bold text-sm">
                    {emp.total_absent}
                  </td>
                  <td className="px-6 py-4 text-center text-amber-500 font-bold text-sm">
                    {emp.total_late}
                  </td>
                  <td className="px-6 py-4 text-center text-white text-xs font-bold">
                    {emp.completed}
                  </td>
                  <td className="px-6 py-4 text-center text-red-500 font-bold text-xs">
                    {emp.overdue}
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
          Page {page} of {Math.max(1, totalPages)}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}