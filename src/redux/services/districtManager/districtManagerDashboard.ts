
import { baseApi } from "@/redux/store/baseApi";
import { DistrictManagerDashboardResponse, TaskLogResponse } from "@/types/districtManager/districtManagerDashboard.type";

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistrictDashboard: builder.query<DistrictManagerDashboardResponse, void>({
      query: () => ({
        url: "/admin/district-manager/dashboard/",
        method: "GET",
      }),
      providesTags: ["DistrictDashboard"],
    }),
    getDistrictManagerTaskLogs: builder.query<TaskLogResponse, void>({
      query: ()=>"/admin/district-manager/performance/"
    })
  }),
});

export const { useGetDistrictDashboardQuery, useGetDistrictManagerTaskLogsQuery } = districtApi;