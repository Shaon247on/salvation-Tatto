import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface DashboardStats {
  total_employees: number;
  total_locations: number;
  pending_tasks: number;
  today_attendance: number;
}

export interface AttendanceOverview {
  date: string;
  present: number;
  late: number;
  absent: number;
}

export interface TaskStatusSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface TaskByLocation {
  location_id: number;
  location_name: string;
  pending: number;
  approved: number;
  rejected: number;
}

export interface RecentActivity {
  id: number;
  action: string;
  message: string;
  time_ago: string;
  created_at: string;
}

// New Interfaces for Employee Breakdown
export interface EmployeeBreakdownItem {
  id: number;
  name: string;
  role_display: string;
  location_name: string;
  today_status: string; // "present", "late", "absent"
}

export interface EmployeeBreakdownResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeBreakdownItem[];
}

export interface AdminDashboardResponse {
  stats: DashboardStats;
  attendance_overview: AttendanceOverview[];
  task_status: TaskStatusSummary;
  task_by_location: TaskByLocation[];
  recent_activity: RecentActivity[];
  employee_breakdown: EmployeeBreakdownResponse; // Added from API response
}

// --- API Slice ---

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<
      AdminDashboardResponse,
      { location?: string; page?: number } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.location && params.location !== "all")
          query.append("location", params.location);
        if (params?.page) query.append("page", params.page.toString());

        return {
          url: `/admin/dashboard/?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["AdminDashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = adminDashboardApi;
