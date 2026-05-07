// redux/services/districtManager/verificationApi.ts
import { baseApi } from "@/redux/store/baseApi";
import {
  VerificationResponse,
  ApproveTaskResponse,
  RejectTaskRequest,
  RejectTaskResponse,
} from "@/types/districtManager/districtManagerVerification.type";

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVerificationsForDistrictManager: builder.query<
      VerificationResponse,
      { tab: string; page?: number }
    >({
      query: ({ tab, page = 1 }) => ({
        url: `/admin/district-manager/verifications/`,
        params: { tab, page },
      }),
      providesTags: ["Verification"],
    }),

    approveTaskForDistrictManager: builder.mutation<
      ApproveTaskResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/district-manager/verifications/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Verification"],
    }),

    rejectTaskForDistrictManager: builder.mutation<
      RejectTaskResponse,
      RejectTaskRequest
    >({
      query: ({ id, rejection_reason }) => ({
        url: `/admin/district-manager/verifications/${id}/reject/`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: ["Verification"],
    }),
  }),
});

export const {
  useGetVerificationsForDistrictManagerQuery,
  useApproveTaskForDistrictManagerMutation,
  useRejectTaskForDistrictManagerMutation,
} = verificationApi;