/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, RefreshCw, CheckCircle } from "lucide-react";
import { useGetClockInQrQuery } from "@/redux/services/admin/qrsSection/clockInApi";

export default function QRAttendeeView() {
  const {
    data: qrResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetClockInQrQuery();

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-[#c4a47c] animate-spin" />
      </div>
    );
  }

  if (error || !qrResponse?.qr_session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        <p>No active QR code available</p>
      </div>
    );
  }

  // We pass the session ID as a key to a child component.
  // When the ID changes (new QR generated), the child unmounts and remounts,
  // resetting its internal timer state perfectly without an Effect.
  return (
    <QRDisplayContent
      key={qrResponse.qr_session.id}
      qrResponse={qrResponse}
      refetch={refetch}
    />
  );
}

// --- Child Component that manages its own timer state ---
function QRDisplayContent({
  qrResponse,
  refetch,
}: {
  qrResponse: any;
  refetch: () => void;
}) {
  // 1. Initialize state directly from props. No Effect needed!
  const [secondsLeft, setSecondsLeft] = useState<number>(
    qrResponse.seconds_left ?? 0,
  );

  // 2. Only use Effect for the actual "External System" (the Interval)
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const token = qrResponse.qr_session.token;
  const locationName = qrResponse.location;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black p-8 font-sans space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Your QR Code
        </h1>
        <p className="text-gray-500 text-sm">
          Use this code to check in at your location
        </p>
      </div>

      <div className="max-w-md mx-auto bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <p className="text-lg font-bold text-[#c4a47c]">{locationName}</p>
        </div>

        <div className="flex justify-center">
          <span className="text-4xl font-mono font-bold text-white bg-black/60 px-8 py-2 rounded-xl border-2 border-[#c4a47c]">
            {formatTimer(secondsLeft)}
          </span>
        </div>

        <div className="flex justify-center p-6 bg-white rounded-lg">
          <QRCodeSVG value={token} size={320} />
        </div>

        <button
          onClick={() => refetch()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#121214] border border-[#2a2a2d] rounded-lg text-gray-300 hover:text-[#c4a47c] transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
    </div>
  );
}
