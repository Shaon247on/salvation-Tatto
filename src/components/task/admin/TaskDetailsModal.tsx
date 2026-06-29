"use client";

import {
  Eye,
  CheckCircle2,
  Check,
  X as CloseIcon,
  Camera,
  RotateCcw,
  User,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { selectUserRole } from "@/redux/features/auth/authSlice";

// --- Import API Hooks ---
import {
  // Super Admin Hooks
  useGetTaskDetailsQuery as useGetTaskDetailsAdminQuery,
  useApproveTaskMutation as useApproveTaskAdminMutation,
  useRejectTaskMutation as useRejectTaskAdminMutation,
  // District Manager Hooks
  useGetTasksByDistrictManagerQuery,
  useApproveTaskMutation as useApproveTaskDMMutation,
  useRejectTaskMutation as useRejectTaskDMMutation,
} from "@/redux/services/admin/tasks/taskApi";
import { useGetManagerTaskDetailsQuery } from "@/redux/services/branchManager/task/theBranchManagerTaskApi";

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  onApprove?: () => Promise<void>;
  onRejectOpen?: () => void;
  isApproving?: boolean;
  isPendingReview?: boolean;
}

// Image Viewer Modal Component
const ImageViewerModal = ({
  isOpen,
  onClose,
  imageUrl,
  employeeName,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  employeeName: string;
}) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
      >
        <CloseIcon size={24} className="text-white" />
      </button>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={`${employeeName}'s submission`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              priority
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
          <p className="text-white text-sm font-medium">
            {employeeName}'s Submission
          </p>
        </div>
      </div>
    </div>
  );
};

// Individual Assignment Approve/Reject API Calls
const useAssignmentActions = () => {
  const userRole = useAppSelector(selectUserRole);
  const isBranchManager = userRole === "branch_manager";
  const isDistrictManager = userRole === "district_manager";
  
  const [approveTaskAdmin] = useApproveTaskAdminMutation();
  const [rejectTaskAdmin] = useRejectTaskAdminMutation();
  const [approveTaskDM] = useApproveTaskDMMutation();
  const [rejectTaskDM] = useRejectTaskDMMutation();

  // Select appropriate mutations based on role
  const approveTask = isDistrictManager ? approveTaskDM : approveTaskAdmin;
  const rejectTask = isDistrictManager ? rejectTaskDM : rejectTaskAdmin;

  const approveAssignment = async (taskId: number, assignmentId: number) => {
    try {
      const body = {
        taskId,
        assignmentId,
      };
      const result = await approveTask(body).unwrap();
      return { success: true, message: result.message };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || "Failed to approve assignment",
      };
    }
  };

  const rejectAssignment = async (
    taskId: number,
    assignmentId: number,
    rejectionReason: string,
  ) => {
    try {
      const result = await rejectTask({
        id: taskId,
        rejection_reason: rejectionReason,
        assignmentId: assignmentId,
      }).unwrap();
      return { success: true, message: result.message };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || "Failed to reject assignment",
      };
    }
  };

  return { approveAssignment, rejectAssignment };
};

