"use client";

import React from "react";
import { X } from "lucide-react";
import {
  QrSession,
  AttendanceRecord,
} from "@/redux/services/admin/qrsSection/qrAdminApi";

interface QRDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrSession: QrSession | null;
  attendances: AttendanceRecord[];
  isLoading?: boolean;
}

const QRDetailsModal: React.FC<QRDetailsModalProps> = ({
  isOpen,
  onClose,
  qrSession,
  attendances,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#1A1A1A] px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">QR Session Details</h2>
            <p className="text-gray-500 text-xs mt-1">
              Session ID: {qrSession?.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading details...</div>
            </div>
          ) : qrSession ? (
            <>
              {/* Session Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1A1A1A] rounded-xl p-4">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-2">
                    Location
                  </p>
                  <p className="text-white font-semibold">
                    {qrSession.location_name || qrSession.location || "N/A"}
                  </p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-2">
                    Refresh Interval
                  </p>
                  <p className="text-white font-semibold">
                    {qrSession.interval_display}
                  </p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-2">
                    Status
                  </p>
                  <p
                    className={`font-semibold ${
                      qrSession.is_active ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {qrSession.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-2">
                    Expires At
                  </p>
                  <p className="text-white font-semibold text-sm">
                    {formatDate(qrSession.expires_at)}
                  </p>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <p className="text-emerald-400 text-xs uppercase font-bold mb-2">
                    Present
                  </p>
                  <p className="text-white text-3xl font-bold">
                    {qrSession.present_count}
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <p className="text-amber-400 text-xs uppercase font-bold mb-2">
                    Late
                  </p>
                  <p className="text-white text-3xl font-bold">
                    {qrSession.late_count}
                  </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-xs uppercase font-bold mb-2">
                    Absent
                  </p>
                  <p className="text-white text-3xl font-bold">
                    {qrSession.absent_count}
                  </p>
                </div>
              </div>

              {/* Attendances Table */}
              <div>
                <h3 className="text-white font-bold mb-4">
                  Attendance Records
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-white text-[10px] uppercase font-bold tracking-[0.15em] border-b border-[#1A1A1A]">
                        <th className="pb-4 font-medium">Employee</th>
                        <th className="pb-4 font-medium">Email</th>
                        <th className="pb-4 font-medium">Role</th>
                        <th className="pb-4 font-medium">Date</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Clock In</th>
                        <th className="pb-4 font-medium">Clock Out</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      {attendances.length > 0 ? (
                        attendances.map((record) => (
                          <tr
                            key={record.id}
                            className="group hover:bg-white/2 transition-colors"
                          >
                            <td className="py-4 text-gray-300 text-xs font-semibold">
                              {record.employee_name}
                            </td>
                            <td className="py-4 text-gray-500 text-xs">
                              {record.employee_email}
                            </td>
                            <td className="py-4 text-gray-400 text-xs">
                              {record.employee_role}
                            </td>
                            <td className="py-4 text-gray-400 text-xs">
                              {record.date}
                            </td>
                            <td className="py-4">
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded ${
                                  record.status === "present"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : record.status === "late"
                                      ? "bg-amber-500/20 text-amber-400"
                                      : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {record.status.charAt(0).toUpperCase() +
                                  record.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 text-gray-400 text-xs">
                              {formatTime(record.clock_in)}
                            </td>
                            <td className="py-4 text-gray-400 text-xs">
                              {record.clock_out
                                ? formatTime(record.clock_out)
                                : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center">
                            <p className="text-gray-500">
                              No attendance records found
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRDetailsModal;
