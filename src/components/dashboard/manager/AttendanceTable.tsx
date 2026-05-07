import React from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { DistrictManagerDashboardResponse } from "@/types/districtManager/districtManagerDashboard.type";


const AttendanceTable = ({ data }: { data: DistrictManagerDashboardResponse['attendance_summary'] }) => {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 w-full flex flex-col h-112.5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white text-lg font-bold">Attendance Summary</h3>
          <p className="text-gray-500 text-sm">Attendance by location</p>
        </div>
      </div>

      {/* 1. Removed 'scrollbar-hide'
          2. Added 'custom-scrollbar' class (defined below)
          3. Kept 'overflow-y-scroll' to ensure the bar is always visible
      */}
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 w-full flex flex-col h-112.5">
      {/* ... Headers remain same ... */}
      <div className="flex-1 overflow-y-scroll pr-2 custom-scrollbar">
        <table className="w-full text-left">
          {/* ... Thead remains same ... */}
          <tbody className="text-sm">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-[#111111] transition-colors">
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">{row.name}</td>
                <td className="py-4 text-gray-500 border-t border-[#1A1A1A] border-dashed">{row.location_name}</td>
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">{row.present}</td>
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">{row.late}</td>
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">{row.absent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default AttendanceTable;
