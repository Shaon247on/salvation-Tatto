"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, RefreshCw, ChevronDown, AlertCircle, Clock } from "lucide-react";
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

const QRGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [allLocation, setAllLocation] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number>(3);
  const [seconds, setSeconds] = useState<number>(0);
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

  // Countdown timer - use duration_seconds from API response
  useEffect(() => {
    if (!generatedQr) return;

    // Set initial time from duration_seconds
    setTimeLeft(generatedQr.duration_seconds);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
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

    // Validate that at least one of minutes or seconds is > 0
    if (minutes === 0 && seconds === 0) {
      setError("Please set a refresh interval greater than 0");
      return;
    }

    try {
      const result = await generateQr({
        location: allLocation,
        minutes: minutes,
        seconds: seconds,
      }).unwrap();

      setGeneratedQr(result.qr_session);
      // Use duration_seconds from API response for countdown
      setTimeLeft(result.qr_session.duration_seconds);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to generate QR code");
      setGeneratedQr(null);
    }
  };

  const qrValue = generatedQr?.token || "https://your-app.com/verify/123";

  // Generate minute options (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  
  // Generate second options (0-59)
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

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

          {/* QR Refresh Interval - Custom Minutes & Seconds */}
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
              QR Refresh Interval
            </label>
            
            <div className="flex gap-4">
              {/* Minutes Select */}
              <div className="flex-1 relative">
                <label className="text-[10px] text-gray-500 mb-1 block">
                  Minutes
                </label>
                <div className="relative">
                  <select
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full bg-black border border-[#968B79]/60 text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer"
                  >
                    {minuteOptions.map((m) => (
                      <option key={m} value={m}>
                        {m} {m === 1 ? "min" : "mins"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Seconds Select */}
              <div className="flex-1 relative">
                <label className="text-[10px] text-gray-500 mb-1 block">
                  Seconds
                </label>
                <div className="relative">
                  <select
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    className="w-full bg-black border border-[#968B79]/60 text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer"
                  >
                    {secondOptions.map((s) => (
                      <option key={s} value={s}>
                        {s} {s === 1 ? "sec" : "secs"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Display Total Interval */}
            {(minutes > 0 || seconds > 0) && (
              <p className="text-[10px] text-gray-400 mt-1">
                Total: {minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}
                {minutes > 0 && seconds > 0 ? ' and ' : ''}
                {seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : ''}
              </p>
            )}
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
                <p className="text-white text-xs">
                  <span className="text-gray-500">Duration:</span>{" "}
                  {generatedQr.duration_display}
                </p>
                <p className="text-white text-xs">
                  <span className="text-gray-500">Expires:</span>{" "}
                  {new Date(generatedQr.expires_at).toLocaleString()}
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