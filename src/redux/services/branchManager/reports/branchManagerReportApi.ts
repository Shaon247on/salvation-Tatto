import { baseApi } from "@/redux/store/baseApi";
import {
  BranchManagerReportResponse,
  ReportQueryParams,
} from "@/types/branchManager/report";

export const branchManagerReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Branch Manager Report
    // Endpoint: /admin/branch-manager/reports/?period=today&status=approved&search=syed
    getBranchManagerReport: builder.query<
      BranchManagerReportResponse,
      ReportQueryParams
    >({
      query: (params) => ({
        url: "/admin/branch-manager/reports/",
        method: "GET",
        params: {
          ...(params.period && { period: params.period }),
          ...(params.status && { status: params.status }),
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ["BranchManagerReports"],
    }),
  }),
});

export const { useGetBranchManagerReportQuery } = branchManagerReportApi;