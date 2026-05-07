// "use client";

// import { Mail, CheckCircle, MapPin } from "lucide-react";
// import { NotificationStats } from "./NotificationStats";
// import { SendNotificationForm } from "./SendNotification";
// import { NotificationFeed } from "./NotificationFeed";

// export default function NotificationsAdmin() {
//   // --- DUMMY DATA ---
//   const stats = [
//     {
//       label: "Total Sent",
//       value: "2",
//       icon: Mail,
//       color: "text-blue-500",
//       bg: "bg-blue-500/10",
//     },
//     {
//       label: "Delivered",
//       value: "2",
//       icon: CheckCircle,
//       color: "text-emerald-500",
//       bg: "bg-emerald-500/10",
//     },
//     {
//       label: "Active Locations",
//       value: "3",
//       icon: MapPin,
//       color: "text-amber-500",
//       bg: "bg-amber-500/10",
//     },
//   ];

//   const notificationHistory = [
//     {
//       recipient: "team@inkempire.com",
//       message: "Reminder: Monthly team meeting scheduled for Friday at 3 PM.",
//       branch: "Ink Empire — Midtown",
//       date: "Feb 28",
//       status: "Sent",
//     },
//     {
//       recipient: "akim@inkempire.com",
//       message: "Please review the new safety protocols before your next shift.",
//       branch: "Ink Empire — Downtown",
//       date: "Mar 1",
//       status: "Sent",
//     },
//   ];

//   return (
//     <div className="space-y-8 p-4 bg-black min-h-screen text-white">
//       {/* Header */}
//       {/* <div>
//         <h1 className="text-3xl font-bold tracking-tight">
//           Notification Center
//         </h1>
//         <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest">
//           Salvation Tattoo Lounge · Super Admin Panel
//         </p>
//       </div> */}

//       {/* 1. Stats Grid */}
//       <NotificationStats stats={stats} />

//       {/* 2. Main Content Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
//         <SendNotificationForm />
//         <NotificationFeed history={notificationHistory} />
//       </div>
//     </div>
//   );
// }

"use client";

import { Mail, CheckCircle, MapPin } from "lucide-react";
import { NotificationStats } from "./NotificationStats";
import { SendNotificationForm } from "./SendNotification";
import { NotificationFeed } from "./NotificationFeed";
import { useGetNotificationsQuery } from "@/redux/services/admin/notification/notificationsApi";

// Adjust path as needed

export default function NotificationsAdmin() {
  const { data, isLoading, isError } = useGetNotificationsQuery();

  if (isLoading)
    return <div className="p-8 text-white">Loading notifications...</div>;
  if (isError)
    return <div className="p-8 text-red-500">Error loading data.</div>;

  // Map API stats to your UI stat cards
  const stats = [
    {
      label: "Total Sent",
      value: data?.stats.total_sent.toString() || "0",
      icon: Mail,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Delivered",
      value: data?.stats.delivered.toString() || "0",
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Active Locations",
      value: data?.stats.active_locations.toString() || "0",
      icon: MapPin,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  // Map API notification items to Feed items
  const notificationHistory =
    data?.recent_notifications.map((item) => ({
      recipient: item.email,
      message: item.message,
      branch: item.location_name,
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      status: item.status,
    })) || [];

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      <NotificationStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-[calc(100vh-250px)]">
        <SendNotificationForm />
        <NotificationFeed history={notificationHistory} />
      </div>
    </div>
  );
}
