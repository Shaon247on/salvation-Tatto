"use client";

import React from "react";
import {
  Eye,
  Check,
  X as CloseIcon,
  Camera,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  VerificationTask,
  TaskDetail,
} from "@/types/branchManager/branchManagerVerification.type";
import { useGetTaskDetailQuery } from "@/redux/services/branchManager/verifications/branchManagerVerificationSlice";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We receive the slim list item to get the id, then fetch the rich detail
  task: VerificationTask | null;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
}

// ─── Status Styles ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  approved: "border-green-500/30 text-green-500 bg-green-500/5",
  overdue: "border-red-500/30 text-red-500 bg-red-500/5",
  awaiting_review: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
  pending: "border-blue-500/30 text-blue-500 bg-blue-500/5",
  rejected: "border-red-500/30 text-red-500 bg-red-500/5",
};

// ─── Helper ─────────────────────────────────────────────────────────────────────

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Inner Modal Content (rendered after detail is loaded) ─────────────────────

interface ModalContentProps {
  detail: TaskDetail;
  onClose: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

function ModalContent({
  detail,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ModalContentProps) {
  const status = detail.status;
  const isPendingReview = status === "awaiting_review";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isOverdue = status === "overdue";

  const initials = getInitials(
    detail.assigned_to.first_name,
    detail.assigned_to.last_name,
  );

  const handleApprove = async () => {
    await onApprove(detail.id);
    onClose();
  };

  const handleReject = async () => {
    await onReject(detail.id);
    onClose();
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto">
      {/* Employee Section */}
      <section>
        <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          Employee Information
        </h3>
        <div className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-500/20 text-teal-500 border border-teal-500/20 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="text-white font-bold text-base">
              {detail.assigned_to.first_name} {detail.assigned_to.last_name}
            </h4>
            <p className="text-gray-500 text-xs">
              {detail.assigned_to.role_display}
            </p>
            <p className="text-gray-600 text-[10px] uppercase font-bold mt-1 tracking-wider">
              {detail.location_name}
            </p>
          </div>
        </div>
      </section>

      {/* Task Info */}
      <section className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
            Task Name
          </label>
          <p className="text-white font-semibold text-base">{detail.title}</p>
        </div>

        {detail.description && (
          <div>
            <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
              Description
            </label>
            <p className="text-gray-300 text-sm leading-relaxed">
              {detail.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
              Due Date
            </label>
            <p className="text-white text-sm font-medium">{detail.due_date}</p>
          </div>
          <div>
            <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
              Status
            </label>
            <div
              className={cn(
                "text-[10px] font-bold px-3 py-1.5 rounded-lg w-fit flex items-center gap-1.5 border uppercase tracking-wider",
                STATUS_STYLES[status],
              )}
            >
              {isApproved && <Check size={12} />}
              {isRejected && <CloseIcon size={12} />}
              {isPendingReview && <RotateCcw size={12} />}
              {isOverdue && <AlertTriangle size={12} />}
              {status === "pending" && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
              {detail.status_display}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
              Assigned By
            </label>
            <p className="text-white text-sm font-medium">
              {detail.created_by.role_display}
            </p>
          </div>
          <div>
            <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
              Frequency
            </label>
            <p className="text-white text-sm font-medium capitalize">
              {detail.frequency === "none" ? "One-time" : detail.frequency}
            </p>
          </div>
        </div>

        {/* Approved by */}
        {detail.approved_by && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                Approved By
              </label>
              <p className="text-white text-sm font-medium">
                {detail.approved_by.first_name} {detail.approved_by.last_name}
              </p>
            </div>
            <div>
              <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                Approved At
              </label>
              <p className="text-white text-sm font-medium">
                {formatDate(detail.approved_at)}
              </p>
            </div>
          </div>
        )}

        {/* Rejected by */}
        {detail.rejected_by && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                Rejected By
              </label>
              <p className="text-white text-sm font-medium">
                {detail.rejected_by.first_name} {detail.rejected_by.last_name}
              </p>
            </div>
            <div>
              <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
                Rejected At
              </label>
              <p className="text-white text-sm font-medium">
                {formatDate(detail.rejected_at)}
              </p>
            </div>
          </div>
        )}

        {/* Rejection reason */}
        {isRejected && detail.rejection_reason && (
          <div>
            <label className="text-gray-600 text-[10px] uppercase font-bold mb-1 block tracking-wider">
              Rejection Reason
            </label>
            <p className="text-red-400 text-sm leading-relaxed">
              {detail.rejection_reason}
            </p>
          </div>
        )}
      </section>

      {/* Photo Proof */}
      {detail.photo_url && (
        <section>
          <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Photo Proof
          </h3>
          <div className="rounded-2xl overflow-hidden border border-[#968B79]/30 relative">
            <Image
              width={600}
              height={400}
              src={detail.photo_url}
              alt="Task proof"
              className="w-full max-h-72 object-cover"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-[10px] text-white">
              <Camera size={12} /> Photo proof
            </div>
          </div>
        </section>
      )}

      {/* Completed By */}
      {detail.completed_by && (
        <section className="bg-[#141414] border border-[#968B79]/30 rounded-2xl p-4">
          <label className="text-gray-600 text-[10px] uppercase font-bold mb-2 block tracking-wider">
            Completed By
          </label>
          <p className="text-white text-sm font-medium">
            {detail.completed_by.first_name} {detail.completed_by.last_name}
            <span className="text-gray-500 ml-2 text-xs font-normal">
              ({detail.completed_by.role_display})
            </span>
          </p>
          {detail.completed_at && (
            <p className="text-gray-500 text-xs mt-1">
              {formatDate(detail.completed_at)}
            </p>
          )}
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-2 shrink-0">
        {isPendingReview && (
          <>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 bg-green-500/10 border border-green-500/20 text-green-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isApproving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isApproving ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isRejecting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CloseIcon size={18} />
              )}
              {isRejecting ? "Rejecting..." : "Reject"}
            </button>
          </>
        )}

        {detail.can_fire && (
          <button className="flex-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500/20 transition-all">
            <Zap size={18} /> Fire Employee
          </button>
        )}

        {(isApproved || isRejected || isOverdue) && !detail.can_fire && (
          <button
            disabled
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border opacity-40 cursor-not-allowed",
              STATUS_STYLES[status],
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
  );
}

// ─── Main Modal Shell ──────────────────────────────────────────────────────────

const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: TaskDetailsModalProps) => {
  // Fetch full task detail only when modal is open and we have a task id
  const {
    data: detail,
    isLoading,
    isError,
  } = useGetTaskDetailQuery(task?.id ?? 0, { skip: !isOpen || !task });

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#968B79]/60 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header — always visible */}
        <div className="p-8 pb-0 flex justify-between items-start shrink-0">
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

        {/* Body */}
        {isLoading && (
          <div className="flex items-center justify-center h-64 gap-3 text-gray-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading task details...
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-64 text-red-500 text-sm">
            Failed to load task details. Please try again.
          </div>
        )}

        {detail && (
          <ModalContent
            detail={detail}
            onClose={onClose}
            onApprove={onApprove}
            onReject={onReject}
            isApproving={isApproving}
            isRejecting={isRejecting}
          />
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
