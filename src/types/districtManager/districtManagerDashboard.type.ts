export interface DistrictManagerDashboardResponse {
  greeting: string;
  date_display: string;
  manager: {
    id: number;
    name: string;
    role_display: string;
    profile_photo: string | null;
  };
  stats: {
    active_locations: number;
    task_completion: number;
    task_completion_detail: string;
    avg_attendance: number;
    avg_attendance_label: string;
    overdue_tasks: number;
  };
  location_performance: Array<{
    location_id: number;
    location_name: string;
    city_state: string;
    status: string;
    staff_count: number;
    task_completion: number;
    attendance_rate: number;
    overdue_count: number;
  }>;
  weekly_task_activity: Array<{
    date: string;
    day: string;
    assigned: number;
    completed: number;
  }>;
  attendance_summary: Array<{
    id: number;
    name: string;
    location_name: string;
    present: number;
    late: number;
    absent: number;
  }>;
}

export type TaskStatus =
  | "pending"
  | "awaiting_review"
  | "approved"
  | "rejected"
  | "completed"
  | "overdue";

export interface TaskLogItem {
  id: number;
  title: string;
  assigned_to: string;
  location: string;
  assigned_by: string;
  assigned_by_role: string;
  due_date: string;
  status: TaskStatus;
}

export interface TaskLogResponse {
  task_log: TaskLogItem[];
}