"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, RefreshCw, ChevronDown, AlertCircle } from "lucide-react";
import {
  useGenerateAdminQrMutation,
  useGetQrAdminSummaryQuery,
  LocationOption,
  QrSession,
} from "@/redux/services/admin/qrsSection/qrAdminApi";
import QRFullScreenModal from "./QRFullScreenModal";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";

interface RefreshIntervalOption {
  value: number;
  label: string;
}

const REFRESH_INTERVALS: RefreshIntervalOption[] = [
  { value: 1, label: "Every 1 minutes" },
  { value: 3, label: "Every 3 minutes" },
  { value: 5, label: "Every 5 minutes" },
  { value: 10, label: "Every 10 minutes" },
  { value: 30, label: "Every 30 minutes" },
];

const QRGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [allLocation, setAllLocation] = useState<number | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<number>(180);
  const [generatedQr, setGeneratedQr] = useState<QrSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector(selectCurrentToken);
  const { data: locationsResponse } = useGetLocationsQuery(undefined, {
    skip: !token,
  });

  const allLocations =
    locationsResponse?.locations?.filter((loc) => loc.status === "active") ||
    [];

  // API Hooks
  const { data: summaryData, isLoading: isFetching } =
    useGetQrAdminSummaryQuery();
  const [generateQr, { isLoading: isGenerating }] =
    useGenerateAdminQrMutation();

  // Countdown timer
  useEffect(() => {
    if (!generatedQr) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [generatedQr]);

  // Set initial time when QR is generated
  useEffect(() => {
    if (generatedQr) {
      setTimeLeft(generatedQr.refresh_interval);
    }
  }, [generatedQr]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGenerateQr = async () => {
    setError(null);

    if (!allLocation) {
      setError("Please select a location first");
      return;
    }

    try {
      const result = await generateQr({
        refresh_interval: selectedInterval,
        location: allLocation,
      }).unwrap();

      setGeneratedQr(result.qr_session);
      setTimeLeft(result.qr_session.refresh_interval);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to generate QR code");
      setGeneratedQr(null);
    }
  };

  const qrValue = generatedQr?.token || "https://your-app.com/verify/123";

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-8">
      <h3 className="text-white font-bold mb-6 text-lg">QR Generator</h3>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        {/* QR Display Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {generatedQr ? (
              <QRCodeSVG value={qrValue} size={200} />
            ) : (
              <div className="w-50 h-50 flex items-center justify-center bg-gray-200 rounded text-gray-500 text-xs">
                No QR Generated
              </div>
            )}
          </div>

          {generatedQr && (
            <p className="text-gray-500 text-xs font-medium">
              Auto-refresh in:{" "}
              <span className="text-white">{formatTime(timeLeft)}</span>
            </p>
          )}

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!generatedQr}
              className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Maximize2 size={14} /> View Full Screen
            </button>
            <button
              onClick={handleGenerateQr}
              disabled={isGenerating || !allLocation}
              className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={14}
                className={isGenerating ? "animate-spin" : ""}
              />
              {isGenerating ? "Generating..." : "Generate QR"}
            </button>
          </div>
        </div>

        {/* Settings Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Location Dropdown */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
              Select Location
            </label>
            <div className="relative">
              <select
                value={allLocation || ""}
                onChange={(e) => setAllLocation(Number(e.target.value) || null)}
                disabled={isFetching}
                className="w-full bg-black border border-[#968B79]/60 text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer disabled:opacity-50"
              >
                <option value="">Choose a location...</option>
                {allLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Refresh Interval Dropdown */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
              QR Refresh Interval
            </label>
            <div className="relative">
              <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(Number(e.target.value))}
                className="w-full bg-black border border-[#968B79]/60 text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer"
              >
                {REFRESH_INTERVALS.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
            Select a location and click "Generate QR" to create a new QR code.
            The QR code will automatically regenerate based on the selected time
            interval to ensure secure attendance tracking.
          </p>

          {generatedQr && (
            <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-2 mt-4">
              <p className="text-gray-500 text-xs uppercase font-bold">
                Current QR Info
              </p>
              <div className="space-y-1">
                <p className="text-white text-xs">
                  <span className="text-gray-500">Location:</span>{" "}
                  {generatedQr.location_name}
                </p>
                <p className="text-white text-xs">
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={
                      generatedQr.is_active ? "text-green-400" : "text-red-400"
                    }
                  >
                    {generatedQr.is_active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p className="text-white text-xs">
                  <span className="text-gray-500">Created:</span>{" "}
                  {new Date(generatedQr.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Modal */}
      <QRFullScreenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        value={qrValue}
      />
    </div>
  );
};

export default QRGenerator;
