
import { baseApi } from "@/redux/store/baseApi";
import { branchManagerDashboardSchema } from "@/schema/branchManagerDashboard.schema";
import { BranchManagerDashboardResponse } from "@/types/branchManager/branchManagerDashboard.types";

export const branchManagerDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranchManagerDashboard: builder.query<
      BranchManagerDashboardResponse,
      void
    >({
      query: () => ({
        url: "/admin/branch-manager/dashboard/",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        return branchManagerDashboardSchema.parse(response);
      },
      providesTags: ["BranchManagerDashboard"],
    }),
  }),
});

export const { useGetBranchManagerDashboardQuery } =
  branchManagerDashboardApi;