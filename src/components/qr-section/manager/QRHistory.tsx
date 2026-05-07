import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Eye } from "lucide-react";

const historyData = [
  { date: "Mar 11, 2026", time: "3:31 AM", present: 17, late: 2, absent: 1 },
  { date: "Mar 10, 2026", time: "09:00 AM", present: 18, late: 2, absent: 1 },
  { date: "Mar 09, 2026", time: "09:00 AM", present: 20, late: 1, absent: 0 },
  { date: "Mar 08, 2026", time: "09:00 AM", present: 17, late: 3, absent: 1 },
];

const QRHistory = () => {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-white font-bold text-lg mb-1">QR History</h3>
        <p className="text-gray-500 text-sm">
          Previously generated QR codes and attendance summary.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white text-[10px] uppercase font-bold tracking-[0.15em] border-b border-[#1A1A1A]">
              <th className="pb-4 font-medium">QR Preview</th>
              <th className="pb-4 font-medium">Generated Date</th>
              <th className="pb-4 font-medium text-center">Present</th>
              <th className="pb-4 font-medium text-center">Late</th>
              <th className="pb-4 font-medium text-center">Absent</th>
              <th className="pb-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {historyData.map((row, idx) => (
              <tr
                key={idx}
                className="group hover:bg-white/2 transition-colors"
              >
                <td className="py-5">
                  <div className="bg-white p-1 rounded-md w-fit opacity-80 group-hover:opacity-100 transition-opacity">
                    <QRCodeSVG value="history-data" size={32} />
                  </div>
                </td>
                <td className="py-5">
                  <p className="text-gray-300 text-xs font-semibold">
                    {row.date}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-0.5">{row.time}</p>
                </td>
                <td className="py-5 text-center text-emerald-500 text-xs font-bold">
                  {row.present}
                </td>
                <td className="py-5 text-center text-amber-500 text-xs font-bold">
                  {row.late}
                </td>
                <td className="py-5 text-center text-red-500 text-xs font-bold">
                  {row.absent}
                </td>
                <td className="py-5 text-right">
                  <button className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#262626] text-gray-300 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-white transition-all">
                    <Eye size={12} /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QRHistory;
