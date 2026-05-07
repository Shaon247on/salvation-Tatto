"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FireUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userData: {
    name: string;
    email: string;
  } | null;
  isLoading?: boolean;
}

export default function FireUserModal({
  isOpen,
  onClose,
  onConfirm,
  userData,
  isLoading = false,
}: FireUserModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-[32px] overflow-hidden p-8 relative">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <X className="text-red-500 w-8 h-8" strokeWidth={3} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Fire User</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Provide a reason for firing this user. The employee will receive
            this feedback.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 ml-1">
              Employee Name
            </label>
            <input
              type="text"
              disabled
              value={userData?.name || "N/A"}
              className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl py-4 px-5 text-gray-400 cursor-not-allowed outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={userData?.email || "N/A"}
              className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl py-4 px-5 text-gray-400 cursor-not-allowed outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2 ml-1">
              Fire Reason
            </label>
            <textarea
              placeholder="Explain why the user is being terminated..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(false);
              }}
              disabled={isLoading}
              rows={4}
              className={cn(
                "w-full bg-[#0D0D0D] border rounded-2xl py-4 px-5 text-white outline-none transition-all resize-none placeholder:text-gray-700 disabled:opacity-50",
                error
                  ? "border-red-500/50"
                  : "border-[#1A1A1A] focus:border-[#968B79]/40",
              )}
            />
            {error && (
              <p className="text-red-500 text-[10px] mt-2 flex items-center gap-1 font-bold uppercase tracking-wider">
                <AlertCircle size={12} /> Please provide a reason for
                termination
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-10">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-4 bg-transparent border border-[#1A1A1A] text-gray-400 rounded-2xl font-bold hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-4 bg-[#FF3B3B] text-white rounded-2xl font-bold hover:bg-[#E63535] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
