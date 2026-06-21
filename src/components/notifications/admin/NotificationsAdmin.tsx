"use client";

import { SendNotificationForm } from "./SendNotification";
import { NotificationFeed } from "./NotificationFeed";
import {
  useGetNotificationsQuery,
  useGetSentNotificationQuery,
} from "@/redux/services/admin/notification/notificationsApi";

export default function NotificationsAdmin() {
  const { data, isLoading } = useGetNotificationsQuery();
  const { data: sentNotification, isLoading: sentLoading } =
    useGetSentNotificationQuery();

  // -----------------------------
  // RECEIVED NOTIFICATIONS
  // -----------------------------
  const notificationHistory =
    data?.received?.map((item) => ({
      id: item.id,
      recipients: item.recipients,
      message: item.message,
      image: item.image,
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    })) || [];

  // -----------------------------
  // SENT NOTIFICATIONS
  // -----------------------------
  const notificationSentHistory =
    sentNotification?.map((item) => ({
      id: item.id,
      recipients: item.recipients,
      message: item.message,
      image: item.image,
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    })) || [];

  return (
    <div className="space-y-6 p-4 md:p-6 text-white min-h-screen">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start ">
        <div className="h-full">
          <SendNotificationForm />
        </div>

        <div className="h-full">
          {isLoading ? (
            <div className="p-6 text-gray-400">Loading notifications...</div>
          ) : (
            <NotificationFeed
              history={notificationHistory}
              title="Received Notifications"
              subTitle="Inbox activity"
            />
          )}
        </div>
      </div>

      {/* SENT FEED */}
      <div className="w-full">
        {sentLoading ? (
          <div className="p-6 text-gray-400">
            Loading sent notifications...
          </div>
        ) : (
          <NotificationFeed
            history={notificationSentHistory}
            title="Sent Notifications"
            subTitle="Outbound activity"
          />
        )}
      </div>
    </div>
  );
}