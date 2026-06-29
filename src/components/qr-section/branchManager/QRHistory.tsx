"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Inbox, Maximize2 } from "lucide-react";
import { useGetQrHistoryQuery } from "@/redux/services/admin/qrsSection/qrBranchManagerApi";
import QRFullScreenModal from "./QRFullScreenModal";

const QRHistory = () => {
  const [page, setPage] = useState(1);
  const [fullScreenQr, setFullScreenQr] = useState<string | null>(null);
  const { data, isLoading } = useGetQrHistoryQuery({ page });

  const history = data?.history?.results || [];

  const handleQrClick = (token: string) => {
    setFullScreenQr(token);
  };

  const handleCloseFullScreen = () => {
    setFullScreenQr(null);
  };

  return (
    <>
      {/* Full Screen QR Modal */}
      <QRFullScreenModal
        isOpen={!!fullScreenQr}
        onClose={handleCloseFullScreen}
        value={fullScreenQr || ""}
      />

      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-8">
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
                      <button
                        onClick={() => handleQrClick(row.token)}
                        className="bg-white p-1 rounded-md w-fit opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition-all"
                      >
                        <QRCodeSVG value={row.token} size={32} />
                      </button>
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
              className="text-xs text-white hover:text-[#968B79]/60 disabled:opacity-40"
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
    </>
  );
};

export default QRHistory;