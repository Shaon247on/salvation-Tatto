"use client";

import {
  Eye,
  CheckCircle2,
  Check,
  X as CloseIcon,
  Camera,
  RotateCcw,
} from "lucide-react";
import RejectModal from "./RejectModal";
import { cn } from "@/lib/utils";

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    employeeName: string;
    employeeInitials: string;
    role: string;
    location: string;
    taskName: string;
    description: string;
    dueDate: string;
    status: string;
    imageUrl?: string | null;
  } | null;
  onApprove?: () => Promise<void>;
  onRejectOpen?: () => void; // This opens the rejection input UI
  isApproving?: boolean;
  isPendingReview?: boolean;
}

const TaskDetailsModal = ({
  isOpen,
  onClose,
  data,
  onApprove,
  onRejectOpen,
  isApproving = false,
  isPendingReview = false,
}: TaskDetailsProps) => {
  if (!isOpen || !data) return null;

  // Constants for status checks
  const isApproved = data.status === "Approved";
  const isRejected = data.status === "Rejected";

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Glass Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#968B79]/60 rounded-[32px] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-8 pb-0 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-[#968B79]/60">
                <Eye className="text-gray-400" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Task Details
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  Submitted task information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Employee Section */}
            <section>
              <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Employee Information
              </h3>
              <div className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-500/20 text-teal-500 border border-teal-500/20 rounded-xl flex items-center justify-center font-bold text-lg">
                  {data.employeeInitials}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">
                    {data.employeeName}
                  </h4>
                  <p className="text-gray-500 text-xs">{data.role}</p>
                  <p className="text-gray-600 text-[10px] uppercase font-bold mt-1 tracking-wider">
                    {data.location}
                  </p>
                </div>
              </div>
            </section>

            {/* Task Info Section */}
            <section>
              <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Task Information
              </h3>
              <div className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-6 space-y-6">
                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                    Task Name
                  </label>
                  <p className="text-white font-semibold text-base">
                    {data.taskName}
                  </p>
                </div>

                <div>
                  <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                    Description
                  </label>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {data.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                      Due Date
                    </label>
                    <p className="text-white text-sm font-medium">
                      {data.dueDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                      Status
                    </label>
                    <div
                      className={cn(
                        "text-[10px] font-bold px-3 py-1.5 rounded-lg w-fit flex items-center gap-1.5 border uppercase tracking-wider",
                        isApproved &&
                          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        isRejected &&
                          "bg-rose-500/10 text-rose-400 border-rose-500/20",
                        isPendingReview &&
                          "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        !isApproved &&
                          !isRejected &&
                          !isPendingReview &&
                          "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      )}
                    >
                      {isApproved && <Check size={12} />}
                      {isRejected && <CloseIcon size={12} />}
                      {isPendingReview && <RotateCcw size={12} />}
                      {!isApproved && !isRejected && !isPendingReview && (
                        <CheckCircle2 size={12} />
                      )}
                      {data.status}
                    </div>
                  </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="mt-4">
                  {data.imageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-[#968B79]/60 bg-black">
                      <img
                        src={data.imageUrl}
                        alt="Task Proof"
                        className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#968B79]/60 rounded-2xl bg-black/20">
                      <Camera
                        size={40}
                        className="text-gray-800 mb-2"
                        strokeWidth={1.5}
                      />
                      <p className="text-gray-600 text-sm font-medium">
                        No photo uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              {isPendingReview ? (
                <>
                  <button
                    onClick={onApprove}
                    disabled={isApproving}
                    className="flex-1 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Check size={18} />
                    {isApproving ? "Approving..." : "Approve Task"}
                  </button>
                  <button
                    onClick={onRejectOpen}
                    disabled={isApproving}
                    className="flex-1 bg-red-500/5 border border-red-500/20 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CloseIcon size={18} /> Reject Task
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border opacity-50 cursor-not-allowed",
                    isApproved
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                      : isRejected
                        ? "bg-red-500/5 border-red-500/20 text-red-500"
                        : "bg-gray-500/5 border-gray-500/20 text-gray-500",
                  )}
                >
                  {isApproved ? (
                    <>
                      <Check size={18} /> Task Approved
                    </>
                  ) : isRejected ? (
                    <>
                      <CloseIcon size={18} /> Task Rejected
                    </>
                  ) : (
                    "Action Completed"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailsModal;
