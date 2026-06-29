import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface QrSession {
  id: number;
  token: string;
  location_id?: number;
  location?: string | number;
  location_name?: string;
  duration_seconds: number;
  duration_minutes: number;
  duration_seconds_part: number;
  duration_display: string;
  expires_at: string;
  is_active: boolean;
  is_expired?: boolean;
  seconds_left?: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  employee_name: string;
  employee_email: string;
  employee_role: string;
  location_name: string;
  date: string;
  status: "present" | "late" | "absent";
  clock_in: string;
  clock_out: string | null;
  created_at: string;
}

export interface LocationOption {
  id: number;
  name: string;
}

// --- Response Interfaces ---

export interface QrAdminGenerateResponse {
  message: string;
  qr_session: QrSession;
}

export interface QrAdminSummaryResponse {
  active_sessions: QrSession[];
  history: {
    count: number;
    next: string | null;
    previous: string | null;
    results: QrSession[];
  };
  filter_options: {
    locations: LocationOption[];
  };
}

export interface QrAdminDetailsResponse {
  qr_session: QrSession;
  attendances: AttendanceRecord[];
}

// --- API Slice ---

export const qrAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST: Generate QR for a specific location
     * Based on Image: /api/admin/qr/
     */
    generateAdminQr: builder.mutation<
      QrAdminGenerateResponse,
      { minutes: number; seconds: number; location: number }
    >({
      query: (body) => ({
        url: "/admin/qr/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminQrSession"],
    }),

    /**
     * GET: Get all QR codes, active sessions, and filter options
     * Based on Image: /api/admin/qr/
     */
    getQrAdminSummary: builder.query<
      QrAdminSummaryResponse,
      { location?: number; page?: number } | void
    >({
      query: (params) => ({
        url: "/admin/qr/",
        method: "GET",
        params: {
          location: params?.location,
          page: params?.page || 1,
        },
      }),
      providesTags: ["AdminQrSession"],
    }),

    /**
     * GET: Specific QR Details and Attendances
     * Based on Image: /api/admin/qr/{id}/details/
     */
    getAdminQrDetails: builder.query<QrAdminDetailsResponse, number>({
      query: (id) => `/admin/qr/${id}/details/`,
      providesTags: (result, error, id) => [{ type: "AdminQrSession", id }],
    }),
  }),
});

export const {
  useGenerateAdminQrMutation,
  useGetQrAdminSummaryQuery,
  useGetAdminQrDetailsQuery,
} = qrAdminApi;