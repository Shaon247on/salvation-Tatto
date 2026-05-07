import { baseApi } from "@/redux/store/baseApi";

// --- Types & Interfaces ---

export interface NotificationStats {
  total_sent: number;
  delivered: number;
  active_locations: number;
}

export interface NotificationItem {
  id: number;
  email: string;
  location: number;
  location_name: string;
  message: string;
  status: string;
  sent_by: number;
  sent_by_name: string;
  created_at: string; // ISO Date string
}

export interface GetNotificationsResponse {
  stats: NotificationStats;
  recent_notifications: NotificationItem[];
}

export interface SendNotificationRequest {
  email: string;
  location: number;
  message: string;
}

export interface SendBulkNotificationRequest {
  emails: string[];
  location?: number;
  message: string;
  role?: string;
}

export interface SendNotificationResponse {
  message: string;
  sent_count: number;
  failed_count: number;
  total: number;
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
              ...result.recent_notifications.map(({ id }) => ({
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
    sendBulkNotification: builder.mutation<
      SendNotificationResponse,
      SendBulkNotificationRequest
    >({
      query: (bulkNotificationData) => ({
        url: "/admin/notifications/",
        method: "POST",
        body: bulkNotificationData,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useSendNotificationMutation,
  useSendBulkNotificationMutation,
} = notificationApi;
