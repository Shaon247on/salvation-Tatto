import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface BranchManagerDashboardStats {
  total_employees: number;
  total_tasks: number;
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

export interface RecentActivity {
  id: number;
  action: string;
  message: string;
  time_ago: string;
  created_at: string;
}

export interface BranchManagerDashboardResponse {
  stats: BranchManagerDashboardStats;
  attendance_overview: AttendanceOverview[];
  task_status: TaskStatusSummary;
  recent_activity: RecentActivity[];
}

// --- API Slice ---

export const branchManagerDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Dashboard Stats & Overview
    getBranchManagerDashboard: builder.query<BranchManagerDashboardResponse, void>({
      query: () => ({
        url: "/admin/manager/dashboard/",
        method: "GET",
      }),
      providesTags: ["BranchManagerDashboard"],
    }),
  }),
});

export const { useGetBranchManagerDashboardQuery } = branchManagerDashboardApi;