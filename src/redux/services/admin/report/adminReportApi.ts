import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface ReportStats {
  avg_attendance_rate: number;
  task_completion_rate: number;
  total_active_staff: number;
  pending_tasks: number;
}

export interface AttendanceTrend {
  date: string;
  present: number;
  late: number;
  absent: number;
}

export interface TaskCompletionTrend {
  date: string;
  approved: number;
  completed: number;
  pending: number;
}

export interface LocationAttendance {
  location_id: number;
  location_name: string;
  staff_count: number;
  attendance_rate: number;
}

export interface LocationTaskCompletion {
  location_id: number;
  location_name: string;
  total_tasks: number;
  completed: number;
  completion_rate: number;
}

export interface AttendanceSummaryEntry {
  date: string;
  raw_date: string;
  location: string;
  present: number;
  absent: number;
  late: number;
  rate: string; // "100%", "0%" etc.
}
export interface AttendanceLog {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttendanceSummaryEntry[];
}

export interface AdminReportResponse {
  period: string;
  stats: ReportStats;
  attendance_trend: AttendanceTrend[];
  weekly_task_completion: TaskCompletionTrend[];
  attendance_by_location: LocationAttendance[];
  task_completion_by_location: LocationTaskCompletion[];
  attendance_log: AttendanceSummaryEntry[];
}

export interface ReportQueryParams {
  period?: "today" | "weekly" | "monthly" | "yearly";
  location?: number;
  page?: number;
}

// --- API Slice ---

export const adminReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Admin Reports (Stats and Lists)
    getAdminReports: builder.query<
      AdminReportResponse,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/reports/",
        method: "GET",
        params: {
          period: params?.period || "weekly",
          location: params?.location,
          page: params?.page || 1,
        },
      }),
      providesTags: ["AdminReports"],
    }),
  }),
});

export const { useGetAdminReportsQuery } = adminReportApi;
