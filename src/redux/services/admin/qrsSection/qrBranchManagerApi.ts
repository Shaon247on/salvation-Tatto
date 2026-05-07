import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface QrSession {
  id: number;
  token: string;
  location: string;
  refresh_interval: number;
  interval_display: string;
  expires_at: string;
  is_active: boolean;
  is_expired: boolean;
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

export interface QrInterval {
  value: number;
  label: string;
}

// Response Interfaces
interface QrSessionResponse {
  message: string;
  qr_session: QrSession;
}

interface CurrentQrResponse {
  qr_session: QrSession | null;
  seconds_left: number;
}

interface QrHistoryResponse {
  location: string;
  history: {
    count: number;
    next: string | null;
    previous: string | null;
    results: QrSession[];
  };
}

interface QrDetailsResponse {
  qr_session: QrSession;
  attendances: AttendanceRecord[];
}

interface QrIntervalsResponse {
  intervals: QrInterval[];
}

// --- API Slice ---

export const qrBranchManagerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Generate QR (image_08cca1.png)
    generateQr: builder.mutation<
      QrSessionResponse,
      { refresh_interval: number }
    >({
      query: (body) => ({
        url: "/admin/manager/qr/generate/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BranchManagerQrSession"],
    }),

    // POST: Regenerate QR (image_08cd02.png)
    regenerateQr: builder.mutation<
      QrSessionResponse,
      { refresh_interval: number }
    >({
      query: (body) => ({
        url: "/admin/manager/qr/regenerate/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BranchManagerQrSession"],
    }),

    // GET: Current QR Code (image_091ebb.png)
    getCurrentQr: builder.query<CurrentQrResponse, void>({
      query: () => "/admin/manager/qr/current/",
      providesTags: ["BranchManagerQrSession"],
    }),

    // GET: QR Code History with pagination (image_091f3e.png)
    getQrHistory: builder.query<QrHistoryResponse, { page?: number }>({
      query: (params) => ({
        url: "/admin/manager/qr/history/",
        method: "GET",
        params: {
          page: params.page || 1,
        },
      }),
      providesTags: ["BranchManagerQrSession"],
    }),

    // GET: Specific QR Details and Attendances (image_091f7d.png)
    getQrDetails: builder.query<QrDetailsResponse, number>({
      query: (id) => `/admin/manager/qr/${id}/details/`,
      providesTags: (result, error, id) => [
        { type: "BranchManagerQrSession", id },
      ],
    }),

    // GET: Interval List for dropdowns (image_092261.png)
    getQrIntervals: builder.query<QrIntervalsResponse, void>({
      query: () => "/admin/manager/qr/intervals/",
    }),
  }),
});

export const {
  useGenerateQrMutation,
  useRegenerateQrMutation,
  useGetCurrentQrQuery,
  useGetQrHistoryQuery,
  useGetQrDetailsQuery,
  useGetQrIntervalsQuery,
} = qrBranchManagerApi;
