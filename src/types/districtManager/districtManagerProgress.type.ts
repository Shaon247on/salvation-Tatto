// ─── Employee Attendance List ────────────────────────────────────────────────

export interface AttendanceEmployee {
  id: number;
  name: string;
  role: string;
  location_name: string;
  location_id: number;
  present: number;
  late: number;
  absent: number;
}

export interface EmployeesAttendanceMeta {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface EmployeesAttendanceResponse {
  year: number;
  employees: AttendanceEmployee[];
  employees_meta: EmployeesAttendanceMeta;
}

export interface EmployeesAttendanceParams {
  search?: string;
  location?: number;
  year?: number;
}

// ─── Monthly Attendance Detail ────────────────────────────────────────────────

export type DayAttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "weekday";

export interface DailyAttendanceRecord {
  date: string;        // "2026-01-05"
  day: number;         // 5
  weekday: string;     // "Mon"
  is_work_day: boolean;
  status: DayAttendanceStatus;
  clock_in: string | null;
  clock_out: string | null;
}

export interface MonthlyAttendanceSummary {
  present: number;
  late: number;
  absent: number;
}

export interface MonthlyAttendanceEmployee {
  id: number;
  name: string;
  role: string;
  location: string;
}

export interface MonthlyAttendanceResponse {
  employee: MonthlyAttendanceEmployee;
  mode: string;
  month: string;          // "2026-01"
  month_label: string;    // "January 2026"
  summary: MonthlyAttendanceSummary;
  records: DailyAttendanceRecord[];
}