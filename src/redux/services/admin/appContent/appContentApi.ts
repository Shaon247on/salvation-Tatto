import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface SplashScreen {
  id: number;
  app_image_url: string;
  web_image_url: string;
  type: "app" | "web"; // Added based on Postman screenshot
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

interface FAQListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FAQ[];
}

interface FAQQueryParams {
  page?: number;
}

interface CreateFAQRequest {
  question: string;
  answer: string;
}

// --- API Slice ---

export const appContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Splash Screen Endpoints ---

    // Updated to accept type: 'app' or 'web'
    getSplashScreen: builder.query<SplashScreen, "app" | "web">({
      query: (type) => ({
        url: "/admin/app-content/splash-screen/",
        method: "GET",
        params: { type }, // Passing type as a query parameter
        headers: {
          "no-auth": "true",
        },
      }),
      providesTags: (result, error, type) => [{ type: "AppContent", id: type }],
    }),

    // Updated to handle multipart form-data as shown in Postman
    // updateSplashScreen: builder.mutation<SplashScreen, FormData>({
    //   query: (formData) => ({
    //     url: "/admin/app-content/splash-screen/",
    //     method: "POST",
    //     body: formData,
    //     // Note: When passing FormData, do not set Content-Type header manually;
    //     // the browser/fetch will set it with the correct boundary.
    //   }),
    //   // Invalidates both to ensure UI stays in sync
    //   invalidatesTags: ["AppContent"],
    // }),

    updateSplashScreen: builder.mutation<SplashScreen, FormData>({
      query: (formData) => ({
        url: "/admin/app-content/splash-screen/",
        method: "POST",
        body: formData,
        // FIX: Tell the baseApi NOT to set Content-Type so boundary is preserved
        prepareHeaders: (headers: Headers) => {
          headers.delete("Content-Type");
          return headers;
        },
      }),
      invalidatesTags: ["AppContent"],
    }),

    // --- FAQ Endpoints ---

    getFAQs: builder.query<FAQListResponse, FAQQueryParams>({
      query: (params) => ({
        url: "/admin/app-content/faqs/",
        method: "GET",
        params: {
          page: params.page || 1,
        },
      }),
      providesTags: ["FAQs"],
    }),

    createFAQ: builder.mutation<
      { message: string; faq: FAQ },
      CreateFAQRequest
    >({
      query: (newFaq) => ({
        url: "/admin/app-content/faqs/",
        method: "POST",
        body: newFaq,
      }),
      invalidatesTags: ["FAQs"],
    }),

    updateFAQ: builder.mutation<
      { message: string; faq: FAQ },
      { id: number; data: Partial<CreateFAQRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/app-content/faqs/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FAQs"],
    }),

    deleteFAQ: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/app-content/faqs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQs"],
    }),
  }),
});

export const {
  useGetSplashScreenQuery,
  useUpdateSplashScreenMutation,
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = appContentApi;
