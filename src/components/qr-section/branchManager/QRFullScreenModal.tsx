import React from "react";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
}

const QRFullScreenModal = ({ isOpen, onClose, value }: QRModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative flex flex-col items-center gap-8 animate-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        {/* Large QR Display */}
        <div className="bg-white p-8 rounded-[40px] shadow-[0_0_50px_rgba(255,255,255,0.15)]">
          <QRCodeSVG value={value} size={400} level="H" />
        </div>
      </div>
    </div>
  );
};

export default QRFullScreenModal;
