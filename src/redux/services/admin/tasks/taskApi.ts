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

export interface TaskAssignmentEmployee {
  id: number;
  name: string;
  email: string;
  role: string;
  role_display: string;
}

export interface TaskAssignment {
  id: number;
  employee: TaskAssignmentEmployee;
  status:
    | "pending"
    | "completed"
    | "approved"
    | "rejected"
    | "overdue"
    | "awaiting_review";
  status_display: string;
  is_fired: boolean;
  can_fire: boolean;
  photo_url: string | null;
  completed_at: string | null;
  approved_by: TaskUser | null;
  approved_at: string | null;
  rejected_by: TaskUser | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface TaskStatusCounts {
  pending: number;
  awaiting_review: number;
  approved: number;
  rejected: number;
  overdue: number;
}

export interface TaskDetails {
  id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  due_date: string;
  is_recurring: boolean;
  frequency: "none" | "today" | "weekly" | "monthly" | "yearly";
  requires_photo: boolean;
  created_by: TaskUser;
  created_at: string;
  updated_at: string;
  assignments: TaskAssignment[];
  status_counts: TaskStatusCounts;
}

export interface Task {
  task_id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  due_date: string;
  is_recurring: boolean;
  frequency: "none" | "today" | "weekly" | "monthly" | "yearly";
  requires_photo: boolean;
  created_by: TaskUser;
  created_at: string;
  assignments: TaskAssignment[];
  status_counts: TaskStatusCounts;
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
  name: string;
  email: string;
  role: string;
  role_display: string;
  location_id?: number;
  location_name?: string;
  profile_photo?: string | null;
}

export interface LocationFilterOption {
  id: number;
  name: string;
}

export interface LocationEmployeesResponse {
  employees: LocationEmployee[];
  employees_meta: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  filter_options?: {
    locations: LocationFilterOption[];
  };
}

interface TaskQueryParams {
  search?: string;
  page?: number;
  period?: "daily" | "weekly" | "monthly" | "yearly";
  location?: number | string;
  status?: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  location: number;
  assigned_to: number[];
  due_date: string;
  is_recurring: boolean;
  frequency?: "daily" | "weekly" | "monthly" | "yearly" | "none";
  requires_photo?: boolean;
}

interface FireUserRequest {
  taskId: number;
  fire_reason: string;
}

interface Location {
  id: number;
  name: string;
  street_address: string;
  city_state: string;
  status: string;
  staff_count: number;
}

interface LocationResponse {
  locations: Location[];
}

// --- API Slice ---

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Super Admin Endpoints ---
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

    // PATCH: Edit Task
    editTask: builder.mutation<Task, { id: number; data: Partial<TaskRequest> }>({
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

    // DELETE: Remove Task
    deleteTask: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // POST: Approve Task (Individual Assignment)
    approveTask: builder.mutation<
      { message: string },
      { taskId: number; assignmentId: number }
    >({
      query: ({ taskId, assignmentId }) => ({
        url: `/admin/tasks/${taskId}/approve/`,
        method: "POST",
        body: { assignment_id: assignmentId },
      }),
      invalidatesTags: (result, error, { taskId }) => ["Tasks", { type: "Tasks", id: taskId }],
    }),

    // POST: Reject Task (Individual Assignment)
    rejectTask: builder.mutation<
      { message: string },
      { id: number; rejection_reason: string; assignmentId: number }
    >({
      query: ({ id, rejection_reason, assignmentId }) => ({
        url: `/admin/tasks/${id}/reject/`,
        method: "POST",
        body: { rejection_reason, assignment_id: assignmentId },
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

    // GET: Employees for assignment dropdown (Super Admin)
    getEmployeesForDropdown: builder.query<LocationEmployeesResponse, number>({
      query: (locationId) => ({
        url: `/admin/locations/${locationId}/employees/`,
        method: "GET",
      }),
      providesTags: (result, error, locationId) => [
        { type: "Users", id: `LOCATION_${locationId}` },
      ],
    }),

    // --- District Manager Endpoints ---
    getTasksByDistrictManager: builder.query<
      TaskListResponse,
      { location?: number; search?: string; page?: number }
    >({
      query: (params) => ({
        url: "/admin/district-manager/tasks/",
        params,
      }),
      providesTags: ["Tasks"],
    }),

    getTasksDetailsByDistrictManager: builder.query<
      TaskListResponse,
      { id: number }
    >({
      query: ({id}) => ({
        url: `/admin/district-manager/tasks/${id}`,
      }),
      providesTags: ["Tasks"],
    }),

    // GET: Locations for District Manager
    getLocationsByDistrictManager: builder.query<LocationResponse, void>({
      query: () => "/admin/district-manager/locations/",
      providesTags: ["Locations"],
    }),

    // GET: Employees by Location for District Manager (with location as query param)
    getEmployeesByLocationByDistrictManager: builder.query<
      LocationEmployeesResponse,
      number
    >({
      query: (locationId) => ({
        url: "/admin/district-manager/employees/",
        params: { location: locationId },
      }),
      providesTags: (result, error, locationId) => [
        { type: "Users", id: `LOCATION_${locationId}` },
      ],
    }),

    // POST: Create Task for District Manager
    createTaskByDistrictManager: builder.mutation<any, Partial<Task>>({
      query: (body) => ({
        url: "/admin/district-manager/tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // PATCH: Update Task for District Manager
    updateTaskByDistrictManager: builder.mutation<
      any,
      { id: number; body: Partial<Task> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/district-manager/tasks/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // DELETE: Delete Task for District Manager
    deleteTaskByDistrictManager: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/district-manager/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
  overrideExisting: true,
});

export const {
  // Super Admin Hooks
  useGetTasksQuery,
  useGetTaskDetailsQuery,
  useCreateTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useApproveTaskMutation,
  useRejectTaskMutation,
  useFireUserMutation,
  useGetEmployeesForDropdownQuery,

  // District Manager Hooks
  useGetTasksByDistrictManagerQuery,
  useGetTasksDetailsByDistrictManagerQuery,
  useGetLocationsByDistrictManagerQuery,
  useGetEmployeesByLocationByDistrictManagerQuery,
  useCreateTaskByDistrictManagerMutation,
  useUpdateTaskByDistrictManagerMutation,
  useDeleteTaskByDistrictManagerMutation,
} = taskApi;