import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from ".";

//TODO: Move all report-related types here and export them for
// Base URL for API - configurable via environment variable
// const BASE_URL = "https://stm9wlhp-8000.inc1.devtunnels.ms/api";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Create the base API with RTK Query
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // prepareHeaders: (headers, { getState }) => {
    //   // Pull token from auth slice
    //   const state = getState() as RootState;
    //   const token = state?.auth?.token;

    //   // Debug: Log token info
    //   if (typeof window !== "undefined") {
    //     console.log(
    //       "baseApi prepareHeaders - Token:",
    //       token ? "✓ Present" : "✗ Missing",
    //     );
    //   }

    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //     console.log("✓ Authorization header set with token");
    //   } else {
    //     console.warn("✗ No token available in Redux");
    //   }

    //   headers.set("Content-Type", "application/json");
    //   return headers;
    // },
    prepareHeaders: (headers, { getState }) => {
      // 1. Check if the "no-auth" header was passed from the endpoint
      const skipAuth = headers.get("no-auth");

      if (skipAuth) {
        // Remove the flag so it's not sent to the backend
        headers.delete("no-auth");
      } else {
        // 2. Standard Auth Logic (Only runs if no-auth is NOT present)
        const state = getState() as RootState;
        const token = state?.auth?.token;

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      // headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Locations",
    "Tasks",
    "Instructions",
    "AppContent",
    "FAQs",
    "Profile",
    "BranchManagerQrSession",
    "Performance",
    "AdminReports",
    "AdminDashboard",
    "BranchManagerTasks",
    "BranchManagerDashboard",
    "BranchManagerVerifications",
    "BranchManagerReports",
    "Attendance",
    "Notifications",
    "AdminQrSession",
    "Reports",
    "DistrictDashboard",
    "Verification",
    "DistrictManagerProfile",
    "BranchManagerProfile"
  ],
  endpoints: () => ({}),
});

// Export utility functions
export const { util: apiUtil } = baseApi;

// Export the api for injection
export { baseApi as api };
