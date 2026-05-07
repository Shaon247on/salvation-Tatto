import { baseApi } from "@/redux/store/baseApi";
import {
  OverviewReportResponse,
  EmployeePerformanceApiResponse,
  ReportPeriod,
} from "@/types/districtManager/districtManagerReport.type";

export const disdtrictMangerReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewReportForDistrictManager: builder.query<
      OverviewReportResponse,
      { period: ReportPeriod }
    >({
      query: ({ period }) => ({
        url: "/admin/district/reports/",
        params: { period },
      }),
    }),

    getEmployeePerformanceReportForDistrictManager: builder.query<
      EmployeePerformanceApiResponse,
      { period: ReportPeriod; location?: number }
    >({
      query: ({ period, location }) => ({
        url: "/admin/district-manager/reports/employee-performance/",
        params: {
          period,
          ...(location ? { location } : {}),
        },
      }),
    }),
  }),
});

export const {
  useGetOverviewReportForDistrictManagerQuery,
  useGetEmployeePerformanceReportForDistrictManagerQuery,
} = disdtrictMangerReportApi;