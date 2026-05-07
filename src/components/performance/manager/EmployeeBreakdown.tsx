"use client";
import React, { useState, useMemo } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

const getStatusBadge = (status: string) => {
  if (status === "Present")
    return <span className="text-emerald-500 font-bold">●</span>;
  if (status === "Absent")
    return <span className="text-red-500 font-bold">●</span>;
  if (status === "Late")
    return <span className="text-amber-500 font-bold">●</span>;
  return <span className="text-gray-500">●</span>;
};

const getStatusText = (status: string) => {
  if (status === "Present")
    return (
      <span className="text-emerald-500 font-semibold text-xs">{status}</span>
    );
  if (status === "Absent")
    return <span className="text-red-500 font-semibold text-xs">{status}</span>;
  if (status === "Late")
    return (
      <span className="text-amber-500 font-semibold text-xs">{status}</span>
    );
  return <span className="text-gray-500 text-xs">{status}</span>;
};

export default function EmployeeBreakdown({
  data,
  showDailyRecords,
}: {
  data: any[];
  showDailyRecords: boolean;
}) {
  const [page, setPage] = useState(1);

  if (showDailyRecords) {
    // Today Records View (when search is active)
    const itemsPerPage = 10;
    const tableRows = useMemo(() => {
      const rows: any[] = [];
      data.forEach((emp) => {
        emp._records?.forEach((record: any) => {
          rows.push({
            employeeName: emp.name,
            employeeInitials: emp.initials,
            employeeRole: emp.role,
            date: record.date,
            status: record.status,
            completedCount: emp.completedCount,
            overdueCount: emp.overdueCount,
          });
        });
      });
      return rows;
    }, [data]);

    const totalPages = Math.ceil(tableRows.length / itemsPerPage);
    const paginatedData = tableRows.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    );

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + "T00:00:00");
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    return (
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h3 className="text-white font-bold">Employee Today Records</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Completed</th>
                <th className="px-6 py-4 text-center">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {paginatedData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1E1B2E] flex items-center justify-center text-[11px] font-bold text-[#9171F8]">
                      {row.employeeInitials}
                    </div>
                    <div>
                      <p className="text-gray-200 text-xs font-bold">
                        {row.employeeName}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {row.employeeRole}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {formatDate(row.date)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusText(row.status)}
                  </td>
                  <td className="px-6 py-4 text-center text-white text-sm font-semibold">
                    {row.completedCount}
                  </td>
                  <td className="px-6 py-4 text-center text-red-500 font-bold text-xs">
                    {row.overdueCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Showing {paginatedData.length} of {tableRows.length} records
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // Summary View (when no search)
    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    );

    return (
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h3 className="text-white font-bold">Employee Breakdown</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Total Present</th>
                <th className="px-6 py-4 text-center">Total Absent</th>
                <th className="px-6 py-4 text-center">Total Late</th>
                <th className="px-6 py-4 text-center">Completed</th>
                <th className="px-6 py-4 text-center">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {paginatedData.map((emp, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1E1B2E] flex items-center justify-center text-[11px] font-bold text-[#9171F8]">
                      {emp.initials}
                    </div>
                    <div>
                      <p className="text-gray-200 text-xs font-bold">
                        {emp.name}
                      </p>
                      <p className="text-gray-500 text-[10px]">{emp.role}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {emp.location}
                  </td>
                  <td className="px-6 py-4 text-center text-emerald-500 font-bold text-sm">
                    {emp.presentCount}
                  </td>
                  <td className="px-6 py-4 text-center text-red-500 font-bold text-sm">
                    {emp.absentCount}
                  </td>
                  <td className="px-6 py-4 text-center text-amber-500 font-bold text-sm">
                    {emp.lateCount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white text-xs">
                      {emp.completedCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-500 font-bold text-xs">
                    {emp.overdueCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
