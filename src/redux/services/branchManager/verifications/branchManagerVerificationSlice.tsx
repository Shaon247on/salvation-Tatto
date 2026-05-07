import { baseApi } from "@/redux/store/baseApi";
import type {
  VerificationResponse,
  VerificationTab,
  TaskDetail,
  TaskActionResponse,
} from "@/types/branchManager/branchManagerVerification.type";

export const branchManagerVerification = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: List verifications by tab
    // /admin/manager/verifications/?tab=awaiting_review
    getVerifications: builder.query<VerificationResponse, VerificationTab>({
      query: (tab) => ({
        url: "/admin/manager/verifications/",
        method: "GET",
        params: { tab },
      }),
      providesTags: ["BranchManagerVerifications"],
    }),

    // GET: Single task detail
    // /admin/manager/tasks/{id}/
    getTaskDetail: builder.query<TaskDetail, number>({
      query: (id) => ({
        url: `/admin/manager/tasks/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "BranchManagerVerifications", id },
      ],
    }),

    // POST: Approve a task — no body required
    // /admin/manager/tasks/{id}/approve/
    approveTask: builder.mutation<TaskActionResponse, number>({
      query: (id) => ({
        url: `/admin/manager/tasks/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["BranchManagerVerifications"],
    }),

    // POST: Reject a task — no body required
    // /admin/manager/tasks/{id}/reject/
    // Note: rejection_reason is NOT sent in the body per the API spec
    rejectTask: builder.mutation<TaskActionResponse, number>({
      query: (id) => ({
        url: `/admin/manager/tasks/${id}/reject/`,
        method: "POST",
      }),
      invalidatesTags: ["BranchManagerVerifications"],
    }),

    // DELETE: Delete a task
    // /admin/manager/verifications/{id}/
    deleteTask: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/manager/verifications/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["BranchManagerVerifications"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetVerificationsQuery,
  useGetTaskDetailQuery,
  useApproveTaskMutation,
  useRejectTaskMutation,
  useDeleteTaskMutation,
} = branchManagerVerification;
