"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import { StatSummary } from "./StatSummary";
import { VerificationCard } from "./VerificationCard";
import TaskDetailsModal from "./TaskDetailsModal";

import {
  useGetVerificationsQuery,
  useApproveTaskMutation,
  useRejectTaskMutation,
  useDeleteTaskMutation,
} from "@/redux/services/branchManager/verifications/branchManagerVerificationSlice";
import type {
  VerificationTab,
  VerificationTask,
} from "@/types/branchManager/branchManagerVerification.type";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: VerificationTab; label: string }[] = [
  { id: "awaiting_review", label: "Awaiting Review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "overdue", label: "Overdue" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function VerificationsBranchManager() {
  const [selectedTab, setSelectedTab] = useState<VerificationTab>("awaiting_review");
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // ─── Queries & Mutations ─────────────────────────────────────────────────

  const { data, isLoading, isError, isFetching } =
    useGetVerificationsQuery(selectedTab);

  const [approveTask, { isLoading: isApproving }] = useApproveTaskMutation();
  // Reject takes no body — just the task id
  const [rejectTask, { isLoading: isRejecting }] = useRejectTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleApprove = async (id: number) => {
    await approveTask(id).unwrap();
  };

  // No rejection_reason — API takes no body for reject
  const handleReject = async (id: number) => {
    await rejectTask(id).unwrap();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id).unwrap();
  };

  const openDetail = (task: VerificationTask) => {
    setSelectedTask(task);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedTask(null);
  };

  // ─── Derived ─────────────────────────────────────────────────────────────

  const tasks = data?.tasks.results ?? [];
  const stats = data?.stats;

  return (
    <div className="space-y-8 p-2">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Task Verifications</h1>
        <p className="text-muted-foreground text-sm">
          Manage and review branch-level tasks.
        </p>
      </div>

      {/* 1. Stats Grid — all values from API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSummary
          label="Awaiting Review"
          count={stats?.awaiting_review ?? 0}
          color="blue"
        />
        <StatSummary
          label="Approved"
          count={stats?.approved ?? 0}
          color="green"
        />
        <StatSummary
          label="Pending"
          count={stats?.pending ?? 0}
          color="purple"
        />
        <StatSummary
          label="Overdue"
          count={stats?.overdue ?? 0}
          color="red"
        />
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0A0A0A] border border-[#262626] rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={cn(
              "px-6 py-2 text-xs font-bold rounded-xl transition-all",
              selectedTab === tab.id
                ? "bg-white text-black"
                : "text-gray-400 hover:text-gray-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading / Error / Refreshing */}
      {isError && (
        <div className="flex items-center justify-center h-40 text-red-500 text-sm">
          Failed to load verifications. Please try again.
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-40 gap-3 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading verifications...
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Loader2 className="w-3 h-3 animate-spin" />
          Refreshing...
        </div>
      )}

      {/* 3. Task Cards */}
      {!isLoading && !isError && (
        <>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm italic">
              No tasks found for this tab.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <VerificationCard
                  key={task.id}
                  data={task}
                  activeTab={selectedTab}
                  isApproving={isApproving}
                  isRejecting={isRejecting}
                  isDeleting={isDeleting}
                  onClick={() => openDetail(task)}
                  onApprove={async (e) => {
                    e.stopPropagation();
                    await handleApprove(task.id);
                  }}
                  onReject={async (e) => {
                    e.stopPropagation();
                    await handleReject(task.id);
                  }}
                  onDelete={async (e) => {
                    e.stopPropagation();
                    await handleDelete(task.id);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Task Detail Modal — fetches rich detail itself via useGetTaskDetailQuery */}
      <TaskDetailsModal
        isOpen={showDetail}
        onClose={closeDetail}
        task={selectedTask}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  );
}