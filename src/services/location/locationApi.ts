import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface Location {
  id: number;
  name: string;
  street_address: string;
  city_state: string;
  status: "active" | "inactive";
  staff_count: number;
  created_at: string;
  updated_at: string;
}

interface LocationStats {
  total_locations: number;
  total_staff: number;
  active_locations: number;
}

interface LocationListResponse {
  stats: LocationStats;
  locations: Location[];
}

// --- API Slice ---

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: List locations and stats
    // URL: /api/admin/locations/
    getLocations: builder.query<LocationListResponse, void>({
      query: () => "/admin/locations/",
      providesTags: ["Locations"],
    }),

    // POST: Add new location
    // Body matches image_d65d47.png
    addLocation: builder.mutation<
      { message: string; location: Location },
      Partial<Location>
    >({
      query: (newLocation) => ({
        url: "/admin/locations/",
        method: "POST",
        body: newLocation,
      }),
      invalidatesTags: ["Locations"],
    }),

    // PATCH: Edit location (status or other details)
    // URL Example: /api/admin/locations/1/
    updateLocation: builder.mutation<
      { message: string; location: Location },
      { id: number; data: Partial<Location> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/locations/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Locations"],
    }),

    // DELETE: Remove location
    // URL Example: /api/admin/locations/1/
    deleteLocation: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/locations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locations"],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationApi;
