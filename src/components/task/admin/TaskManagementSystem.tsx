"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";

// --- Import RTK Query Hooks ---
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken, selectUserRole } from "@/redux/features/auth/authSlice";

// --- Import Modal Components ---
import { TaskActionModal } from "./TaskActionModal";
import TaskDetailsModal from "./TaskDetailsModal";
import FireUserModal from "./FireUserModal";
import RejectModal from "./RejectModal";

// --- Import API Hooks ---
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useApproveTaskMutation,
  useRejectTaskMutation,
  useFireUserMutation,
  useGetEmployeesForDropdownQuery,
  useGetTasksByDistrictManagerQuery,
  useGetLocationsByDistrictManagerQuery,
  useGetEmployeesByLocationByDistrictManagerQuery,
  useCreateTaskByDistrictManagerMutation,
  useUpdateTaskByDistrictManagerMutation,
  useDeleteTaskByDistrictManagerMutation,
} from "@/redux/services/admin/tasks/taskApi";

// --- Import Location API ---
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";

// --- Types ---
export type Status =
  | "approved"
  | "overdue"
  | "awaiting_review"
  | "pending"
  | "rejected"
  | "completed";

export type DisplayStatus =
  | "Approved"
  | "Overdue"
  | "Awaiting Review"
  | "Pending"
  | "Rejected"
  | "Completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  assigned_to_name: string;
  due_date: string;
  assigned_to: number[];
  assigned_to_role: string;
  location_name: string;
  location: number;
  frequency: "none" | "today" | "daily" | "weekly" | "monthly" | "yearly";
  assigned_to_email: string;
  is_recurring: boolean;
  photo_url?: string | null;
  rejection_reason?: string | null;
  can_fire?: boolean;
  requires_photo?: boolean;
  assignments: any[];
  status_counts: any;
  created_by: any;
  created_at: string;
}

type TaskModalDTO = {
  taskName: string;
  description: string;
  location: string;
  locationId: number;
  assignedTo: string;
  assignedToIds: number[];
  dueDate: string;
  employeeName: string;
  employeeInitials: string;
  role: string;
  status: DisplayStatus;
  imageUrl: string | null;
  email: string;
  isRecurring: boolean;
  frequency: string;
  requirePhoto: boolean;
};

// --- Helper Mapping ---
const mapStatusToDisplay = (status: Status): DisplayStatus => {
  const statusMap: { [key in Status]: DisplayStatus } = {
    approved: "Approved",
    completed: "Approved",
    overdue: "Overdue",
    awaiting_review: "Awaiting Review",
    pending: "Pending",
    rejected: "Rejected",
  };
  return statusMap[status] || "Pending";
};

const getTaskSummaryStatus = (task: any): Status => {
  const counts = task.status_counts || {
    pending: 0,
    awaiting_review: 0,
    approved: 0,
    rejected: 0,
    overdue: 0,
  };

  if (counts.rejected > 0) return "rejected";
  if (counts.awaiting_review > 0) return "awaiting_review";
  if (counts.overdue > 0) return "overdue";
  if (counts.approved > 0 && counts.approved >= (task.assignments?.length || 0)) {
    return "approved";
  }
  return "pending";
};

