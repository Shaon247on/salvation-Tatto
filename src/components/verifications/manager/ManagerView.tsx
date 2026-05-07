"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useGetVerificationsForDistrictManagerQuery,
  useApproveTaskForDistrictManagerMutation,
  useRejectTaskForDistrictManagerMutation,
} from "@/redux/services/districtManager/districtManagerVerification";

import { StatSummary } from "./StatSummary";
import { VerificationCard } from "./VerificationCard";
import TaskDetailsModal from "./TaskDetailsModal";
import RejectModal from "./RejectModal";

type TabType =
  | "awaiting_review"
  | "approved"
  | "pending"
  | "overdue"
  | "rejected";

export default function VerificationsManager() {
  const [selectedTab, setSelectedTab] = useState<TabType>("pending");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const { data, isLoading } = useGetVerificationsForDistrictManagerQuery({
    tab: selectedTab,
  });

  const [approveTask, { isLoading: approving }] =
    useApproveTaskForDistrictManagerMutation();

  const [rejectTask] = useRejectTaskForDistrictManagerMutation();

  // ✅ Correct mapping (NO STATUS OVERRIDE)
  const tasks =
    data?.tasks?.results?.map((item) => ({
      id: item.id,
      taskName: item.title,
      description: item.description,
      employeeName: item.assigned_to?.name,
      employeeInitials: item.assigned_to?.name?.slice(0, 2).toUpperCase(),
      role: item.assigned_to?.role,
      location: item.location?.name,
      submittedTime: item.submitted_at ?? "Not Submitted",
      dueDate: item.due_date,
      status: item.status,
      assignBy: item.created_by?.role,
      imageUrl: item.photo_url,
    })) ?? [];

  // ✅ Approve
  const handleApprove = async (task: any) => {
    if (task.status !== "awaiting_review") return;

    try {
      await approveTask(task.id).unwrap();
      setShowDetail(false);
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  // ✅ Reject
  const handleReject = async (reason: string) => {
    if (!selectedTask || selectedTask.status !== "awaiting_review") return;

    try {
      await rejectTask({
        id: String(selectedTask.id),
        rejection_reason: reason,
      }).unwrap();

      setShowReject(false);
      setShowDetail(false);
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "awaiting_review", label: "Awaiting Review" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "overdue", label: "Overdue" },
  ];

  return (
    <div className="space-y-8 p-2">
      {/* Stats */}{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSummary
          label="Awaiting Review"
          count={data?.stats?.awaiting_review ?? 0}
          color="blue"
        />
        <StatSummary
          label="Approved"
          count={data?.stats?.approved ?? 0}
          color="green"
        />
        <StatSummary
          label="Pending"
          count={data?.stats?.pending ?? 0}
          color="purple"
        />
        <StatSummary
          label="Overdue"
          count={data?.stats?.overdue ?? 0}
          color="red"
        />{" "}
      </div>
      ```
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#0A0A0A] border border-[#262626] rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={cn(
              "px-6 py-2 text-xs font-bold rounded-xl",
              selectedTab === tab.id ? "bg-white text-black" : "text-gray-400",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <VerificationCard
            key={task.id}
            data={task}
            activeTab={selectedTab}
            onClick={() => {
              setSelectedTask(task);
              setShowDetail(true);
            }}
            onApprove={(e: any) => {
              e.stopPropagation();
              handleApprove(task);
            }}
            onReject={(e: any) => {
              e.stopPropagation();
              setSelectedTask(task);
              setShowReject(true);
            }}
          />
        ))}
      </div>
      {/* Modals */}
      <TaskDetailsModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        data={selectedTask}
        onApprove={() => handleApprove(selectedTask)}
        onReject={() => setShowReject(true)}
        loading={approving}
      />
      <RejectModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
      />
    </div>
  );
}
