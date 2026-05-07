import { baseApi } from "@/redux/store/baseApi";

// --- AUTH INTERFACES ---
export interface User {
  id: number;
  email: string;
  username: string;
  // role: string;
  role: "super_admin" | "district_manager" | "branch_manager" | "qr_attendee"; // Added union for better
  role_display: string;
  is_super_admin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  refresh: string;
  access: string; // Change 'token' to 'access' here
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  temp_token: string; // From your 2nd Postman image
}

export interface VerifyOTPRequest {
  temp_token: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
}

export interface ResetPasswordRequest {
  temp_token: string;
  new_password: string; // Matches Postman snake_case
  confirm_password: string; // Matches Postman snake_case
}

export interface ResetPasswordResponse {
  message: string;
}

// --- API ENDPOINTS ---
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Login
    // POST /api/admin/login/
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/admin/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // 2. Forgot Password
    // POST /api/admin/forgot-password/
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/admin/forgot-password/",
        method: "POST",
        body,
      }),
    }),

    // 3. Verify OTP
    // POST /api/admin/verify-otp/
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (body) => ({
        url: "/admin/verify-otp/",
        method: "POST",
        body,
      }),
    }),

    // 4. Reset Password
    // POST /api/admin/reset-password/
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/admin/reset-password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

// --- EXPORT HOOKS ---
export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} = authApi;
