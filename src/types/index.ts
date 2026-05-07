// User & Auth Types
export type UserRole =
  | "super_admin"
  | "district_manager"
  | "branch_manager"
  | "clock_in_user"
  | "qr_attendee";

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole; // Added union for better type safety
  role_display: string;
  is_super_admin: boolean;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// RBAC Permission Types
export type Permission =
  | "dashboard:view"
  | "tasks:view"
  | "tasks:create"
  | "tasks:edit"
  | "tasks:delete"
  | "verifications:view"
  | "verifications:approve"
  | "verifications:reject"
  | "reports:view"
  | "reports:export"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "locations:view"
  | "locations:create"
  | "locations:edit"
  | "locations:delete"
  | "notifications:view"
  | "notifications:manage"
  | "instructions:view"
  | "instructions:manage"
  | "performance:view"
  | "settings:manage"
  | "qr-section"
  | "app-content"
  | "users_attendance"
  | "profile";

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  assignedBy: string;
  locationId: string;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "on_leave";
  locationId: string;
}

export interface AttendanceSummary {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalOnLeave: number;
  records: AttendanceRecord[];
}

// Report Types
export interface Report {
  id: string;
  title: string;
  type: "attendance" | "task" | "performance" | "financial";
  dateRange: {
    start: string;
    end: string;
  };
  locationId?: string;
  generatedBy: string;
  createdAt: string;
  data: Record<string, unknown>;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  userId: string;
  createdAt: string;
}

// Performance Types
export interface PerformanceMetric {
  userId: string;
  period: string;
  taskCompletionRate: number;
  attendanceRate: number;
  avgTaskDuration: number;
  rating: number;
}

// API Response Types
// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
//   error?: string;
// }

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
