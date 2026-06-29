import { baseApi } from "@/redux/store/baseApi";

// --- Types ---

export interface BranchManagerTaskAssignmentEmployee {
  employee_id: number;
  name: string;
  role: string;
}

export interface BranchManagerTaskAssignment {
  assignment_id: number;
  task_id: number;
  employee: BranchManagerTaskAssignmentEmployee;
  status: "pending" | "approved" | "rejected" | "overdue" | "awaiting_review" | "completed";
  is_fired: boolean;
  can_fire?: boolean;
  photo_url?: string | null;
  completed_at?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  rejected_by?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  status_display?: string;
}

export interface BranchManagerTaskStatusCounts {
  pending: number;
  awaiting_review: number;
  approved: number;
  rejected: number;
  overdue: number;
}

export interface BranchManagerTaskListItem {
  task_id: number;
  title: string;
  description: string;
  assignments: BranchManagerTaskAssignment[];
  status_counts: BranchManagerTaskStatusCounts;
  due_date: string;
  submitted_at: string;
  is_recurring: boolean;
  frequency: "none" | "daily" | "weekly" | "monthly" | "yearly";
  requires_photo: boolean;
  can_edit: boolean;
}

export interface BranchManagerTaskListResponse {
  location: string;
  tasks: {
    count: number;
    next: string | null;
    previous: string | null;
    results: BranchManagerTaskListItem[];
  };
}

// --- Task Details Types ---

export interface BranchManagerTaskUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  role_display: string;
  location_name?: string;
}

export interface BranchManagerTaskDetailsEmployee {
  employee_id: number;
  name: string;
  email: string;
  role: string;
  role_display: string;
}

export interface BranchManagerTaskDetailsAssignment {
  assignment_id: number;
  task_id: number;
  employee: BranchManagerTaskDetailsEmployee;
  status: "pending" | "approved" | "rejected" | "overdue" | "awaiting_review" | "completed";
  status_display: string;
  is_fired: boolean;
  can_fire: boolean;
  photo_url: string | null;
  completed_at: string | null;
  approved_by: BranchManagerTaskUser | null;
  approved_at: string | null;
  rejected_by: BranchManagerTaskUser | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface BranchManagerTaskDetails {
  task_id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  due_date: string;
  is_recurring: boolean;
  frequency: "none" | "daily" | "weekly" | "monthly" | "yearly";
  requires_photo: boolean;
  created_by: BranchManagerTaskUser;
  created_at: string;
  updated_at: string;
  assignments: BranchManagerTaskDetailsAssignment[];
  status_counts: BranchManagerTaskStatusCounts;
}

// --- Employee Types ---

export interface BranchManagerEmployee {
  employee_id: number;
  name: string;
  email: string;
  role: string;
  role_display: string;
  location_id: number;
  location_name: string;
  profile_photo?: string | null;
}

export interface BranchManagerEmployeeResponse {
  employees: BranchManagerEmployee[];
  employees_meta: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

// --- Create/Update Task Request Types ---

export interface CreateBranchManagerTaskRequest {
  title: string;
  description?: string;
  assigned_to: number[];
  due_date: string;
  is_recurring?: boolean;
  frequency?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  requires_photo?: boolean;
}

export interface CreateBranchManagerTaskResponse {
  message: string;
  task: BranchManagerTaskDetails;
}

export interface UpdateBranchManagerTaskResponse {
  message: string;
  task: BranchManagerTaskDetails;
}

export interface DeleteBranchManagerTaskResponse {
  message: string;
}

// --- API Slice ---

export const branchManagerTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- GET TASKS (List) ---
    getManagerTasks: builder.query<
      BranchManagerTaskListResponse,
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search }) => ({
        url: "/admin/manager/tasks/",
        params: { page, search },
      }),
      providesTags: ["BranchManagerTasks"],
    }),

    // --- GET TASK DETAILS ---
    getManagerTaskDetails: builder.query<
      BranchManagerTaskDetails,
      number
    >({
      query: (taskId) => ({
        url: `/admin/manager/tasks/${taskId}/`,
      }),
      providesTags: (result, error, taskId) => [
        { type: "BranchManagerTasks", id: taskId },
      ],
    }),

    // --- GET EMPLOYEES ---
    getManagerEmployeesByBranchManager: builder.query<
      BranchManagerEmployeeResponse,
      void
    >({
      query: () => ({
        url: "/admin/manager/employees/",
      }),
      providesTags: ["Users"],
    }),

    // --- CREATE TASK ---
    createTaskByBranchManager: builder.mutation<
      CreateBranchManagerTaskResponse,
      CreateBranchManagerTaskRequest
    >({
      query: (body) => ({
        url: "/admin/manager/tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),

    // --- UPDATE TASK ---
    updateTaskByBranchManager: builder.mutation<
      UpdateBranchManagerTaskResponse,
      { id: number; data: Partial<CreateBranchManagerTaskRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "BranchManagerTasks",
        { type: "BranchManagerTasks", id },
      ],
    }),

    // --- DELETE TASK ---
    deleteTaskByBranchManager: builder.mutation<
      DeleteBranchManagerTaskResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetManagerTasksQuery,
  useGetManagerTaskDetailsQuery,
  useGetManagerEmployeesByBranchManagerQuery,
  useCreateTaskByBranchManagerMutation,
  useUpdateTaskByBranchManagerMutation,
  useDeleteTaskByBranchManagerMutation,
} = branchManagerTaskApi;