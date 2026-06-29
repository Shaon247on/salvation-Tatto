import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---


export interface NotificationStats {
  total_sent: number;
  delivered: number;
  active_locations: number;
}

export interface Recipient {
  id: number;
  name: string;
  role: string;
}

// Received notification shape from API
export interface ReceivedNotificationItem {
  id: number;
  sender: number;
  sender_name: string;
  sender_role: string;
  message: string;
  image: string;
  created_at: string;
}

// Sent notification shape from API
export interface SentNotificationItem {
  id: number;
  message: string;
  image: string;
  created_at: string;
  recipients: Recipient[];
}

export interface GetNotificationsResponse {
  received: ReceivedNotificationItem[];
}

export interface SendNotificationRequest {
  email: string;
  location: number;
  message: string;
}

export interface SendBulkNotificationRequest {
  recipients: number[];
  message: string;
  image?: File;
}

export interface SendNotificationResponse {
  message: string;
  sent_count: number;
  failed_count: number;
  total: number;
}

export interface RecipientItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  location_id: number;
  location__name: string;
}

export interface GetRecipientsResponse {
  recipients: RecipientItem[];
}
// --- API Slice ---

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET: Fetch notification stats and list
     * Based on: /api/admin/notifications/
     */
    getNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => ({
        url: "/admin/notifications/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result?.received?.map(({ id }) => ({
                type: "Notifications" as const,
                id,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),

    getSentNotification: builder.query<SentNotificationItem[], void>({
      query: () => "/admin/notifications/sent/",
      providesTags: (result) =>
        result
          ? [
              ...result?.map(({ id }) => ({
                type: "Notifications" as const,
                id,
              })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),
    /**
     * POST: Send Admin Notification
     */
    sendNotification: builder.mutation<
      SendNotificationResponse,
      SendNotificationRequest
    >({
      query: (notificationData) => ({
        url: "/admin/notifications/",
        method: "POST",
        body: notificationData,
      }),
      // This forces the "getNotifications" query to refetch data automatically
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    /**
     * POST: Send Bulk Notification to multiple users/roles
     */
    sendBulkNotification: builder.mutation<SendNotificationResponse, FormData>({
      query: (formData) => ({
        url: "/admin/notifications/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    getRecipients: builder.query<
      GetRecipientsResponse,
      { search?: string; role?: string; location?: number }
    >({
      query: ({ search, role, location }) => {
        const params = new URLSearchParams();

        if (search?.trim()) params.append("search", search);
        if (role?.trim()) params.append("role", role);
        if (location) params.append("location", String(location));

        return {
          url: `/admin/notifications/recipients/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Notifications"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetSentNotificationQuery,
  useSendNotificationMutation,
  useSendBulkNotificationMutation,
  useGetRecipientsQuery,
} = notificationApi;
