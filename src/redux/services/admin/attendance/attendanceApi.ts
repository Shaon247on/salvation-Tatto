/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/store/baseApi";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<
      any,
      { search?: string; location?: string; period?: string; page?: number }
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params.search) query.append("search", params.search);
        if (params.location && params.location !== "all")
          query.append("location", params.location);
        if (params.period) query.append("period", params.period.toLowerCase());
        if (params.page) query.append("page", params.page.toString());

        return {
          url: `/admin/users-attendance/?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Attendance"],
    }),
  }),
});

export const { useGetAttendanceQuery } = attendanceApi;
