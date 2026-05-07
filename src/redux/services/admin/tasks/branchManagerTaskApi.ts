import { baseApi } from "@/redux/store/baseApi";

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  role_display: string;
  location_name?: string;
}

export interface TaskStats {
  all: number;
  pending: number;
  awaiting_review: number;
  approved: number;
  overdue: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  assigned_to: number | Employee; // Returns object on Create, ID on List
  assigned_to_name?: string; // From List response
  assigned_to_role?: string; // From List response
  due_date: string;
  status:
    | "pending"
    | "awaiting_review"
    | "approved"
    | "rejected"
    | "overdue"
    | "completed";
  is_recurring: boolean;
  frequency: "today" | "weekly" | "monthly";
  requires_photo: boolean;
  photo_url?: string | null;
  completed_by?: number | null;
  completed_by_name?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// Response Interfaces
interface TaskListResponse {
  location: string;
  stats: TaskStats;
  tasks: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Task[];
  };
}

interface CreateTaskResponse {
  message: string;
  task: Task;
}

interface EmployeeListResponse {
  location: string;
  location_id: number;
  employees: Employee[];
}

export interface TaskFilters {
  status?:
    | "pending"
    | "completed"
    | "approved"
    | "overdue"
    | "awaiting_review"
    | "rejected";
  page?: number;
}

// --- API Slice ---

export const branchManagerTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch Task List with Stats & Dynamic Filters (image_c93a3d.png / image_c93de4.png)
    getTasks: builder.query<TaskListResponse, TaskFilters | void>({
      query: (params) => ({
        url: "/admin/manager/tasks/",
        method: "GET",
        params: {
          status: params?.status,
          page: params?.page || 1,
        },
      }),
      providesTags: ["BranchManagerTasks"],
    }),

    // POST: Create a new Task (image_c94127.png)
    createTask: builder.mutation<
      CreateTaskResponse,
      {
        title: string;
        description: string;
        assigned_to: number;
        due_date: string;
        is_recurring: boolean;
        frequency: string;
        requires_photo: boolean;
      }
    >({
      query: (body) => ({
        url: "/admin/manager/tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),

    // GET: Employees for the assignment dropdown (image_c93e3d.png)
    getAssignableEmployees: builder.query<EmployeeListResponse, void>({
      query: () => "/admin/manager/employees/",
    }),

    // GET: Individual Task Details
    getTaskDetails: builder.query<Task, number>({
      query: (id) => `/admin/manager/tasks/${id}/`,
      providesTags: (result, error, id) => [{ type: "BranchManagerTasks", id }],
    }),

    // PATCH: Edit Task
    updateTask: builder.mutation<
      Task,
      { id: number; data: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "BranchManagerTasks",
        { type: "BranchManagerTasks", id: arg.id },
      ],
    }),

    // DELETE: Delete Task
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useGetAssignableEmployeesQuery,
  useGetTaskDetailsQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = branchManagerTaskApi;
