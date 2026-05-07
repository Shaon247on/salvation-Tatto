/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmployeePerformanceRow } from "@/types/districtManager/districtManagerReport.type";
import React from "react";

const EmployeePerformanceTable = ({ data }: { data: EmployeePerformanceRow[] }) => {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl overflow-hidden mt-6">
      <div className="p-6 border-b border-[#1A1A1A]">
        <h3 className="text-white font-bold">Employee Performance Report</h3>
        <p className="text-gray-500 text-xs">3 employees - all locations</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white text-[10px] uppercase font-bold tracking-widest bg-[#0D0D0D]/50">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">On-Time Rate</th>
              <th className="px-6 py-4">Tasks</th>
              <th className="px-6 py-4 text-center">Late Arrivals</th>
              <th className="px-6 py-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#111111] transition-colors group"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  {/* <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {row.role}
                  </div> */}
                  <span className="text-gray-300 text-xs font-semibold">
                    {row.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-xs">
                  {row.location}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#1A1A1A] text-gray-400 text-[10px] px-2.5 py-1 rounded-full border border-[#262626]">
                    {row.role}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-xs font-bold ${row.on_time_rate >= 90 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {row.on_time_rate}%
                </td>
                <td className="px-6 py-4 text-gray-300 text-xs">{row.tasks_total}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block w-6 h-6 leading-6 rounded-full bg-[#1A1A1A] text-gray-500 text-[10px]">
                    {row.late_arrivals}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-lg border border-indigo-500/20">
                    {row.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePerformanceTable;
