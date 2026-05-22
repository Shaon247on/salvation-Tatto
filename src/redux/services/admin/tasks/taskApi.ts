import { baseApi } from "@/redux/store/baseApi";

export interface TaskUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  role_display: string;
  location_name?: string;
}

interface TaskUserDetails {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  role_display: string;
  location_name?: string; // optional — not present on all users (e.g. created_by)
}

export interface TaskDetails {
  id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  assigned_to: TaskUserDetails;
  created_by: TaskUser;
  due_date: string;
  status: "pending" | "completed" | "approved" | "rejected" | "overdue" | "awaiting_review";
  status_display: string;
  is_recurring: boolean;
  frequency: "none" | "today" | "weekly" | "monthly" | "yearly";
  requires_photo: boolean;
  photo_url: string | null;
  completed_by: TaskUser | null;
  completed_at: string | null;
  approved_by: TaskUser | null;
  approved_at: string | null;
  rejected_by: TaskUser | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  is_fired: boolean;
  can_fire: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  assigned_to: number;
  assigned_to_name: string;
  assigned_to_email: string;
  assigned_to_role: string;
  due_date: string;
  status:
    | "pending"
    | "completed"
    | "approved"
    | "rejected"
    | "overdue"
    | "awaiting_review";
  is_recurring: boolean;
  frequency: "none" | "today" | "weekly" | "monthly" | "yearly";
  requires_photo: boolean;
  photo_url?: string | null;
  completed_by: number | null;
  completed_by_name: string | null;
  completed_by_role: string | null;
  is_fired: boolean;
  can_fire: boolean;
  created_at: string;
  updated_at?: string;
  rejection_reason?: string | null;
}

interface TaskStats {
  all_tasks: number;
  overdue: number;
  completed: number;
  rejected: number;
}

interface TaskListResponse {
  stats: TaskStats;
  tasks: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Task[];
  };
}

export interface LocationEmployee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  role_display: string;
}

interface LocationEmployeesResponse {
  location: string;
  employees: LocationEmployee[];
}

interface TaskQueryParams {
  search?: string;
  page?: number;
  period?: "daily" | "weekly" | "monthly" | "yearly";
  location?: number | string;
  status?: string;
}

interface TaskRequest {
  title: string;
  description: string;
  location: number;
  assigned_to: number;
  due_date: string;
  is_recurring: boolean;
  frequency?: "today" | "weekly" | "monthly" | "yearly" | "none";
  requires_photo?: boolean;
}

interface FireUserRequest {
  taskId: number;
  fire_reason: string;
}

// --- API Slice ---

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: List tasks with advanced filtering and pagination
    getTasks: builder.query<TaskListResponse, TaskQueryParams>({
      query: (params) => ({
        url: "/admin/tasks/",
        method: "GET",
        params: {
          search: params.search,
          page: params.page || 1,
          period: params.period,
          location: params.location,
          status: params.status,
        },
      }),
      providesTags: ["Tasks"],
    }),

    // GET: Single task details
    getTaskDetails: builder.query<TaskDetails, number>({
      query: (id) => `/admin/tasks/${id}/`,
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    // POST: Create Task
    createTask: builder.mutation<{ message: string; task: Task }, TaskRequest>({
      query: (newTask) => ({
        url: "/admin/tasks/",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // PATCH: Edit Task (image_2e0f54.png)
    editTask: builder.mutation<
      Task,
      { id: number; data: Partial<TaskRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/tasks/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        { type: "Tasks", id },
      ],
    }),

    // DELETE: Remove Task (image_2e12fa.png)
    deleteTask: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // POST: Approve Task
    approveTask: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/tasks/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => ["Tasks", { type: "Tasks", id }],
    }),

    // POST: Reject Task
    rejectTask: builder.mutation<
      { message: string },
      { id: number; rejection_reason: string }
    >({
      query: ({ id, rejection_reason }) => ({
        url: `/admin/tasks/${id}/reject/`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        { type: "Tasks", id },
      ],
    }),

    // POST: Fire Employee
    fireUser: builder.mutation<{ message: string }, FireUserRequest>({
      query: ({ taskId, fire_reason }) => ({
        url: `/admin/tasks/${taskId}/fire-user/`,
        method: "POST",
        body: { fire_reason },
      }),
      invalidatesTags: ["Tasks"],
    }),

    // GET: Employees for assignment dropdown
    getEmployeesForDropdown: builder.query<LocationEmployeesResponse, number>({
      query: (locationId) => ({
        url: `/admin/locations/${locationId}/employees/`,
        method: "GET",
      }),
      providesTags: (result, error, locationId) => [
        { type: "Users", id: `LOCATION_${locationId}` },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskDetailsQuery,
  useCreateTaskMutation,
  useEditTaskMutation, // Exported Edit Mutation
  useDeleteTaskMutation, // Exported Delete Mutation
  useApproveTaskMutation,
  useRejectTaskMutation,
  useFireUserMutation,
  useGetEmployeesForDropdownQuery,
} = taskApi;
