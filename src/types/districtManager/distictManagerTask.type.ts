export interface Task {
  id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  assigned_to: number;
  assigned_to_name: string;
  assigned_to_email: string;
  assigned_to_role: string;
  due_date: string;
  status: "pending" | "approved" | "overdue" | "rejected";
  is_recurring: boolean;
  frequency: string;
  requires_photo: boolean;
  completed_by: number | null;
  completed_by_name: string | null;
  completed_by_role: string | null;
  is_fired: boolean;
  can_fire: boolean;
  created_at: string;
}

export interface TaskResponse {
  stats: {
    total: number;
    pending: number;
    overdue: number;
  };
  tasks: Task[];
  tasks_meta: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export interface Location {
  id: number;
  name: string;
  street_address: string;
  city_state: string;
  status: string;
  staff_count: number;
}

export interface LocationResponse {
  stats: {
    total_locations: number;
    total_staff: number;
    active_locations: number;
  };
  locations: Location[];
}

export interface Employee {
  id: number;
  name: string;
  role: string;
}

export interface LocationEmployeesResponse {
  location_id: number;
  location_name: string;
  employees: Employee[];
}