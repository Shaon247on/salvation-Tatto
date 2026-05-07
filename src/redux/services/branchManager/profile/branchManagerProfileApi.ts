import { baseApi } from "@/redux/store/baseApi";
import {
  BranchManagerProfile,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/ManagerProfile.type";

export const branchManagerProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/branch-manager/profile/
    getBranchManagerProfile: builder.query<BranchManagerProfile, void>({
      query: () => "/admin/branch-manager/profile/",
      providesTags: ["BranchManagerProfile"],
    }),

    // PATCH /admin/branch-manager/profile/  (multipart/form-data)
    updateBranchManagerProfile: builder.mutation<
      UpdateProfileResponse,
      FormData
    >({
      query: (body) => ({
        url: "/admin/branch-manager/profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BranchManagerProfile"],
    }),

    // POST /admin/branch-manager/profile/password/
    changeBranchManagerPassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/admin/branch-manager/profile/password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetBranchManagerProfileQuery,
  useUpdateBranchManagerProfileMutation,
  useChangeBranchManagerPasswordMutation,
} = branchManagerProfileApi;