"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetQrAdminSummaryQuery,
  useGetAdminQrDetailsQuery,
} from "@/redux/services/admin/qrsSection/qrAdminApi";
import QRDetailsModal from "./QRDetailsModal";

const QRHistory = () => {
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<
    number | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQrId, setSelectedQrId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch QR list with filters
  const {
    data: summaryData,
    isLoading: isListLoading,
    error: listError,
  } = useGetQrAdminSummaryQuery({
    location: selectedLocationFilter,
    page: currentPage,
  });

  // Fetch QR details when a QR is selected
  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useGetAdminQrDetailsQuery(selectedQrId || 0, {
    skip: !selectedQrId,
  });

  const locations = summaryData?.filter_options?.locations || [];
  const qrHistory = summaryData?.history?.results || [];
  const totalCount = summaryData?.history?.count || 0;
  const hasNextPage = !!summaryData?.history?.next;
  const hasPreviousPage = !!summaryData?.history?.previous;

  const handleViewDetails = (qrId: number) => {
    setSelectedQrId(qrId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedQrId(null);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-8">
        <div className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">QR History</h3>

          {/* Location Filter */}
          <div className="max-w-xs">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">
              Filter by Location
            </label>
            <div className="relative">
              <select
                value={selectedLocationFilter || ""}
                onChange={(e) => {
                  setSelectedLocationFilter(
                    e.target.value ? Number(e.target.value) : undefined,
                  );
                  setCurrentPage(1);
                }}
                className="w-full bg-black border border-[#968B79]/60 text-white rounded-xl py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <ChevronRight
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none rotate-90"
                size={14}
              />
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            Previously generated QR codes and attendance summary.
          </p>
        </div>

        {/* Loading State */}
        {isListLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading QR history...</div>
          </div>
        )}

        {/* Error State */}
        {listError && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">
              Failed to load QR history. Please try again.
            </div>
          </div>
        )}

        {/* Table */}
        {!isListLoading && !listError && qrHistory.length > 0 && (
          <>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white text-[10px] uppercase font-bold tracking-[0.15em] border-b border-[#1A1A1A]">
                    <th className="pb-4 font-medium">QR Preview</th>
                    <th className="pb-4 font-medium">Generated Date</th>
                    <th className="pb-4 font-medium">Location</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium text-center">Present</th>
                    <th className="pb-4 font-medium text-center">Late</th>
                    <th className="pb-4 font-medium text-center">Absent</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {qrHistory.map((row) => (
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
                          {formatDate(row.created_at)}
                        </p>
                        <p className="text-gray-600 text-[10px] mt-0.5">
                          {formatTime(row.created_at)}
                        </p>
                      </td>
                      <td className="py-5 text-gray-300 text-xs font-semibold">
                        {row.location_name || row.location || "N/A"}
                      </td>
                      <td className="py-5">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            row.is_active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {row.is_active ? "Active" : "Inactive"}
                        </span>
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
                        <button
                          onClick={() => handleViewDetails(row.id)}
                          className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#262626] text-gray-300 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-white transition-all"
                        >
                          <Eye size={12} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-6">
              <p className="text-gray-500 text-xs">
                Showing results (Page {currentPage}) • Total: {totalCount}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage}
                  className="flex items-center gap-2 border border-[#262626] text-gray-300 px-3 py-2 rounded-lg text-xs font-bold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className="flex items-center gap-2 border border-[#262626] text-gray-300 px-3 py-2 rounded-lg text-xs font-bold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isListLoading && !listError && qrHistory.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 text-sm">No QR codes found</p>
              <p className="text-gray-600 text-xs mt-1">
                Generate a new QR code to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* QR Details Modal */}
      <QRDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        qrSession={detailsData?.qr_session || null}
        attendances={detailsData?.attendances || []}
        isLoading={isDetailsLoading}
      />
    </>
  );
};

export default QRHistory;
