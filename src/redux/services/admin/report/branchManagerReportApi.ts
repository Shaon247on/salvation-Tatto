import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface ReportStats {
  total_employees: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  attendance_rate: number;
}

export interface EmployeeReport {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  role_display: string;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  attendance_rate: number;
  last_attendance: string | null;
}

export interface TaskReport {
  id: number;
  title: string;
  assigned_to_name: string;
  status: string;
  due_date: string;
  completed_at: string | null;
}

export interface AttendanceReport {
  date: string;
  present: number;
  late: number;
  absent: number;
  total: number;
}

export interface BranchManagerReportsResponse {
  stats: ReportStats;
  employee_reports: {
    count: number;
    next: string | null;
    previous: string | null;
    results: EmployeeReport[];
  };
  task_reports: TaskReport[];
  attendance_reports: AttendanceReport[];
}

export interface ReportFilters {
  period?: "today" | "week" | "month" | "year";
  location?: string;
  page?: number;
}

// --- API Slice ---

export const branchManagerReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Reports Stats and Data
    getBranchManagerReports: builder.query<BranchManagerReportsResponse, ReportFilters | void>({
      query: (params) => ({
        url: "/admin/manager/reports/",
        method: "GET",
        params: {
          period: params?.period || "month",
          location: params?.location,
          page: params?.page || 1,
        },
      }),
      providesTags: ["BranchManagerReports"],
    }),
  }),
});

export const { useGetBranchManagerReportsQuery } = branchManagerReportsApi;