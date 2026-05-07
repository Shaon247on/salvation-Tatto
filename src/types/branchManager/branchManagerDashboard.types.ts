// src/types/branchManagerDashboard.types.ts

export interface TodayAttendance {
  total: number;
  present: number;
  late: number;
  absent: number;
}

export interface DashboardStats {
  total_employees: number;
  pending_verifications: number;
  today_attendance: TodayAttendance;
}

export interface TodayStaff {
  id: number;
  name: string;
  role: string;
  status: "present" | "late" | "absent";
  late_minutes: number | null;
  clock_in: string | null;
}

export interface RecentTask {
  id: number;
  title: string;
  assigned_to: string;
  due_date: string;
  status: string;
  status_display: string;
}

export interface BranchManagerDashboardResponse {
  greeting: string;
  date_display: string;
  location_name: string;
  stats: DashboardStats;
  today_staff: TodayStaff[];
  recent_tasks: RecentTask[];
}