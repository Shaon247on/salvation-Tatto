// ─── District Manager ─────────────────────────────────────────────────────────

export interface DistrictManagerProfile {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  role_display: string;
  profile_photo: string | null;
  date_joined: string;
  last_login: string | null;
}

// ─── Branch Manager ───────────────────────────────────────────────────────────

export interface BranchManagerLocation {
  id: number;
  name: string;
  street_address: string;
  city_state: string;
  status: string;
}

export interface BranchManagerProfile {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  role_display: string;
  profile_photo: string | null;
  location: BranchManagerLocation | null;
  date_joined: string;
  last_login: string | null;
}

// ─── Shared update / password types ──────────────────────────────────────────

export interface UpdateProfileResponse {
  message: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ChangePasswordErrorResponse {
  error: string;
}

// ─── Normalised profile (used inside components) ──────────────────────────────

export type UserRole = "super_admin" | "district_manager" | "branch_manager";

export interface NormalisedProfile {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  role_display: string;
  profile_photo: string | null;
  date_joined: string;
  last_login: string | null;
  location?: BranchManagerLocation | null; // branch manager only
}