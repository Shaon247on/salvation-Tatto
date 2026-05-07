import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface VerificationTask {
  id: number;
  title: string;
  description: string;
  location: number;
  location_name: string;
  assigned_to: number;
  assigned_to_name: string;
  assigned_to_role: string;
  due_date: string;
  status: "awaiting_review" | "approved" | "rejected";
  is_recurring: boolean;
  frequency: string;
  requires_photo: boolean;
  photo_url: string | null;
  completed_by: number;
  completed_by_name: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationStats {
  all: number;
  awaiting_review: number;
  approved: number;
  rejected: number;
}

export interface VerificationListResponse {
  location: string;
  stats: VerificationStats;
  tasks: {
    count: number;
    next: string | null;
    previous: string | null;
    results: VerificationTask[];
  };
}

export interface VerificationFilters {
  status?: "awaiting_review" | "approved" | "rejected";
  page?: number;
}

export interface ApproveRejectResponse {
  message: string;
}

// --- API Slice ---

export const branchManagerVerificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch Verification List with Stats & Filters
    getVerifications: builder.query<VerificationListResponse, VerificationFilters | void>({
      query: (params) => ({
        url: "/admin/manager/verifications/",
        method: "GET",
        params: {
          status: params?.status,
          page: params?.page || 1,
        },
      }),
      providesTags: ["BranchManagerVerifications"],
    }),

    // GET: Specific Task Verification Details
    getVerificationDetails: builder.query<VerificationTask, number>({
      query: (id) => `/admin/manager/verifications/${id}/`,
      providesTags: (result, error, id) => [{ type: "BranchManagerVerifications", id }],
    }),

    // POST: Approve Task
    approveVerification: builder.mutation<ApproveRejectResponse, number>({
      query: (id) => ({
        url: `/admin/manager/verifications/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["BranchManagerVerifications", "BranchManagerTasks"],
    }),

    // POST: Reject Task
    rejectVerification: builder.mutation<
      ApproveRejectResponse,
      { id: number; rejection_reason: string }
    >({
      query: ({ id, rejection_reason }) => ({
        url: `/admin/manager/verifications/${id}/reject/`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: ["BranchManagerVerifications", "BranchManagerTasks"],
    }),
  }),
});

export const {
  useGetVerificationsQuery,
  useGetVerificationDetailsQuery,
  useApproveVerificationMutation,
  useRejectVerificationMutation,
} = branchManagerVerificationApi;