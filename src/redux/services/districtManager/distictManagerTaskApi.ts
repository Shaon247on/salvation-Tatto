
import { baseApi } from "@/redux/store/baseApi";
import { Task, TaskResponse, LocationResponse, LocationEmployeesResponse } from "@/types/districtManager/distictManagerTask.type";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByDistrictManager: builder.query<TaskResponse, { location?: number; search?: string; page?: number }>({
      query: (params) => ({
        url: "/admin/district-manager/tasks/",
        params,
      }),
      providesTags: ["Tasks"],
    }),
    getLocationsByDistrictManager: builder.query<LocationResponse, void>({
      query: () => "/admin/district-manager/locations/",
    }),
    getEmployeesByLocationByDistrictManager: builder.query<LocationEmployeesResponse, number>({
      query: (locationId) => `/admin/district-manager/locations/${locationId}/employees/`,
    }),
    createTaskByDistrictManager: builder.mutation<any, Partial<Task>>({
      query: (body) => ({
        url: "/admin/district-manager/tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskByDistrictManager: builder.mutation<any, { id: number; body: Partial<Task> }>({
      query: ({ id, body }) => ({
        url: `/admin/district-manager/tasks/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTaskByDistrictManager: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/district-manager/tasks/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksByDistrictManagerQuery,
  useGetLocationsByDistrictManagerQuery,
  useGetEmployeesByLocationByDistrictManagerQuery,
  useCreateTaskByDistrictManagerMutation,
  useUpdateTaskByDistrictManagerMutation,
  useDeleteTaskByDistrictManagerMutation,
} = taskApi;