// src/redux/services/branchManager/task/branchManagerTaskApi.ts

import { baseApi } from "@/redux/store/baseApi";
import {
  taskListSchema,
  employeeResponseSchema,
} from "@/schema/branchManager/branchManagerTask.schema";
import {
  TaskListResponse,
  EmployeeResponse,
  CreateTaskRequest,
} from "@/types/branchManager/branchManagerTask.types";

export const theBranchManagerTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- GET TASKS ---
    getManagerTasks: builder.query<
      TaskListResponse,
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search }) => ({
        url: "/admin/manager/tasks/",
        params: { page, search },
      }),
      transformResponse: (res: unknown) => taskListSchema.parse(res),
      providesTags: ["BranchManagerTasks"],
    }),

    // --- GET EMPLOYEES ---
    getManagerEmployeesByBranchManager: builder.query<EmployeeResponse, void>({
      query: () => ({
        url: "/admin/manager/employees/",
      }),
      transformResponse: (res: unknown) =>
        employeeResponseSchema.parse(res),
      providesTags: ["Users"],
    }),

    // --- CREATE ---
    createTaskByBranchManager: builder.mutation<any, CreateTaskRequest>({
      query: (body) => ({
        url: "/admin/manager/tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),

    // --- UPDATE ---
    updateTaskByBranchManager: builder.mutation<
      any,
      { id: number; data: Partial<CreateTaskRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),

    // --- DELETE ---
    deleteTaskByBranchManager: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BranchManagerTasks"],
    }),
  }),
});

export const {
  useGetManagerTasksQuery,
  useGetManagerEmployeesByBranchManagerQuery,
  useCreateTaskByBranchManagerMutation,
  useUpdateTaskByBranchManagerMutation,
  useDeleteTaskByBranchManagerMutation,
} = theBranchManagerTaskApi;