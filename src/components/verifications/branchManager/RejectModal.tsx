import React, { useState } from "react";
import { X } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (reason: string) => void;
}

const RejectModal = ({ isOpen, onClose, onConfirm }: RejectModalProps) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (onConfirm) onConfirm(reason);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content Container */}
      <div className="relative w-full max-w-md bg-[#0D0D0D] border border-[#262626] rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl">
        {/* Red Icon Box */}
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <X className="text-red-500" size={32} strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
          Reject Task
        </h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-[280px]">
          Provide a reason for rejecting this task. The employee will receive
          this feedback.
        </p>

        {/* Form Field */}
        <div className="w-full text-left space-y-2 mb-8">
          <label className="text-gray-600 text-[10px] font-bold uppercase tracking-widest ml-1">
            Rejection Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why the task was rejected..."
            className="w-full bg-[#141414] border border-[#262626] rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-500/50 min-h-[140px] resize-none transition-colors placeholder:text-gray-700"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-[#141414] text-gray-400 rounded-2xl font-bold hover:bg-[#1A1A1A] transition-colors border border-[#262626]"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!reason.trim()}
            className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
