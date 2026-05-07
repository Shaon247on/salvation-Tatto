export type ReportPeriod = "weekly" | "monthly" | "yearly";

export interface OverviewStats {
  task_completion_rate: number;
  avg_attendance_rate: number;
  overdue_tasks: number;
  late_arrivals: number;
}

export interface LocationChartItem {
  location: string;
  location_id: number;
  completion: number;
  attendance: number;
}

export interface LocationSummaryItem {
  location_id: number;
  location_name: string;
  staff_count: number;
  tasks_done: number;
  tasks_total: number;
  tasks_display: string;
  completion_rate: number;
  attendance_rate: number;
  overdue_count: number;
}

export interface OverviewReportResponse {
  period: ReportPeriod;
  stats: OverviewStats;
  location_chart: LocationChartItem[];
  location_summary: LocationSummaryItem[];
}

/* ---------- Top Performers ---------- */
export interface TopPerformer {
  rank: number;
  id: number;
  name: string;
  role: string;
  location: string;
  score: number;
}

/* ---------- On Time Rate Chart ---------- */
export interface OnTimeRateItem {
  name: string;
  on_time_rate: number;
}

/* ---------- Employee Performance Row ---------- */
export interface EmployeePerformanceRow {
  id: number;
  name: string;
  role: string;
  location: string;
  location_id: number;
  tasks_completed: number;
  tasks_total: number;
  tasks_display: string;
  present: number;
  late_arrivals: number;
  absent: number;
  total_days: number;
  on_time_rate: number;
  task_rate: number;
  score: number;
}

/* ---------- Paginated Wrapper ---------- */
export interface EmployeePerformancePagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeePerformanceRow[];
}

/* ---------- FINAL RESPONSE ---------- */
export interface EmployeePerformanceApiResponse {
  period: ReportPeriod;
  period_label: string;
  location_filter: number | null;
  location_label: string;
  employee_count: number;

  top_performers: TopPerformer[];
  on_time_rate_chart: OnTimeRateItem[];
  employee_performance: EmployeePerformancePagination;
}