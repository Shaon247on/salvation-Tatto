import React from "react";
import { ChevronDown, Calendar } from "lucide-react";

const attendanceData = [
  // ... your data remains the same
  {
    name: "John Doe",
    location: "Downtown Ink",
    present: 20,
    late: 8,
    absent: 4,
  },
  {
    name: "Alex Smith",
    location: "Westside Studio",
    present: 15,
    late: 9,
    absent: 3,
  },
  {
    name: "Maria Lee",
    location: "Northgate Tattoo",
    present: 29,
    late: 9,
    absent: 4,
  },
  {
    name: "David Kim",
    location: "East End Parlor",
    present: 30,
    late: 1,
    absent: 1,
  },
  {
    name: "Kim John",
    location: "Westside Ink",
    present: 25,
    late: 5,
    absent: 5,
  },
  {
    name: "Jack Lee",
    location: "East End Parlor",
    present: 22,
    late: 8,
    absent: 1,
  },
  {
    name: "Sarah Connor",
    location: "Tech Hub",
    present: 28,
    late: 2,
    absent: 0,
  }, // Added extra to trigger scroll
  {
    name: "Mike Ross",
    location: "Legal Suite",
    present: 18,
    late: 12,
    absent: 2,
  },
];

const AttendanceTable = () => {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 w-full flex flex-col h-112.5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white text-lg font-bold">Attendance Summary</h3>
          <p className="text-gray-500 text-sm">Attendance by location</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-indigo-400 text-sm cursor-pointer">
            All Location <ChevronDown size={16} />
          </div>
          <button className="p-2 border border-[#262626] rounded-lg text-white hover:bg-[#1A1A1A]">
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* 1. Removed 'scrollbar-hide'
          2. Added 'custom-scrollbar' class (defined below)
          3. Kept 'overflow-y-scroll' to ensure the bar is always visible
      */}
      <div className="flex-1 overflow-y-scroll pr-2 scroll-smooth custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#0A0A0A] z-10">
            <tr className="text-white text-xs uppercase tracking-wider">
              <th className="pb-4 font-medium">Employee Name</th>
              <th className="pb-4 font-medium">Location</th>
              <th className="pb-4 font-medium">Present</th>
              <th className="pb-4 font-medium">Late</th>
              <th className="pb-4 font-medium">Absent</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {attendanceData.map((row, idx) => (
              <tr
                key={idx}
                className="group border-t border-[#1A1A1A] border-dashed hover:bg-[#111111] transition-colors"
              >
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">
                  {row.name}
                </td>
                <td className="py-4 text-gray-500 border-t border-[#1A1A1A] border-dashed">
                  {row.location}
                </td>
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">
                  {row.present}
                </td>
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">
                  {row.late}
                </td>
                <td className="py-4 text-gray-300 border-t border-[#1A1A1A] border-dashed">
                  {row.absent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
