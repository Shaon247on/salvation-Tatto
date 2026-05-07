import { baseApi } from "@/redux/store/baseApi";
import type { User } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  access: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  temp_token: string;
  confirm_password: string;
  new_password: string;
}

interface VerifyOTPRequest {
  temp_token: string;
  otp: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/admin/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation<
      { message: string; temp_token: string },
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/admin/forgot-password/",
        method: "POST",
        body,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/admin/reset-password/",
        method: "POST",
        body,
      }),
    }),

    // Verify OTP
    verifyOTP: builder.mutation<{ message: string }, VerifyOTPRequest>({
      query: (body) => ({
        url: "/admin/verify-otp/",
        method: "POST",
        body,
      }),
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => "/admin/me",
      providesTags: ["Users"],
    }),

    // Update profile
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/admin/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // Logout (invalidate tokens)
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;
