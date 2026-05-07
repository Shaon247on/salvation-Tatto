export type TaskStatus = "pending" | "awaiting_review" | "approved" | "rejected" | "overdue";

export interface ManagerTask {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  assigned_to_name: string;
  assigned_to_role: string;
  due_date: string;
  status: TaskStatus;
  submitted_at: string;
  is_recurring: boolean;
  frequency: "daily" | "weekly" | "monthly";
  requires_photo: boolean;
  can_edit: boolean;
}

export interface TaskListResponse {
  location: string;
  tasks: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ManagerTask[];
  };
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  role_display: string;
}

export interface EmployeeResponse {
  location: string;
  location_id: number;
  employees: Employee[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assigned_to: number;
  due_date: string;
  is_recurring: boolean;
  frequency?: "daily" | "weekly" | "monthly";
  requires_photo?: boolean;
}