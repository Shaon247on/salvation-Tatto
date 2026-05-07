// import { baseApi } from "@/redux/store/baseApi";

// // --- USER INTERFACES ---

// export interface WorkSchedule {
//   id?: number;
//   day: string;
//   is_active: boolean;
//   start_time: string | null;
//   end_time: string | null;
// }

// export interface UserStats {
//   district_managers: number;
//   managers: number;
//   employees: number;
// }

// export interface UserListItem {
//   id: number;
//   first_name: string;
//   last_name: string;
//   username: string;
//   email: string;
//   role: string;
//   role_display: string;
//   location: number;
//   location_name: string;
//   is_active: boolean;
//   joined: string;
// }

// export interface UserDetails extends UserListItem {
//   phone: string | null;
//   date_joined: string;
//   work_schedules: WorkSchedule[];
// }

// export interface UserListResponse {
//   stats: UserStats;
//   users: {
//     count: number;
//     next: string | null;
//     previous: string | null;
//     results: UserListItem[];
//   };
// }

// export interface CreateUserRequest {
//   first_name: string;
//   last_name: string;
//   username: string;
//   email: string;
//   password: string;
//   role: string;
//   location: number;
//   work_schedules: Omit<WorkSchedule, "id">[];
// }

// export interface UpdateUserRequest extends Partial<CreateUserRequest> {
//   id: number;
// }

// export interface UpdateUserResponse {
//   message: string;
//   user: UserDetails;
// }

// // --- API ENDPOINTS ---

// export const userApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // 1. Get User List / Search / Pagination
//     getUsers: builder.query<
//       UserListResponse,
//       { search?: string; page?: number } | void
//     >({
//       query: (params) => ({
//         url: "/admin/users/",
//         method: "GET",
//         // params will now include { search: '...', page: 1 }
//         params: params || {},
//       }),
//       providesTags: ["Users"],
//     }),

//     // 2. Add User
//     // POST /api/admin/users/
//     addUser: builder.mutation<UserDetails, CreateUserRequest>({
//       query: (body) => ({
//         url: "/admin/users/",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Users"],
//     }),

//     // 3. Edit User
//     // PATCH /api/admin/users/{id}/
//     updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
//       query: ({ id, ...body }) => ({
//         url: `/admin/users/${id}/`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: ["Users"],
//     }),

//     // 4. Delete User
//     // DELETE /api/admin/users/{id}/
//     deleteUser: builder.mutation<{ message: string }, number>({
//       query: (id) => ({
//         url: `/admin/users/${id}/`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Users"],
//     }),
//   }),
// });

// // --- EXPORT HOOKS ---
// export const {
//   useGetUsersQuery,
//   useAddUserMutation,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
// } = userApi;

import { baseApi } from "@/redux/store/baseApi";

// --- USER INTERFACES ---

export interface WorkSchedule {
  id?: number;
  day: string;
  is_active: boolean;
  start_time: string | null;
  end_time: string | null;
}

export interface UserStats {
  district_managers: number;
  managers: number;
  employees: number;
}

export interface UserListItem {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  role_display: string;
  location: number;
  location_name: string;
  is_active: boolean;
  joined: string;
}

export interface UserDetails extends UserListItem {
  phone: string | null;
  date_joined: string;
  work_schedules: WorkSchedule[];
  user_status?: string; // Matching your JSON response
}

export interface UserListResponse {
  stats: UserStats;
  users: {
    count: number;
    next: string | null;
    previous: string | null;
    results: UserListItem[];
  };
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  location: number;
  status: string; // "active" or "suspended"
  work_schedules: Omit<WorkSchedule, "id">[];
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

export interface UpdateUserResponse {
  message: string;
  user: UserDetails;
}

// --- API ENDPOINTS ---

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      UserListResponse,
      { search?: string; page?: number } | void
    >({
      query: (params) => ({
        url: "/admin/users/",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Users"],
    }),

    addUser: builder.mutation<UserDetails, CreateUserRequest>({
      query: (body) => ({
        url: "/admin/users/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

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
