import { baseApi } from "@/redux/store/baseApi";
import {
  EmployeesAttendanceResponse,
  EmployeesAttendanceParams,
  MonthlyAttendanceResponse,
} from "@/types/districtManager/districtManagerProgress.type";

export const districtManagerProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /admin/district-manager/users-attendance/
     * Query params: search, location, year
     */
    getEmployeesAttendance: builder.query<
      EmployeesAttendanceResponse,
      EmployeesAttendanceParams
    >({
      query: (params) => ({
        url: "/admin/district-manager/users-attendance/",
        params,
      }),
      providesTags: ["Attendance"],
    }),

    /**
     * GET /admin/district-manager/attendance/{employeeId}/
     * Query param: month (format: "YYYY-MM")
     */
    getEmployeeMonthlyAttendance: builder.query<
      MonthlyAttendanceResponse,
      { employeeId: number; month: string }
    >({
      query: ({ employeeId, month }) => ({
        url: `/admin/district-manager/attendance/${employeeId}/`,
        params: { month },
      }),
      providesTags: (_result, _error, { employeeId, month }) => [
        { type: "Attendance", id: `${employeeId}-${month}` },
      ],
    }),
  }),
});

export const {
  useGetEmployeesAttendanceQuery,
  useGetEmployeeMonthlyAttendanceQuery,
} = districtManagerProgressApi;