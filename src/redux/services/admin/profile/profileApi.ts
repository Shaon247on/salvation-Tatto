import { baseApi } from "@/redux/store/baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileType {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  role_display: string;
  is_active: boolean;
  profile_photo: string | null;
  date_joined: string;
  // legacy field names kept for backwards compat — both are normalised in the component
  member_since?: string;
  last_login_at?: string | null;
  last_login?: string | null;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileResponse {
  message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/profile/
    getProfile: builder.query<ProfileType, void>({
      query: () => ({
        url: "/admin/profile/",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    // PATCH /admin/profile/  — multipart/form-data
    // FormData may contain: profile_photo (File) and/or name (string)
    // Do NOT set Content-Type header manually — fetch/RTK Query sets it
    // automatically with the correct boundary when body is FormData.
    updateProfilePhoto: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: "/admin/profile/",
        method: "PATCH",
        body: formData,
        // Explicitly omit Content-Type so the browser sets multipart boundary
        formData: true,
      }),
      invalidatesTags: ["Profile"],
    }),

    // POST /admin/profile/password/
    changePassword: builder.mutation<
      { message: string },
      ChangePasswordRequest
    >({
      query: (credentials) => ({
        url: "/admin/profile/password/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfilePhotoMutation,
  useChangePasswordMutation,
} = profileApi;