"use client";

import {
  Camera,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import type {
  VerificationTask,
  VerificationTab,
} from "@/types/branchManager/branchManagerVerification.type";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface VerificationCardProps {
  data: VerificationTask;
  activeTab: VerificationTab;
  onClick: () => void;
  // Reject takes no body — fires immediately on click
  onApprove: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  onReject: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
  isDeleting?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const VerificationCard = ({
  data,
  activeTab,
  onClick,
  onApprove,
  onReject,
  onDelete,
  isApproving = false,
  isRejecting = false,
  isDeleting = false,
}: VerificationCardProps) => {
  const initials = data.assigned_to.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="bg-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden flex flex-col hover:border-[#404040] transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Photo / Placeholder */}
      <div className="relative h-48 bg-[#141414]">
        {data.photo_url ? (
          <>
            <Image
            width={600}
            height={400}
              src={data.photo_url}
              alt={data.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-[10px] text-white">
              <Camera size={12} /> Photo proof
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <CheckCircle2 size={32} strokeWidth={1} />
            <span className="text-[10px] mt-2 italic text-gray-500">
              {data.requires_photo ? "Photo required" : "No photo required"}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 flex-1">
        <div>
          <h3 className="text-white font-bold text-base">{data.title}</h3>
          <p className="text-gray-500 text-xs italic mt-1 leading-relaxed">
            {data.description}
          </p>
          <div className="mt-2 text-[11px] text-gray-400">
            Assigned By:{" "}
            <span className="text-white font-medium">
              {data.created_by.role}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <User size={14} /> {data.assigned_to.name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Briefcase size={14} /> {data.assigned_to.role}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Calendar size={14} /> Due {data.due_date}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <MapPin size={14} /> {data.location_name}
            </div>
          </div>
          {data.submitted_at && (
            <div className="flex items-center gap-2 text-gray-500 text-[11px] pt-1">
              <Clock size={14} /> Submitted {data.submitted_at}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
          {activeTab === "awaiting_review" && (
            <div className="flex gap-2">
              <button
                onClick={onApprove}
                disabled={isApproving}
                className="flex-1 flex items-center justify-center gap-2 border border-emerald-500/40 text-emerald-500 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                {isApproving ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={onReject}
                disabled={isRejecting}
                className="flex-1 flex items-center justify-center gap-2 border border-red-500/40 text-red-400 py-2.5 rounded-xl text-xs font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <XCircle size={14} />
                )}
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}

          {activeTab === "approved" && (
            <button
              disabled
              className="border border-emerald-500/50 text-emerald-500 px-4 py-1.5 rounded-lg text-xs font-bold bg-transparent opacity-70 cursor-default"
            >
              Approved
            </button>
          )}

          {activeTab === "rejected" && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl text-[10px] font-bold text-center uppercase tracking-widest">
              {data.rejection_reason
                ? `Reason: ${data.rejection_reason}`
                : "Task Rejected"}
            </div>
          )}

          {activeTab === "overdue" && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-500 px-3 py-2 rounded-xl text-[10px] font-bold text-center uppercase tracking-widest">
              Task Overdue
            </div>
          )}

          {/* Server-gated edit/delete — only shown when can_delete is true */}
          {data.can_delete && (
            <div className="flex gap-2 mt-2">
              {data.can_edit && (
                <button className="flex-1 flex items-center justify-center gap-2 border border-[#262626] text-gray-300 py-2.5 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">
                  <Pencil size={14} /> Edit
                </button>
              )}
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 border border-red-500/40 text-red-500 py-2.5 rounded-xl text-xs font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};