import QRGenerator from "./QRGenerator";
import QRHistory from "./QRHistory";

export default function BranchManagerQrSection() {
  return (
    <div className="min-h-screen bg-black p-8 font-sans space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          QR Attendance
        </h1>
        <p className="text-gray-500 text-sm">
          Generate QR codes for employee clock-in and manage QR history.
        </p>
      </div>

      <QRGenerator />
      <QRHistory />
    </div>
  );
}