export default function TaskManagementSystem() {
  const token = useAppSelector(selectCurrentToken);
  const userRole = useAppSelector(selectUserRole);

  // Determine if user is district manager
  const isDistrictManager = userRole === "district_manager";

  // --- State ---
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [locationFilterId, setLocationFilterId] = useState<number | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState("none");

  // Modal Control States
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFireOpen, setIsFireOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const itemsPerPage = 15;

  // --- API Queries based on role ---
  const {
    data: tasksData,
    isLoading,
    isError,
    refetch,
  } = isDistrictManager
    ? useGetTasksByDistrictManagerQuery(
        {
          page: currentPage,
          location: locationFilterId ?? undefined,
          search,
        },
        { skip: !token },
      )
    : useGetTasksQuery(
        {
          page: currentPage,
          location: locationFilterId ?? undefined,
          status:
            statusFilter !== "All Status"
              ? (statusFilter.toLowerCase().replace(" ", "_") as any)
              : undefined,
          search,
          period: (frequencyFilter !== "All"
            ? frequencyFilter.toLowerCase()
            : undefined) as any,
        },
        { skip: !token },
      );

  // Locations query based on role
  const {
    data: locationsData,
    isLoading: locationsLoading,
  } = isDistrictManager
    ? useGetLocationsByDistrictManagerQuery(undefined, { skip: !token })
    : useGetLocationsQuery(undefined, { skip: !token });

  // --- Mutations based on role ---
  const [createTaskAdmin, { isLoading: isCreatingAdmin }] = useCreateTaskMutation();
  const [editTaskAdmin, { isLoading: isEditingAdmin }] = useEditTaskMutation();
  const [deleteTaskAdmin, { isLoading: isDeletingAdmin }] = useDeleteTaskMutation();
  const [approveTaskAdmin, { isLoading: isApprovingAdmin }] = useApproveTaskMutation();
  const [rejectTaskAdmin, { isLoading: isRejectingAdmin }] = useRejectTaskMutation();
  const [fireUserAdmin, { isLoading: isFiringAdmin }] = useFireUserMutation();

  const [createTaskDM, { isLoading: isCreatingDM }] = useCreateTaskByDistrictManagerMutation();
  const [editTaskDM, { isLoading: isEditingDM }] = useUpdateTaskByDistrictManagerMutation();
  const [deleteTaskDM, { isLoading: isDeletingDM }] = useDeleteTaskByDistrictManagerMutation();

  // Select the appropriate mutations based on role
  const createTask = isDistrictManager ? createTaskDM : createTaskAdmin;
  const editTask = isDistrictManager ? editTaskDM : editTaskAdmin;
  const deleteTask = isDistrictManager ? deleteTaskDM : deleteTaskAdmin;
  const approveTask = approveTaskAdmin;
  const rejectTask = rejectTaskAdmin;
  const fireUser = fireUserAdmin;

  const isCreating = isDistrictManager ? isCreatingDM : isCreatingAdmin;
  const isEditing = isDistrictManager ? isEditingDM : isEditingAdmin;
  const isDeleting = isDistrictManager ? isDeletingDM : isDeletingAdmin;
  const isApproving = isApprovingAdmin;
  const isRejecting = isRejectingAdmin;
  const isFiring = isFiringAdmin;

  // --- Filter Handlers ---
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleFrequencyChange = (val: string) => {
    setFrequencyFilter(val);
    setCurrentPage(1);
  };

  const handleLocationFilterChange = (locationName: string) => {
    setLocationFilter(locationName);
    setCurrentPage(1);
    if (locationName === "All Locations") {
      setLocationFilterId(null);
    } else {
      const locations = locationsData?.locations || [];
      const location = locations.find((loc: any) => loc.name === locationName);
      setLocationFilterId(location?.id || null);
    }
  };

  // --- Helper: Data Mappers ---
  const mapApiTaskToDisplay = (apiTask: any): Task => {
    const assignments = apiTask.assignments || [];
    const firstAssignment = assignments[0];

    // Handle different ID field names
    const taskId = apiTask.task_id || apiTask.id;

    return {
      id: taskId,
      title: apiTask.title,
      description: apiTask.description,
      status: getTaskSummaryStatus(apiTask),
      assigned_to_name: assignments
        .map((assignment: any) => assignment.employee?.name || "")
        .join(", "),
      due_date: apiTask.due_date,
      assigned_to: assignments.map((assignment: any) => assignment.employee?.employee_id || assignment.employee?.id || 0),
      assigned_to_role: firstAssignment?.employee?.role_display || firstAssignment?.employee?.role || "",
      location_name: apiTask.location_name,
      location: apiTask.location,
      frequency: apiTask.frequency || "none",
      assigned_to_email: firstAssignment?.employee?.email || "",
      is_recurring: apiTask.is_recurring,
      photo_url: firstAssignment?.photo_url || null,
      rejection_reason: assignments.find((assignment: any) => assignment.rejection_reason)?.rejection_reason || null,
      requires_photo: apiTask.requires_photo,
      assignments,
      status_counts: apiTask.status_counts,
      created_by: apiTask.created_by,
      created_at: apiTask.created_at,
    };
  };

  const mapTaskToModal = (task: Task | null): TaskModalDTO | null => {
    if (!task) return null;

    const assignmentNames = task.assignments?.map((assignment: any) => assignment.employee?.name || "") || [];
    const name = assignmentNames.join(", ") || task.assigned_to_name || "";

    return {
      taskName: task.title ?? "",
      description: task.description ?? "",
      location: task.location_name ?? "",
      locationId: task.location ?? 0,
      assignedTo: name,
      assignedToIds: task.assignments?.map((assignment: any) => assignment.employee?.employee_id || assignment.employee?.id || 0) || [],
      dueDate: task.due_date ?? "",
      employeeName: name,
      employeeInitials: name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "",
      role: task.assigned_to_role ?? "",
      status: mapStatusToDisplay(task.status),
      imageUrl: task.photo_url ?? null,
      email: task.assigned_to_email ?? "",
      isRecurring: task.is_recurring ?? false,
      frequency: task.frequency ?? "none",
      requirePhoto: task.requires_photo ?? false,
    };
  };

  // --- CRUD Handlers ---
  const handleActionClick = (task: Task) => {
    setSelectedTask(task);
    if (task.status === "overdue") setIsFireOpen(true);
    else if (
      ["approved", "awaiting_review", "rejected", "completed"].includes(
        task.status,
      )
    )
      setIsDetailsOpen(true);
    else if (task.status === "pending") setIsActionOpen(true);
  };

  const handleDelete = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId).unwrap();
        refetch();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleTaskActionSave = async (formData: any) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.locationId,
      assigned_to: formData.assignedToIds,
      due_date: formData.dueDate,
      is_recurring: formData.isRecurring,
      requires_photo: formData.requirePhoto,
      ...(formData.isRecurring && {
        frequency: formData.frequency,
      }),
    };

    try {
      if (selectedTask) {
        await editTask({ id: selectedTask.id, data: payload }).unwrap();
      } else {
        await createTask(payload as any).unwrap();
      }
      refetch();
      setIsActionOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (taskId: number) => {
    try {
      await approveTask(taskId).unwrap();
      refetch();
      setIsDetailsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (taskId: number, reason: string) => {
    try {
      await rejectTask({ id: taskId, rejection_reason: reason }).unwrap();
      refetch();
      setIsDetailsOpen(false);
      setIsRejectOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFire = async (taskId: number, reason: string) => {
    try {
      await fireUser({ taskId, fire_reason: reason }).unwrap();
      refetch();
      setIsFireOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Loading / Error States ---
  if (isLoading && !tasksData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#c4a47c]" />
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error loading tasks.
      </div>
    );

  // Handle different response structures
  const tasks = tasksData?.tasks?.results || tasksData?.tasks || [];
  const totalTasks = tasksData?.tasks?.count || tasksData?.tasks_meta?.count || tasksData?.tasks?.length || 0;
  const totalPages = Math.ceil(totalTasks / itemsPerPage);
  
  // Handle different stats structures
  const stats = tasksData?.stats || {
    all_tasks: tasksData?.tasks?.length || 0,
    overdue: 0,
    completed: 0,
    rejected: 0,
  };

  // Location options
  const locationOptions = [
    "All Locations",
    ...(locationsData?.locations?.map((loc: any) => loc.name) || []),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e4e4e7] p-4 md:p-8 font-sans">
      {/* Header & Search */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="w-full bg-[#121214] border border-[#2a2a2d] rounded-full py-3 pl-11 pr-4 focus:outline-none transition-all text-sm"
            placeholder="Search by employee ..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isDistrictManager && (
            <FilterDropdown
              value={frequencyFilter}
              onChange={handleFrequencyChange}
              options={["All", "daily", "weekly", "monthly", "yearly"]}
            />
          )}
          <FilterDropdown
            value={locationFilter}
            onChange={handleLocationFilterChange}
            options={locationOptions}
          />
          {!isDistrictManager && (
            <FilterDropdown
              value={statusFilter}
              onChange={handleStatusChange}
              options={[
                "All Status",
                "Approved",
                "Awaiting Review",
                "Rejected",
                "Overdue",
                "Pending",
              ]}
            />
          )}

          <button
            onClick={() => {
              setSelectedTask(null);
              setIsActionOpen(true);
            }}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="All Tasks"
          val={stats.all_tasks || stats.total || 0}
          color="border-[#c4a47c]/20"
        />
        <StatCard
          label="Overdue"
          val={stats.overdue || 0}
          color="border-red-500/20"
        />
        <StatCard
          label="Pending"
          val={stats.pending || 0}
          color="border-yellow-500/20"
        />
        <StatCard
          label="Rejected"
          val={stats.rejected || 0}
          color="border-red-500/20"
        />
      </div>

      {/* Table */}
      <div className="bg-[#121214] border border-[#2a2a2d] rounded-2xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#161618] border-b border-[#2a2a2d]">
              <tr className="text-[10px] uppercase text-gray-500 font-bold">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Pending</th>
                <th className="px-6 py-4 text-center">Awaited Review</th>
                <th className="px-6 py-4 text-center">Approved</th>
                <th className="px-6 py-4 text-center">Declined</th>
                <th className="px-6 py-4 text-center">Assigned Count</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              {tasks.map((apiTask: any) => {
                const task = mapApiTaskToDisplay(apiTask);
                const displayStatus = mapStatusToDisplay(task.status);
                const counts = task.status_counts || {
                  pending: 0,
                  awaiting_review: 0,
                  approved: 0,
                  rejected: 0,
                  overdue: 0,
                };
                const totalAssigned = task.assignments?.length || 0;
                const declined = counts.rejected || 0;
                const awaited = counts.awaiting_review || 0;

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-5 min-w-[200px]">
                      <div className="flex gap-4">
                        <StatusIcon status={displayStatus} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-white">
                              {task.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      {apiTask.created_at
                        ? new Date(apiTask.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td
                      className={`px-6 py-5 text-sm ${task.status === "overdue" ? "text-red-500 font-medium" : ""}`}
                    >
                      {task.due_date}
                    </td>
                    <td className="px-6 py-5 text-sm">{task.location_name}</td>
                    <td className="px-6 py-5 text-center text-sm font-medium">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        {counts.pending || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                        {awaited}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        {counts.approved || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        {declined}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-medium">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {totalAssigned}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center items-center gap-2">
                        {task.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleActionClick(task)}
                              className="p-2 border border-[#2a2a2d] rounded-lg text-gray-400 hover:text-[#c4a47c] transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              disabled={isDeleting}
                              className="p-2 border border-[#2a2a2d] rounded-lg text-gray-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleActionClick(task)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${task.status === "overdue" ? "border-red-900/50 text-red-500 hover:bg-red-500/10" : "border-[#c4a47c]/40 text-[#c4a47c] hover:bg-[#c4a47c]/10"}`}
                          >
                            {task.status === "overdue" ? "Fire" : "View"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalTasks)} of {totalTasks}{" "}
          results
        </p>

        <div className="flex items-center gap-2">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 border border-[#2a2a2d] rounded-lg disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg border transition-colors ${
                  currentPage === page
                    ? "bg-[#c4a47c] text-black border-[#c4a47c]"
                    : "border-[#2a2a2d] text-gray-400 hover:border-[#c4a47c] hover:text-white"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 border border-[#2a2a2d] rounded-lg disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <TaskActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        initialData={mapTaskToModal(selectedTask)}
        onSave={handleTaskActionSave}
        isLoading={isCreating || isEditing}
      />

      {isDetailsOpen && (
        <TaskDetailsModalWithApprove
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          data={mapTaskToModal(selectedTask)}
          selectedTask={selectedTask}
          onApprove={handleApprove}
          onRejectOpen={() => setIsRejectOpen(true)}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onRejectConfirm={handleReject}
          isRejectOpen={isRejectOpen}
          onRejectClose={() => setIsRejectOpen(false)}
        />
      )}

      <FireUserModal
        isOpen={isFireOpen}
        onClose={() => setIsFireOpen(false)}
        onConfirm={(reason) =>
          selectedTask && handleFire(selectedTask.id, reason)
        }
        userData={
          selectedTask
            ? {
                name: selectedTask.assigned_to_name,
                email: selectedTask.assigned_to_email,
              }
            : null
        }
        isLoading={isFiring}
      />
    </div>
  );
}

// --- Internal Helper Components ---

function TaskDetailsModalWithApprove({
  isOpen,
  onClose,
  data,
  selectedTask,
  onApprove,
  onRejectOpen,
  isApproving,
  onRejectConfirm,
  isRejectOpen,
  onRejectClose,
  isRejecting,
}: any) {
  return (
    <>
      <TaskDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        id={selectedTask.id}
        onApprove={
          selectedTask && data?.status === "Awaiting Review"
            ? () => onApprove(selectedTask.id)
            : undefined
        }
        onRejectOpen={onRejectOpen}
        isApproving={isApproving}
        isPendingReview={data?.status === "Awaiting Review"}
      />
      {selectedTask && (
        <RejectModal
          isOpen={isRejectOpen}
          onClose={onRejectClose}
          onConfirm={(reason) => onRejectConfirm(selectedTask.id, reason)}
          isLoading={isRejecting}
        />
      )}
    </>
  );
}

function StatCard({ label, val, color }: any) {
  return (
    <div className={`bg-[#121214] border ${color} p-5 rounded-2xl`}>
      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">
        {label}
      </p>
      <h3 className="text-3xl font-bold text-white">{val}</h3>
    </div>
  );
}

function StatusIcon({ status }: { status: DisplayStatus }) {
  const styles: any = {
    Approved: "text-green-500 bg-green-500/10",
    Overdue: "text-red-500 bg-red-500/10",
    "Awaiting Review": "text-purple-500 bg-purple-500/10",
    Pending: "text-blue-500 bg-blue-500/10",
    Rejected: "text-red-500 bg-red-500/10",
  };
  return (
    <div
      className={`p-2 rounded-xl border border-current/20 ${styles[status]}`}
    >
      <div className="w-3.5 h-3.5 border-2 border-current rounded-sm" />
    </div>
  );
}

function FilterDropdown({ value, onChange, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const click = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[140px] px-4 py-2.5 bg-[#121214] border border-[#2a2a2d] rounded-xl text-xs"
      >
        <span>{value}</span>
        <ChevronDown size={14} className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#121214] border border-[#c4a47c]/30 rounded-xl z-50 overflow-hidden shadow-2xl">
          {options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-xs hover:bg-[#c4a47c]/10 ${value === opt ? "text-[#c4a47c] bg-[#c4a47c]/5" : "text-gray-400"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}