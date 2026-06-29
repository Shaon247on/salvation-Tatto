"use client";

import { ReceivedNotificationFeed } from "./ReceivedNotificationFeed";
import { SendNotificationForm } from "./SendNotification";
import {
  useGetNotificationsQuery,
  useGetSentNotificationQuery,
} from "@/redux/services/admin/notification/notificationsApi";
import { SentNotificationFeed } from "./SentNotificationFeed";

export default function NotificationsAdmin() {
  const { data, isLoading } = useGetNotificationsQuery();
  const { data: sentData, isLoading: sentLoading } = useGetSentNotificationQuery();

  return (
    <div className="space-y-6 p-4 md:p-6 text-white min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <SendNotificationForm />
        {isLoading ? (
          <LoadingCard text="Loading received notifications..." />
        ) : (
          <ReceivedNotificationFeed notifications={data?.received ?? []} />
        )}
      </div>

      {sentLoading ? (
        <LoadingCard text="Loading sent notifications..." />
      ) : (
        <SentNotificationFeed notifications={sentData ?? []} />
      )}
    </div>
  );
}

function LoadingCard({ text }: { text: string }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/40 rounded-3xl p-10 flex items-center justify-center text-gray-500 text-sm">
      {text}
    </div>
  );
}