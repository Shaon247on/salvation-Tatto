"use client";

import React, { useState } from "react";
import {
  Eye,
  Check,
  X as CloseIcon,
  RotateCcw,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import RejectModal from "./RejectModal";
import { cn } from "@/lib/utils";

import {
  useApproveTaskForDistrictManagerMutation,
  useRejectTaskForDistrictManagerMutation,
} from "@/redux/services/districtManager/districtManagerVerification";

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const TaskDetailsModal = ({ isOpen, onClose, data }: TaskDetailsProps) => {
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [approveTask, { isLoading: approving }] =
    useApproveTaskForDistrictManagerMutation();

  const [rejectTask, { isLoading: rejecting }] =
    useRejectTaskForDistrictManagerMutation();

  const styles: Record<string, string> = {
    approved: "border-green-500/30 text-green-500 bg-green-500/5",
    overdue: "border-red-500/30 text-red-500 bg-red-500/5",
    awaiting_review: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
    pending: "border-blue-500/30 text-blue-500 bg-blue-500/5",
    rejected: "border-red-500/30 text-red-500 bg-red-500/5",
  };

  if (!isOpen || !data) return null;

  const status = data.status;

  const isAwaitingReview = status === "awaiting_review";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isPending = status === "pending";
  const isOverdue = status === "overdue";

  const canModifyPending =
    isPending &&
    (data.assignedByRole === data.currentUserRole ||
      data.currentUserRole === "District Manager");

  // ✅ APPROVE HANDLER
  const handleApprove = async () => {
    try {
      await approveTask(data.id).unwrap();
      onClose();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  // ✅ REJECT HANDLER
  const handleReject = async (reason: string) => {
    try {
      await rejectTask({
        id: data.id,
        rejection_reason: reason,
      }).unwrap();
      setIsRejectOpen(false);
      onClose();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#968B79]/60 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
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

          <div className="p-8 space-y-8 overflow-y-auto">
            {/* Employee Section */}
            <section>
              <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-center sm:text-left">
                Employee Information
              </h3>
              <div className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-500/20 text-teal-500 border border-teal-500/20 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
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

            {/* Task Info */}
            <section className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-6 space-y-6">
              <div>
                <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                  Task Name
                </label>
                <p className="text-white font-semibold text-base">
                  {data.taskName}
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
                      styles[status]
                    )}
                  >
                    {isApproved && <Check size={12} />}
                    {isRejected && <CloseIcon size={12} />}
                    {isAwaitingReview && <RotateCcw size={12} />}
                    {isOverdue && <AlertTriangle size={12} />}
                    {isPending && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    {status}
                  </div>
                </div>
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-2 shrink-0">
              {/* ✅ Awaiting Review Only */}
              {isAwaitingReview && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="flex-1 bg-green-500/10 border border-green-500/20 text-green-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Check size={18} />{" "}
                    {approving ? "Approving..." : "Approve"}
                  </button>

                  <button
                    onClick={() => setIsRejectOpen(true)}
                    disabled={rejecting}
                    className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CloseIcon size={18} /> Reject
                  </button>
                </>
              )}

              {/* Pending */}
              {isPending &&
                (canModifyPending ? (
                  <>
                    <button className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                      <Edit2 size={18} /> Edit
                    </button>
                    <button className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
                      <Trash2 size={18} /> Delete
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-4 bg-gray-500/5 border border-gray-500/20 text-gray-500 rounded-2xl font-bold opacity-50 cursor-not-allowed"
                  >
                    Assigned by {data.assignedByRole}
                  </button>
                ))}

              {/* Final States */}
              {(isApproved || isRejected || isOverdue) && (
                <button
                  disabled
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border opacity-40 cursor-not-allowed",
                    styles[status]
                  )}
                >
                  {isApproved && (
                    <>
                      <Check size={18} /> Task Approved
                    </>
                  )}
                  {isRejected && (
                    <>
                      <CloseIcon size={18} /> Task Rejected
                    </>
                  )}
                  {isOverdue && (
                    <>
                      <AlertTriangle size={18} /> Task Overdue
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Reject Modal wired */}
      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
      />
    </>
  );
};

export default TaskDetailsModal;