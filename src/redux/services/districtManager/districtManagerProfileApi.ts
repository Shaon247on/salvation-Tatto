import { baseApi } from "@/redux/store/baseApi";
import {
  DistrictManagerProfile,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/ManagerProfile.type";

export const districtManagerProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/district-manager/profile/
    getDistrictManagerProfile: builder.query<DistrictManagerProfile, void>({
      query: () => "/admin/district-manager/profile/",
      providesTags: ["DistrictManagerProfile"],
    }),

    // PATCH /admin/district-manager/profile/  (multipart/form-data)
    updateDistrictManagerProfile: builder.mutation<
      UpdateProfileResponse,
      FormData
    >({
      query: (body) => ({
        url: "/admin/district-manager/profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DistrictManagerProfile"],
    }),

    // POST /admin/district-manager/profile/password/
    changeDistrictManagerPassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/admin/district-manager/profile/password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetDistrictManagerProfileQuery,
  useUpdateDistrictManagerProfileMutation,
  useChangeDistrictManagerPasswordMutation,
} = districtManagerProfileApi;