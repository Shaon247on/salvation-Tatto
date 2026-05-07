/* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import React, { useState, useEffect } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import { Maximize2, RefreshCw, ChevronDown } from "lucide-react";
// import QRFullScreenModal from "./QRFullScreenModal";

// const QRGenerator = () => {
//   // 1. Added required states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(169); // 2:49 in seconds
//   const qrValue = "https://your-app.com/verify/123"; // Your QR data

//   // Simple countdown logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 180));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleRegenerate = () => {
//     setTimeLeft(180);
//     // Add logic here to update qrValue if needed
//   };

//   return (
//     <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-8">
//       <h3 className="text-white font-bold mb-6 text-lg">QR Generator</h3>

//       <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
//         {/* QR Display Area */}
//         <div className="flex flex-col items-center gap-4">
//           <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
//             <QRCodeSVG value={qrValue} size={200} />
//           </div>
//           <p className="text-gray-500 text-xs font-medium">
//             Auto-refresh in:{" "}
//             <span className="text-white">{formatTime(timeLeft)}</span>
//           </p>

//           <div className="flex gap-3 w-full mt-2">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all"
//             >
//               <Maximize2 size={14} /> View Full Screen
//             </button>
//             <button
//               onClick={handleRegenerate}
//               className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all"
//             >
//               <RefreshCw size={14} /> Regenerate QR
//             </button>
//           </div>
//         </div>

//         {/* Settings Area */}
//         <div className="flex-1 w-full space-y-6">
//           <div className="space-y-2">
//             <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
//               QR Refresh Interval
//             </label>
//             <div className="relative">
//               <select className="w-full bg-black border border-[#262626] text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer">
//                 <option>Every 3 minutes</option>
//                 <option>Every 5 minutes</option>
//                 <option>Manual only</option>
//               </select>
//               <ChevronDown
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
//                 size={16}
//               />
//             </div>
//           </div>
//           <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
//             The QR code will automatically regenerate based on the selected time
//             interval to ensure secure attendance tracking.
//           </p>
//         </div>
//       </div>

//       {/* 2. Moved Modal to bottom level (Outside the button flex container) */}
//       <QRFullScreenModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         value={qrValue}
//       />
//     </div>
//   );
// };

// export default QRGenerator;

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, RefreshCw, ChevronDown, Loader2 } from "lucide-react";
import QRFullScreenModal from "./QRFullScreenModal";
import {
  useGenerateQrMutation,
  useGetCurrentQrQuery,
  useGetQrIntervalsQuery,
} from "@/redux/services/admin/qrsSection/qrBranchManagerApi";

const QRGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<number>(3);

  // 1. Initialize as null so it doesn't trigger the "0" logic on mount
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // 2. Use a Ref to prevent multiple triggers while waiting for the API
  const hasTriggeredRef = useRef(false);

  const { data: currentData, isLoading: isCurrentLoading } =
    useGetCurrentQrQuery(undefined);
  const { data: intervalsData } = useGetQrIntervalsQuery();
  const [generateQr, { isLoading: isGenerating }] = useGenerateQrMutation();

  const activeSession = currentData?.qr_session;
  const qrValue = activeSession?.token || "";

  // Synchronize local state with server data
  useEffect(() => {
    if (currentData?.seconds_left !== undefined) {
      setTimeLeft(currentData.seconds_left);
      // 3. Reset the trigger guard because we have fresh time from the server
      hasTriggeredRef.current = false;
    }
  }, [currentData?.seconds_left, currentData?.qr_session?.token]);

  // Local Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = useCallback(async () => {
    if (isGenerating) return;
    try {
      await generateQr({ refresh_interval: selectedInterval }).unwrap();
    } catch (err) {
      console.error("QR Auto-Regeneration failed", err);
      // If it fails, allow a retry on the next tick
      hasTriggeredRef.current = false;
    }
  }, [generateQr, isGenerating, selectedInterval]);

  // 4. Improved Trigger Logic
  useEffect(() => {
    // Only trigger if:
    // - Time is exactly 0
    // - We haven't already triggered for THIS specific 0-second event
    // - There is an active session to regenerate
    // - We aren't already in the middle of a request
    if (
      timeLeft === 0 &&
      !hasTriggeredRef.current &&
      activeSession &&
      !isGenerating &&
      !isCurrentLoading
    ) {
      hasTriggeredRef.current = true; // Lock the trigger
      handleAction();
    }
  }, [timeLeft, activeSession, isGenerating, isCurrentLoading, handleAction]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isCurrentLoading && timeLeft === null) {
    return (
      <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-20 flex justify-center">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-8">
      <h3 className="text-white font-bold mb-6 text-lg">QR Generator</h3>

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] relative">
            {!activeSession && !isCurrentLoading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl p-4 text-center">
                <p className="text-gray-400 text-xs">No active QR session</p>
              </div>
            )}
            <QRCodeSVG
              value={qrValue || "placeholder"}
              size={200}
              className={!activeSession ? "opacity-10" : "opacity-100"}
            />
          </div>

          {activeSession && (
            <p className="text-gray-500 text-xs font-medium">
              {timeLeft === 0 || isGenerating ? (
                <span className="text-amber-500 flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin" /> Regenerating...
                </span>
              ) : (
                <>
                  Auto-refresh in:{" "}
                  <span className="text-white">{formatTime(timeLeft)}</span>
                </>
              )}
            </p>
          )}

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!activeSession}
              className="flex-1 flex items-center justify-center gap-2 border  border-[#968B79]/60 text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all disabled:opacity-30"
            >
              <Maximize2 size={14} /> Full Screen
            </button>
            <button
              onClick={handleAction}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : activeSession ? (
                <>
                  <RefreshCw size={14} /> Regenerate
                </>
              ) : (
                "Generate QR"
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
              QR Refresh Interval
            </label>
            <div className="relative">
              <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(Number(e.target.value))}
                className="w-full bg-black border  border-[#968B79]/60 text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer"
              >
                {intervalsData?.intervals.map((interval) => (
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
            The QR code will automatically regenerate when the timer reaches
            00:00. Location:{" "}
            <span className="text-gray-300 font-bold">
              {activeSession?.location || "Assigned Store"}
            </span>
          </p>
        </div>
      </div>

      <QRFullScreenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        value={qrValue}
      />
    </div>
  );
};

export default QRGenerator;
