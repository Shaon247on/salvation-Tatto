// /* eslint-disable @typescript-eslint/no-explicit-any */
// export const AttendanceLog = ({ data }: { data: any[] }) => (
//   <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden">
//     <div className="p-6 border-b border-[#1A1A1A]">
//       <h3 className="text-white font-bold text-lg">Attendance Log</h3>
//       <p className="text-gray-500 text-xs mt-1 italic">
//         Synced from employee mobile app
//       </p>
//     </div>
//     <div className="overflow-x-auto">
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="text-gray-600 text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
//             <th className="px-6 py-4">Date</th>
//             <th className="px-6 py-4">Location</th>
//             <th className="px-6 py-4">Present</th>
//             <th className="px-6 py-4">Absent</th>
//             <th className="px-6 py-4">Late</th>
//             <th className="px-6 py-4 text-right">Rate</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-[#1A1A1A]">
//           {data.map((row, i) => (
//             <tr key={i} className="hover:bg-white/1 transition-colors">
//               <td className="px-6 py-5 text-gray-400 text-sm">{row.date}</td>
//               <td className="px-6 py-5 text-gray-500 text-sm">
//                 {row.location}
//               </td>
//               <td className="px-6 py-5 text-emerald-500 font-bold text-sm">
//                 {row.present}
//               </td>
//               <td className="px-6 py-5 text-red-900 font-bold text-sm">
//                 {row.absent}
//               </td>
//               <td className="px-6 py-5 text-amber-600 font-bold text-sm">
//                 {row.late}
//               </td>
//               <td className="px-6 py-5 text-right font-bold text-amber-500 text-sm">
//                 {row.rate}%
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

import { AttendanceSummaryEntry } from "@/redux/services/admin/report/adminReportApi";
import { Calendar, MapPin } from "lucide-react";

export const AttendanceLog = ({ data }: { data: AttendanceSummaryEntry[] }) => {
  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-[#1A1A1A]">
        <h3 className="text-white font-bold text-lg">Attendance Log</h3>
        <p className="text-gray-500 text-xs mt-1 italic">
          Today summary across all locations
        </p>
      </div>

      {/* --- Desktop View --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Present</th>
              <th className="px-6 py-4 text-center">Absent</th>
              <th className="px-6 py-4 text-center">Late</th>
              <th className="px-6 py-4 text-right">Attendance Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/2 transition-colors group">
                <td className="px-6 py-5 text-gray-400 text-sm font-medium">
                  {row.date}
                </td>
                <td className="px-6 py-5 text-gray-500 text-sm">
                  {row.location}
                </td>
                <td className="px-6 py-5 text-emerald-500 font-bold text-sm text-center">
                  {row.present}
                </td>
                <td className="px-6 py-5 text-red-500 font-bold text-sm text-center">
                  {row.absent}
                </td>
                <td className="px-6 py-5 text-amber-500 font-bold text-sm text-center">
                  {row.late}
                </td>
                <td className="px-6 py-5 text-right font-bold text-amber-500 text-sm">
                  {row.rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile View --- */}
      <div className="md:hidden divide-y divide-[#1A1A1A]">
        {data.map((row, i) => (
          <div key={i} className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={14} className="text-gray-600" />
                <span className="text-sm font-bold">{row.date}</span>
              </div>
              <div className="bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 text-amber-500 font-bold text-[10px]">
                {row.rate} RATE
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs italic">
              <MapPin size={12} />
              <span>{row.location}</span>
            </div>

            {/* Stats Grid for Today Totals */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#111] border border-[#1A1A1A] p-3 rounded-xl text-center">
                <p className="text-[9px] uppercase text-gray-600 font-bold mb-1">
                  Present
                </p>
                <p className="text-emerald-500 font-bold text-sm">
                  {row.present}
                </p>
              </div>
              <div className="bg-[#111] border border-[#1A1A1A] p-3 rounded-xl text-center">
                <p className="text-[9px] uppercase text-gray-600 font-bold mb-1">
                  Absent
                </p>
                <p className="text-red-500 font-bold text-sm">{row.absent}</p>
              </div>
              <div className="bg-[#111] border border-[#1A1A1A] p-3 rounded-xl text-center">
                <p className="text-[9px] uppercase text-gray-600 font-bold mb-1">
                  Late
                </p>
                <p className="text-amber-500 font-bold text-sm">{row.late}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
