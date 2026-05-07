// "use client";

// import {
//   ClipboardList,
//   MapPin,
//   UserCheck,
//   Users,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import AdminStatCard from "./AdminStatCard";
// import { AttendanceChart } from "./AttendanceChart";
// import { TaskStatus } from "./TaskStatus";
// import { ActivityFeed } from "./ActivityFeed";
// import { useGetDashboardOverviewQuery } from "@/redux/services/admin/dashboard/adminDashboardApi";
// import EmployeeBreakdown from "./EmployeeBreakdown";

// export default function AdminDashboard() {
//   const { data, isLoading, isError } = useGetDashboardOverviewQuery();

//   if (isLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-black">
//         <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
//       </div>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <div className="flex flex-col h-screen w-full items-center justify-center bg-black text-red-500">
//         <AlertCircle className="w-12 h-12 mb-4" />
//         <p>Failed to load dashboard data.</p>
//       </div>
//     );
//   }

//   const adminStats = [
//     {
//       title: "Total Employees",
//       value: data.stats.total_employees,
//       icon: Users,
//       iconColor: "text-indigo-400",
//       bgColor: "bg-indigo-500/10",
//     },
//     {
//       title: "Total Locations",
//       value: data.stats.total_locations,
//       icon: MapPin,
//       iconColor: "text-blue-400",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Pending Tasks",
//       value: data.stats.pending_tasks,
//       icon: ClipboardList,
//       iconColor: "text-amber-400",
//       bgColor: "bg-amber-500/10",
//     },
//     {
//       title: "Today's Attendance",
//       value: data.stats.today_attendance, // Note: your API returns 0 in the example
//       icon: UserCheck,
//       iconColor: "text-emerald-400",
//       bgColor: "bg-emerald-500/10",
//     },
//   ];

//   return (
//     <div className="space-y-6 p-8 bg-black min-h-screen">
//       {/* 1. Metric Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {adminStats.map((stat, index) => (
//           <AdminStatCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* 2. Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <AttendanceChart data={data.attendance_overview} />
//         </div>
//         <div className="lg:col-span-1">
//           <TaskStatus
//             summary={data.task_status}
//             locationData={data.task_by_location}
//           />
//         </div>
//       </div>
//       <EmployeeBreakdown></EmployeeBreakdown>

//       {/* 3. Feed Row */}
//       <ActivityFeed activities={data.recent_activity} />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  ClipboardList,
  MapPin,
  UserCheck,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminStatCard from "./AdminStatCard";
import { AttendanceChart } from "./AttendanceChart";
import { TaskStatus } from "./TaskStatus";
import { ActivityFeed } from "./ActivityFeed";

import EmployeeBreakdown from "./EmployeeBreakdown";
import { useGetDashboardOverviewQuery } from "@/redux/services/admin/dashboard/adminDashboardApi";

export default function AdminDashboard() {
  const [location, setLocation] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useGetDashboardOverviewQuery({
    location,
    page,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-black text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  const adminStats = [
    {
      title: "Total Employees",
      value: data.stats.total_employees,
      icon: Users,
      iconColor: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Total Locations",
      value: data.stats.total_locations,
      icon: MapPin,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pending Tasks",
      value: data.stats.pending_tasks,
      icon: ClipboardList,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Today's Attendance",
      value: data.stats.today_attendance,
      icon: UserCheck,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-8 bg-black min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
          <AdminStatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart data={data.attendance_overview} />
        </div>
        <div className="lg:col-span-1">
          <TaskStatus
            summary={data.task_status}
            locationData={data.task_by_location}
          />
        </div>
      </div>

      <EmployeeBreakdown
        breakdown={data.employee_breakdown}
        locations={data.task_by_location}
        selectedLocation={location}
        onLocationChange={(val) => {
          setLocation(val);
          setPage(1);
        }}
        currentPage={page}
        onPageChange={setPage}
      />

      <ActivityFeed activities={data.recent_activity} />
    </div>
  );
}
