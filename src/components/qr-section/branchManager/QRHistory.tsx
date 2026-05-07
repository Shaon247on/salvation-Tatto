// import React from "react";
// import { QRCodeSVG } from "qrcode.react";
// import { Eye } from "lucide-react";

// const historyData = [
//   { date: "Mar 11, 2026", time: "3:31 AM", present: 17, late: 2, absent: 1 },
//   { date: "Mar 10, 2026", time: "09:00 AM", present: 18, late: 2, absent: 1 },
//   { date: "Mar 09, 2026", time: "09:00 AM", present: 20, late: 1, absent: 0 },
//   { date: "Mar 08, 2026", time: "09:00 AM", present: 17, late: 3, absent: 1 },
// ];

// const QRHistory = () => {
//   return (
//     <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-8">
//       <div className="mb-8">
//         <h3 className="text-white font-bold text-lg mb-1">QR History</h3>
//         <p className="text-gray-500 text-sm">
//           Previously generated QR codes and attendance summary.
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.15em] border-b border-[#1A1A1A]">
//               <th className="pb-4 font-medium">QR Preview</th>
//               <th className="pb-4 font-medium">Generated Date</th>
//               <th className="pb-4 font-medium text-center">Present</th>
//               <th className="pb-4 font-medium text-center">Late</th>
//               <th className="pb-4 font-medium text-center">Absent</th>
//               <th className="pb-4 font-medium text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#1A1A1A]">
//             {historyData.map((row, idx) => (
//               <tr
//                 key={idx}
//                 className="group hover:bg-white/[0.02] transition-colors"
//               >
//                 <td className="py-5">
//                   <div className="bg-white p-1 rounded-md w-fit opacity-80 group-hover:opacity-100 transition-opacity">
//                     <QRCodeSVG value="history-data" size={32} />
//                   </div>
//                 </td>
//                 <td className="py-5">
//                   <p className="text-gray-300 text-xs font-semibold">
//                     {row.date}
//                   </p>
//                   <p className="text-gray-600 text-[10px] mt-0.5">{row.time}</p>
//                 </td>
//                 <td className="py-5 text-center text-emerald-500 text-xs font-bold">
//                   {row.present}
//                 </td>
//                 <td className="py-5 text-center text-amber-500 text-xs font-bold">
//                   {row.late}
//                 </td>
//                 <td className="py-5 text-center text-red-500 text-xs font-bold">
//                   {row.absent}
//                 </td>
//                 <td className="py-5 text-right">
//                   <button className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#262626] text-gray-300 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-white transition-all">
//                     <Eye size={12} /> View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default QRHistory;

"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Inbox } from "lucide-react";
import { useGetQrHistoryQuery } from "@/redux/services/admin/qrsSection/qrBranchManagerApi";

const QRHistory = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetQrHistoryQuery({ page });

  const history = data?.history?.results || [];

  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-white font-bold text-lg mb-1">QR History</h3>
        <p className="text-gray-500 text-sm">
          Previously generated sessions for {data?.location || "this branch"}.
        </p>
      </div>

      <div className="overflow-x-auto min-h-75">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-gray-500 mb-2" />
            <p className="text-gray-600 text-xs">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#262626] rounded-2xl">
            <Inbox className="text-gray-700 mb-3" size={40} />
            <p className="text-gray-500 text-sm font-medium">
              No QR history found
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Generated sessions will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-white text-[10px] uppercase font-bold tracking-[0.15em] border-b border-[#1A1A1A]">
                <th className="pb-4">QR Preview</th>
                <th className="pb-4">Created At</th>
                <th className="pb-4 text-center">Present</th>
                <th className="pb-4 text-center">Late</th>
                <th className="pb-4 text-center">Absent</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {history.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-white/2 transition-colors"
                >
                  <td className="py-5">
                    <div className="bg-white p-1 rounded-md w-fit opacity-80 group-hover:opacity-100 transition-opacity">
                      <QRCodeSVG value={row.token} size={32} />
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-gray-300 text-xs font-semibold">
                      {new Date(row.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 text-[10px] mt-0.5">
                      {new Date(row.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="py-5 text-center text-emerald-500 text-xs font-bold">
                    {row.present_count}
                  </td>
                  <td className="py-5 text-center text-amber-500 text-xs font-bold">
                    {row.late_count}
                  </td>
                  <td className="py-5 text-center text-red-500 text-xs font-bold">
                    {row.absent_count}
                  </td>
                  <td className="py-5 text-right">
                    {/* <button className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#262626] text-gray-300 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-white transition-all">
                      <Eye size={12} /> View Details
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Basic Pagination */}
      {data?.history?.count && data.history.count > 10 && (
        <div className="mt-6 flex justify-end gap-2">
          <button
            disabled={!data.history.previous}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs text-white hover:text-[#968B79]/60 disabled:opacity-40 "
          >
            Previous
          </button>
          <button
            disabled={!data.history.next}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs text-white hover:text-[#968B79]/60 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QRHistory;
