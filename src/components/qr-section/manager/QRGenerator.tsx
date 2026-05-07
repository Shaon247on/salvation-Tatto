"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, RefreshCw, ChevronDown } from "lucide-react";
import QRFullScreenModal from "./QRFullScreenModal";

const QRGenerator = () => {
  // 1. Added required states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(169); // 2:49 in seconds
  const qrValue = "https://your-app.com/verify/123"; // Your QR data

  // Simple countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRegenerate = () => {
    setTimeLeft(180);
    // Add logic here to update qrValue if needed
  };

  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-8">
      <h3 className="text-white font-bold mb-6 text-lg">QR Generator</h3>

      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        {/* QR Display Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <QRCodeSVG value={qrValue} size={200} />
          </div>
          <p className="text-gray-500 text-xs font-medium">
            Auto-refresh in:{" "}
            <span className="text-white">{formatTime(timeLeft)}</span>
          </p>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all"
            >
              <Maximize2 size={14} /> View Full Screen
            </button>
            <button
              onClick={handleRegenerate}
              className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-[#1A1A1A] transition-all"
            >
              <RefreshCw size={14} /> Regenerate QR
            </button>
          </div>
        </div>

        {/* Settings Area */}
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
              QR Refresh Interval
            </label>
            <div className="relative">
              <select className="w-full bg-black border  border-[#968B79]/60 text-white rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white/20 cursor-pointer">
                <option>Every 3 minutes</option>
                <option>Every 5 minutes</option>
                <option>Manual only</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
            The QR code will automatically regenerate based on the selected time
            interval to ensure secure attendance tracking.
          </p>
        </div>
      </div>

      {/* 2. Moved Modal to bottom level (Outside the button flex container) */}
      <QRFullScreenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        value={qrValue}
      />
    </div>
  );
};

export default QRGenerator;
