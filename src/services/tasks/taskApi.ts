// import { baseApi } from "@/redux/store/baseApi";

// // --- Types & Interfaces ---

// export interface TaskUser {
//   split(arg0: string): unknown;
//   charAt(arg0: number): unknown;
//   id: number;
//   first_name: string;
//   last_name: string;
//   username: string;
//   role: string;
//   role_display: string;
//   location_name?: string;
// }

// export interface Task {
//   id: number;
//   title: string;
//   description: string;
//   location: number;
//   location_name: string;
//   assigned_to_name: string;
//   assigned_to_role: string;
//   created_by: TaskUser;
//   due_date: string;
//   status: "pending" | "completed" | "approved" | "rejected";
//   is_recurring: boolean;
//   frequency: "today" | "weekly" | "monthly" | null;
//   requires_photo: boolean;
//   photo_url: string | null;
//   completed_by: number | null;
//   completed_at: string | null;
//   approved_by: number | null;
//   approved_at: string | null;
//   rejected_by: number | null;
//   rejected_at: string | null;
//   rejection_reason: string | null;
//   created_at: string;
//   updated_at: string;
// }

// interface TaskStats {
//   all_tasks: number;
//   pending: number;
//   completed: number;
//   approved: number;
// }

// interface TaskListResponse {
//   stats: TaskStats;
//   tasks: {
//     count: number;
//     next: string | null;
//     previous: string | null;
//     results: Task[];
//   };
// }
// export interface LocationEmployee {
//   id: number;
//   first_name: string;
//   last_name: string;
//   username: string;
//   role: string;
//   role_display: string;
// }

// interface LocationEmployeesResponse {
//   location: string;
//   employees: LocationEmployee[];
// }

// interface TaskQueryParams {
//   search?: string;
//   page?: number;
// }

// interface CreateTaskRequest {
//   title: string;
//   description: string;
//   location: number;
//   assigned_to: number;
//   due_date: string;
//   is_recurring: boolean;
//   frequency?: "today" | "weekly" | "monthly";
//   requires_photo?: boolean;
// }
// // --- API Slice ---

// export const taskApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // GET: List tasks with search and pagination (image_d7d48f.png)
//     getTasks: builder.query<TaskListResponse, TaskQueryParams>({
//       query: (params) => ({
//         url: "/admin/tasks/",
//         method: "GET",
//         params: {
//           search: params.search,
//           page: params.page || 1,
//         },
//       }),
//       providesTags: ["Tasks"],
//     }),

//     // GET: Single task details (image_e1b70f.png)
//     getTaskDetails: builder.query<Task, number>({
//       query: (id) => `/admin/tasks/${id}/`,
//       providesTags: (result, error, id) => [{ type: "Tasks", id }],
//     }),

//     // GET: Employees for assignment dropdown (image_e1be73.png)
//     getEmployeesForDropdown: builder.query<LocationEmployeesResponse, number>({
//       query: (locationId) => ({
//         url: `/admin/locations/${locationId}/employees/`,
//         method: "GET",
//       }),
//       // This allows you to cache employee lists per location
//       providesTags: (result, error, locationId) => [
//         { type: "Users", id: `LOCATION_${locationId}` },
//       ],
//     }),

//     // POST: Create Task (image_d7d84a.png)
//     createTask: builder.mutation<
//       { message: string; task: Task },
//       CreateTaskRequest
//     >({
//       query: (newTask) => ({
//         url: "/admin/tasks/",
//         method: "POST",
//         body: newTask,
//       }),
//       invalidatesTags: ["Tasks"],
//     }),

//     // POST: Approve Task (image_e1ba70.png)
//     approveTask: builder.mutation<{ message: string }, number>({
//       query: (id) => ({
//         url: `/admin/tasks/${id}/approve/`,
//         method: "POST",
//       }),
//       invalidatesTags: (result, error, id) => ["Tasks", { type: "Tasks", id }],
//     }),

//     // POST: Reject Task with reason (image_e1bb07.png)
//     rejectTask: builder.mutation<
//       { message: string },
//       { id: number; rejection_reason: string }
//     >({
//       query: ({ id, rejection_reason }) => ({
//         url: `/admin/tasks/${id}/reject/`,
//         method: "POST",
//         body: { rejection_reason },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         "Tasks",
//         { type: "Tasks", id },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetTasksQuery,
//   useGetTaskDetailsQuery,
//   useGetEmployeesForDropdownQuery,
//   useCreateTaskMutation,
//   useApproveTaskMutation,
//   useRejectTaskMutation,
// } = taskApi;