const TaskDetailsModal = ({
  isOpen,
  onClose,
  id,
  onApprove,
  onRejectOpen,
  isApproving = false,
  isPendingReview = false,
}: TaskDetailsProps) => {
  const userRole = useAppSelector(selectUserRole);
  const isBranchManager = userRole === "branch_manager";
  const isDistrictManager = userRole === "district_manager";

  console.log("the id:", id);
  console.log("User Role:", userRole);
  console.log("Is Branch Manager:", isBranchManager);
  console.log("Is District Manager:", isDistrictManager);

  // --- API Queries based on role - Always call all hooks unconditionally ---

  // Branch Manager Task Details
  const {
    data: bmData,
    isLoading: bmLoading,
    isError: bmError,
    refetch: bmRefetch,
  } = useGetManagerTaskDetailsQuery(id, {
    skip: !isBranchManager || !isOpen,
  });

  // District Manager Task Details - using getTasksByDistrictManagerQuery
  const {
    data: dmListData,
    isLoading: dmListLoading,
    isError: dmListError,
    refetch: dmListRefetch,
  } = useGetTasksByDistrictManagerQuery(
    {
      page: 1,
      search: "",
    },
    { skip: !isDistrictManager || !isOpen },
  );

  // Super Admin Task Details
  const {
    data: adminData,
    isLoading: adminLoading,
    isError: adminError,
    refetch: adminRefetch,
  } = useGetTaskDetailsAdminQuery(id, {
    skip: isBranchManager || isDistrictManager || !isOpen,
  });

  // Determine which data to use
  let data, isLoading, isError, refetch;

  if (isBranchManager) {
    data = bmData;
    isLoading = bmLoading;
    isError = bmError;
    refetch = bmRefetch;
  } else if (isDistrictManager) {
    // For district manager, we need to find the specific task from the list
    const taskData = dmListData?.tasks?.results?.find(
      (task: any) => task.task_id === id || task.id === id
    );
    data = taskData;
    isLoading = dmListLoading;
    isError = dmListError;
    refetch = dmListRefetch;
  } else {
    data = adminData;
    isLoading = adminLoading;
    isError = adminError;
    refetch = adminRefetch;
  }

  // API Mutations
  const [approveTask, { isLoading: isBulkApproving }] =
    useApproveTaskAdminMutation();
  const [rejectTask, { isLoading: isBulkRejecting }] = useRejectTaskAdminMutation();

  const { approveAssignment, rejectAssignment } = useAssignmentActions();

  const [expandedAssignment, setExpandedAssignment] = useState<number | null>(
    null,
  );
  const [individualApproving, setIndividualApproving] = useState<number | null>(
    null,
  );
  const [individualRejecting, setIndividualRejecting] = useState<number | null>(
    null,
  );
  const [viewerImage, setViewerImage] = useState<{
    url: string;
    employeeName: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectingAssignmentId, setRejectingAssignmentId] = useState<
    number | null
  >(null);

  if (!isOpen) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      awaiting_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      overdue: "bg-red-500/10 text-red-400 border-red-500/20",
      completed: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return (
      statusMap[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
    );
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      approved: <Check size={12} />,
      rejected: <CloseIcon size={12} />,
      awaiting_review: <RotateCcw size={12} />,
      pending: <Clock size={12} />,
      overdue: <AlertCircle size={12} />,
      completed: <CheckCircle2 size={12} />,
    };
    return iconMap[status] || <CheckCircle2 size={12} />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleAssignmentExpand = (assignmentId: number) => {
    setExpandedAssignment(
      expandedAssignment === assignmentId ? null : assignmentId,
    );
  };

  // Handle individual assignment approval
  const handleIndividualApprove = async (assignmentId: number) => {
    setIndividualApproving(assignmentId);
    try {
      const result = await approveAssignment(id, assignmentId);
      if (result.success) {
        // Refetch the task details to update the UI
        refetch();
        // Close the expanded view after approval
        setExpandedAssignment(null);
      } else {
        console.error("Failed to approve assignment:", result.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Failed to approve assignment:", error);
    } finally {
      setIndividualApproving(null);
    }
  };

  // Handle individual assignment rejection
  const handleIndividualReject = async (assignmentId: number) => {
    setRejectingAssignmentId(assignmentId);
    setShowRejectModal(true);
  };

  // Handle rejection confirmation
  const confirmRejection = async () => {
    if (!rejectingAssignmentId || !rejectionReason.trim()) return;

    setIndividualRejecting(rejectingAssignmentId);
    try {
      const result = await rejectAssignment(
        id,
        rejectingAssignmentId,
        rejectionReason,
      );
      if (result.success) {
        // Refetch the task details to update the UI
        refetch();
        // Close the expanded view after rejection
        setExpandedAssignment(null);
        // Close the reject modal
        setShowRejectModal(false);
        setRejectionReason("");
        setRejectingAssignmentId(null);
      } else {
        console.error("Failed to reject assignment:", result.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Failed to reject assignment:", error);
    } finally {
      setIndividualRejecting(null);
    }
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    try {
      await approveTask(id).unwrap();
      refetch();
      if (onApprove) await onApprove();
    } catch (error) {
      console.error("Failed to approve task:", error);
      // You might want to show a toast notification here
    }
  };

  // Handle bulk reject
  const handleBulkReject = async () => {
    setShowRejectModal(true);
    setRejectingAssignmentId(null); // null indicates bulk reject
  };

  // Handle bulk rejection confirmation
  const confirmBulkRejection = async () => {
    if (!rejectionReason.trim()) return;

    try {
      await rejectTask({ id, rejection_reason: rejectionReason }).unwrap();
      refetch();
      if (onRejectOpen) onRejectOpen();
      setShowRejectModal(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Failed to reject task:", error);
      // You might want to show a toast notification here
    }
  };

  const openImageViewer = (imageUrl: string, employeeName: string) => {
    setViewerImage({ url: imageUrl, employeeName });
  };

  const closeImageViewer = () => {
    setViewerImage(null);
  };

  // Calculate stats for the header
  const totalAssignments = data?.assignments?.length || 0;
  const approvedCount =
    data?.assignments?.filter((a: any) => a.status === "approved")
      .length || 0;
  const rejectedCount =
    data?.assignments?.filter((a: any) => a.status === "rejected")
      .length || 0;
  const pendingCount =
    data?.assignments?.filter(
      (a: any) =>
        a.status === "pending" || a.status === "awaiting_review",
    ).length || 0;

  // Check if there are any pending/awaiting_review assignments
  const hasPendingAssignments = data?.assignments?.some(
    (a: any) =>
      a.status === "pending" || a.status === "awaiting_review",
  );

  console.log("details data:", data);

  return (
    <>
      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={!!viewerImage}
        onClose={closeImageViewer}
        imageUrl={viewerImage?.url || ""}
        employeeName={viewerImage?.employeeName || ""}
      />

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="relative w-full max-w-md bg-[#0D0D0D] border border-[#968B79]/60 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">
              Rejection Reason
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Please provide a reason for rejecting{" "}
              {rejectingAssignmentId ? "this assignment" : "all assignments"}.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-[#1A1A1A] border border-[#968B79]/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#968B79] transition-colors resize-none h-24"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setRejectingAssignmentId(null);
                }}
                className="flex-1 bg-gray-500/10 border border-gray-500/20 text-gray-400 py-3 rounded-xl font-bold hover:bg-gray-500/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={
                  rejectingAssignmentId
                    ? confirmRejection
                    : confirmBulkRejection
                }
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 py-3 rounded-xl font-bold hover:bg-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejectingAssignmentId ? "Reject Assignment" : "Reject All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glass Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="relative w-full max-w-5xl bg-[#0D0D0D] border border-[#968B79]/60 rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 pb-2 flex justify-between items-start shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center border border-[#968B79]/60">
                <Eye className="text-gray-400" size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Task Details
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  Review and manage individual assignments
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

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Loading / Error States */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-2 border-[#968B79]/60 border-t-[#968B79] rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm animate-pulse">
                    Loading task details...
                  </p>
                </div>
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="text-rose-400" size={48} />
                  <p className="text-rose-400 text-sm">
                    Failed to load task details.
                  </p>
                </div>
              </div>
            )}

            {data && (
              <>
                {/* Task Overview Section */}
                <section className="mb-8">
                  <div className="bg-[#141414] border border-[#968B79]/60 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold text-lg">
                            {data.title}
                          </h4>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider",
                              getStatusColor(
                                data.assignments?.some(
                                  (a: any) =>
                                    a.status === "rejected",
                                )
                                  ? "rejected"
                                  : data.assignments?.some(
                                        (a: any) =>
                                          a.status === "awaiting_review",
                                      )
                                    ? "awaiting_review"
                                    : data.assignments?.every(
                                          (a: any) =>
                                            a.status === "approved",
                                        )
                                      ? "approved"
                                      : "pending",
                              ),
                            )}
                          >
                            {data.assignments?.some(
                              (a: any) => a.status === "rejected",
                            )
                              ? "Rejected"
                              : data.assignments?.some(
                                    (a: any) =>
                                      a.status === "awaiting_review",
                                  )
                                ? "Awaiting Review"
                                : data.assignments?.every(
                                      (a: any) =>
                                        a.status === "approved",
                                    )
                                  ? "Approved"
                                  : "Pending"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {data.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="rounded-xl border border-[#968B79]/20 bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase text-gray-600">
                            Total Assigned
                          </p>
                          <User size={14} className="text-gray-600" />
                        </div>
                        <p className="text-white font-semibold text-xl mt-1">
                          {totalAssignments}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#968B79]/20 bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase text-gray-600">
                            Pending Review
                          </p>
                          <Clock size={14} className="text-amber-400" />
                        </div>
                        <p className="text-amber-400 font-semibold text-xl mt-1">
                          {pendingCount}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#968B79]/20 bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase text-gray-600">
                            Approved
                          </p>
                          <ThumbsUp size={14} className="text-emerald-400" />
                        </div>
                        <p className="text-emerald-400 font-semibold text-xl mt-1">
                          {approvedCount}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#968B79]/20 bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase text-gray-600">
                            Rejected
                          </p>
                          <ThumbsDown size={14} className="text-rose-400" />
                        </div>
                        <p className="text-rose-400 font-semibold text-xl mt-1">
                          {rejectedCount}
                        </p>
                      </div>
                    </div>

                    {/* Task Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="text-gray-600 text-[10px] uppercase font-bold mb-2 block tracking-wider">
                          Due Date
                        </label>
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                          <Calendar size={16} className="text-gray-600" />
                          {data.due_date}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-600 text-[10px] uppercase font-bold mb-2 block tracking-wider">
                          Location
                        </label>
                        <div className="flex items-center gap-2 text-white text-sm font-medium">
                          <MapPin size={16} className="text-gray-600" />
                          {data.location_name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Assignments Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Individual Assignments
                    </h3>
                    <span className="text-xs text-gray-500">
                      {data.assignments?.length || 0} assignments
                    </span>
                  </div>

                  <div className="space-y-4">
                    {data.assignments?.map((assignment: any, index: number) => {
                      const isExpanded = expandedAssignment === assignment.assignment_id || expandedAssignment === assignment.id;
                      const isApproving = individualApproving === assignment.assignment_id || individualApproving === assignment.id;
                      const isRejecting = individualRejecting === assignment.assignment_id || individualRejecting === assignment.id;

                      // Handle different ID field names
                      const assignmentId = assignment.assignment_id || assignment.id;
                      const employeeData = assignment.employee || {};
                      const employeeName = employeeData.name || "";
                      const employeeRole = employeeData.role_display || employeeData.role || "";
                      const employeeEmail = employeeData.email || "";

                      return (
                        <div
                          key={index}
                          className="bg-[#141414] border border-[#968B79]/60 rounded-2xl overflow-hidden transition-all duration-200"
                        >
                          {/* Assignment Header */}
                          <div
                            className="p-4 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                            onClick={() =>
                              toggleAssignmentExpand(assignmentId)
                            }
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border",
                                    getStatusColor(assignment.status),
                                  )}
                                >
                                  {getInitials(employeeName)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-white font-semibold text-sm truncate">
                                    {employeeName}
                                  </p>
                                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                                    {employeeRole}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider",
                                    getStatusColor(assignment.status),
                                  )}
                                >
                                  {assignment.status_display || assignment.status}
                                </span>
                                <button className="text-gray-500 hover:text-white transition-colors">
                                  {isExpanded ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Assignment Details (Expanded) */}
                          {isExpanded && (
                            <div className="p-4 pt-0 border-t border-[#968B79]/20">
                              <div className="pt-4 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="text-gray-600 text-[10px] uppercase font-bold mb-1 tracking-wider">
                                      Email
                                    </p>
                                    <p className="text-gray-300 text-sm flex items-center gap-2">
                                      <FileText
                                        size={14}
                                        className="text-gray-600"
                                      />
                                      {employeeEmail}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 text-[10px] uppercase font-bold mb-1 tracking-wider">
                                      Submitted At
                                    </p>
                                    <p className="text-gray-300 text-sm flex items-center gap-2">
                                      <Clock
                                        size={14}
                                        className="text-gray-600"
                                      />
                                      {formatDate(assignment.created_at)}
                                    </p>
                                  </div>
                                </div>

                                {/* Photo Section with Click to Expand */}
                                {assignment.photo_url ? (
                                  <div className="relative group rounded-xl overflow-hidden border border-[#968B79]/20 bg-black/30">
                                    <div
                                      className="relative cursor-pointer"
                                      onClick={() =>
                                        openImageViewer(
                                          assignment.photo_url!,
                                          employeeName,
                                        )
                                      }
                                    >
                                      <Image
                                        width={800}
                                        height={600}
                                        src={assignment.photo_url}
                                        alt={`${employeeName} submission`}
                                        className="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                      />

                                      {/* Overlay on Hover */}
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-black/60 backdrop-blur-sm p-3 rounded-full">
                                          <Maximize2
                                            size={24}
                                            className="text-white"
                                          />
                                        </div>
                                      </div>

                                      {/* Click Hint */}
                                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                                        <ZoomIn
                                          size={14}
                                          className="text-gray-400"
                                        />
                                        <span className="text-[10px] text-gray-300 font-medium">
                                          Click to view full
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-[#968B79]/20 rounded-2xl bg-black/20">
                                    <Camera
                                      size={28}
                                      className="text-gray-700 mb-2"
                                      strokeWidth={1.5}
                                    />
                                    <p className="text-gray-600 text-sm font-medium">
                                      No submission photo for this assignee
                                    </p>
                                  </div>
                                )}

                                {/* Rejection Reason */}
                                {assignment.rejection_reason && (
                                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle
                                        size={16}
                                        className="text-rose-400 shrink-0 mt-0.5"
                                      />
                                      <div>
                                        <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                                          Rejection Reason
                                        </p>
                                        <p className="text-sm text-rose-200 mt-1">
                                          {assignment.rejection_reason}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Individual Action Buttons */}
                                {(assignment.status === "pending" ||
                                  assignment.status === "awaiting_review") && (
                                  <div className="flex gap-3 pt-2">
                                    <button
                                      onClick={() =>
                                        handleIndividualApprove(assignmentId)
                                      }
                                      disabled={isApproving || isRejecting}
                                      className="flex-1 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                      <Check size={16} />
                                      {isApproving
                                        ? "Approving..."
                                        : "Approve Assignment"}
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleIndividualReject(assignmentId)
                                      }
                                      disabled={isApproving || isRejecting}
                                      className="flex-1 bg-rose-500/5 border border-rose-500/20 text-rose-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                      <CloseIcon size={16} />
                                      {isRejecting
                                        ? "Rejecting..."
                                        : "Reject Assignment"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Bulk Action Buttons (Bottom) */}
                {hasPendingAssignments && (
                  <div className="mt-8 pt-6 border-t border-[#968B79]/20 flex gap-4">
                    <button
                      onClick={handleBulkApprove}
                      disabled={isBulkApproving || isBulkRejecting}
                      className="flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check size={18} />
                      {isBulkApproving
                        ? "Approving All..."
                        : "Approve All Assignments"}
                    </button>
                    <button
                      onClick={handleBulkReject}
                      disabled={isBulkApproving || isBulkRejecting}
                      className="flex-1 bg-rose-500/10 border border-rose-500/30 text-rose-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <CloseIcon size={18} />
                      {isBulkRejecting
                        ? "Rejecting All..."
                        : "Reject All Assignments"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailsModal;