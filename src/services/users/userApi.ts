import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface WorkSchedule {
  id: number;
  day: string;
  is_active: boolean;
  start_time: string | null;
  end_time: string | null;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  role_display: string;
  phone: string | null;
  location: number;
  location_name: string;
  is_active: boolean;
  date_joined: string;
  work_schedules: WorkSchedule[];
}

interface UserStats {
  district_managers: number;
  managers: number;
  employees: number;
}

interface UserListResponse {
  stats: UserStats;
  users: {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
  };
}

interface UserQueryParams {
  search?: string;
  page?: number;
}

// --- API Slice ---

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: List users with Search and Pagination
    getUsers: builder.query<UserListResponse, UserQueryParams>({
      query: (params) => ({
        url: "/admin/users/",
        method: "GET",
        params: {
          search: params.search,
          page: params.page || 1,
        },
      }),
      providesTags: ["Users"],
    }),

    // POST: Add new user
    addUser: builder.mutation<{ message: string; user: User }, Partial<User>>({
      query: (newUser) => ({
        url: "/admin/users/",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // PATCH: Edit user
    updateUser: builder.mutation<
      { message: string; user: User },
      { id: number; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // DELETE: Remove user
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
