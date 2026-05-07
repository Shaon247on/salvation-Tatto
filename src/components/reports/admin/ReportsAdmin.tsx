// "use client";

// import React from "react";
// import { cn } from "@/lib/utils";
// import { Users, CheckSquare, Clock } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";
// import { ReportFilters } from "./ReportFilters";
// import { PerformanceComparison } from "./PerformanceComparison";
// import { AttendanceLog } from "./AttendanceLog";

// export default function ReportsAdmin() {
//   // --- DUMMY DATA ---
//   const kpiStats = [
//     {
//       title: "Avg Attendance Rate",
//       value: "84%",
//       change: "+2.5%",
//       trend: "up",
//       icon: Users,
//       color: "text-emerald-500",
//       bgColor: "bg-emerald-500/10",
//     },
//     {
//       title: "Task Completion Rate",
//       value: "40%",
//       change: "-4.1%",
//       trend: "down",
//       icon: CheckSquare,
//       color: "text-blue-500",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Total Active Staff",
//       value: "11",
//       change: "0%",
//       trend: "up",
//       icon: Users,
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/10",
//     },
//     {
//       title: "Pending Tasks",
//       value: "6",
//       change: "+2",
//       trend: "up",
//       icon: Clock,
//       color: "text-amber-500",
//       bgColor: "bg-amber-500/10",
//     },
//   ];

//   const attendanceTrendData = [
//     { date: "Feb 19", present: 35, late: 12 },
//     { date: "Feb 20", present: 38, late: 15 },
//     { date: "Feb 21", present: 32, late: 10 },
//     { date: "Feb 22", present: 34, late: 14 },
//     { date: "Feb 23", present: 33, late: 12 },
//     { date: "Feb 24", present: 40, late: 16 },
//     { date: "Feb 25", present: 36, late: 11 },
//   ];

//   const taskCompletionData = [
//     { name: "Feb 3", approved: 8, completed: 12, pending: 6 },
//     { name: "Feb 10", approved: 14, completed: 18, pending: 4 },
//     { name: "Feb 17", approved: 10, completed: 15, pending: 8 },
//     { name: "Feb 24", approved: 16, completed: 22, pending: 5 },
//   ];

//   const locAttendance = [
//     {
//       name: "Downtown",
//       subValue: "8 staff",
//       percent: 91,
//       color: "bg-blue-500",
//     },
//     {
//       name: "Midtown",
//       subValue: "7 staff",
//       percent: 86,
//       color: "bg-amber-500",
//     },
//     {
//       name: "Wicker Park",
//       subValue: "6 staff",
//       percent: 82,
//       color: "bg-purple-600",
//     },
//   ];

//   const logData = [
//     {
//       date: "Mar 1, 2026 (Today)",
//       location: "All Locations",
//       present: 38,
//       absent: 6,
//       late: 3,
//       rate: 80.9,
//     },
//     {
//       date: "Feb 28, 2026",
//       location: "All Locations",
//       present: 42,
//       absent: 3,
//       late: 2,
//       rate: 89.4,
//     },
//     {
//       date: "Feb 27, 2026",
//       location: "All Locations",
//       present: 38,
//       absent: 6,
//       late: 3,
//       rate: 80.9,
//     },
//   ];

//   return (
//     <div className="space-y-8 p-4 bg-black min-h-screen text-white">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">
//           Reports & Analytics
//         </h1>
//         <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
//           Salvation Tattoo Lounge · Super Admin Panel
//         </p>
//       </div>

//       <ReportFilters />

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {kpiStats.map((stat, i) => (
//           <div
//             key={i}
//             className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-6"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
//                 <stat.icon className={cn("w-5 h-5", stat.color)} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold mb-1">{stat.value}</h2>
//             <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
//               {stat.title}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Main Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Attendance Trend */}
//         <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-6 h-100">
//           <h3 className="font-bold mb-1">Attendance Trend</h3>
//           <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-8">
//             Today attendance across all locations
//           </p>
//           <ResponsiveContainer width="100%" height="70%">
//             <AreaChart data={attendanceTrendData}>
//               <CartesianGrid
//                 vertical={false}
//                 stroke="#1A1A1A"
//                 strokeDasharray="3 3"
//               />
//               <XAxis
//                 dataKey="date"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#4B5563", fontSize: 10 }}
//                 dy={10}
//               />
//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#4B5563", fontSize: 10 }}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#0D0D0D",
//                   border: "1px solid #262626",
//                 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="present"
//                 stroke="#ef4444"
//                 fill="transparent"
//                 strokeWidth={2}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="late"
//                 stroke="#f59e0b"
//                 fill="transparent"
//                 strokeWidth={2}
//                 strokeDasharray="5 5"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Weekly Task Completion */}
//         <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-6 h-100">
//           <h3 className="font-bold mb-1">Weekly Task Completion</h3>
//           <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-8">
//             Tasks by status per week
//           </p>
//           <ResponsiveContainer width="100%" height="70%">
//             <BarChart data={taskCompletionData}>
//               <CartesianGrid
//                 vertical={false}
//                 stroke="#1A1A1A"
//                 strokeDasharray="3 3"
//               />
//               <XAxis
//                 dataKey="name"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#4B5563", fontSize: 10 }}
//                 dy={10}
//               />
//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#4B5563", fontSize: 10 }}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#0D0D0D",
//                   border: "1px solid #262626",
//                 }}
//               />
//               <Bar
//                 dataKey="approved"
//                 fill="#10b981"
//                 radius={[4, 4, 0, 0]}
//                 barSize={12}
//               />
//               <Bar
//                 dataKey="completed"
//                 fill="#3b82f6"
//                 radius={[4, 4, 0, 0]}
//                 barSize={12}
//               />
//               <Bar
//                 dataKey="pending"
//                 fill="#f59e0b"
//                 radius={[4, 4, 0, 0]}
//                 barSize={12}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Progress Bars Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <PerformanceComparison
//           title="Attendance by Location"
//           data={locAttendance}
//           type="attendance"
//         />
//         <PerformanceComparison
//           title="Task Completion by Location"
//           data={locAttendance}
//           type="task"
//         />
//       </div>

//       {/* Log Table */}
//       <AttendanceLog data={logData} />
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  CheckSquare,
  Clock,
  AlertCircle,
  Loader2,
  GitCommitHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { ReportFilters } from "./ReportFilters";
import { PerformanceComparison } from "./PerformanceComparison";

import { useGetAdminReportsQuery } from "@/redux/services/admin/report/adminReportApi";

export default function ReportsAdmin() {
  const [period, setPeriod] = useState<
    "today" | "weekly" | "monthly" | "yearly"
  >("weekly");

  // Fetch real data
  const { data, isLoading, isError } = useGetAdminReportsQuery({
    period,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-black text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>Failed to load reports. Please try again later.</p>
      </div>
    );
  }

  // Map API stats to KPI Cards
  const kpiStats = [
    {
      title: "Avg Attendance Rate",
      value: `${data?.stats.avg_attendance_rate}%`,
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Task Completion Rate",
      value: `${data?.stats.task_completion_rate}%`,
      icon: CheckSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Active Staff",
      value: data?.stats.total_active_staff.toString(),
      icon: Users,
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
    },
    {
      title: "Pending Tasks",
      value: data?.stats.pending_tasks.toString(),
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
          Salvation Tattoo Lounge · Super Admin Panel
        </p>
      </div> */}

      <ReportFilters currentPeriod={period} setPeriod={setPeriod} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1">{stat.value}</h2>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6 h-100">
          <h3 className="font-bold mb-1">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height="70%">
            <AreaChart data={data?.attendance_trend}>
              <CartesianGrid
                vertical={false}
                stroke="#1A1A1A"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4B5563", fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4B5563", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0D0D",
                  border: "1px solid #262626",
                }}
              />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#ef4444"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="late"
                stroke="#f59e0b"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <span className="flex items-center gap-2 text-[10px] text-[#d4af37] uppercase font-bold">
              <GitCommitHorizontal className="" />
              Present
            </span>
            <span className="flex items-center gap-2 text-[10px] text-[#ef4444] uppercase font-bold">
              <GitCommitHorizontal className="" /> Absent
            </span>
            <span className="flex items-center gap-2 text-[10px] text-[#f59e0b] uppercase font-bold">
              <GitCommitHorizontal className="" /> Late
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6 h-100 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-white">Weekly Task Completion</h3>
            <p className="text-gray-500 text-xs mt-1">
              Tasks by status per week
            </p>
          </div>

          <ResponsiveContainer width="100%" height="70%">
            <BarChart data={data?.weekly_task_completion}>
              <CartesianGrid
                vertical={false}
                stroke="#1A1A1A"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4B5563", fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4B5563", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0D0D",
                  border: "1px solid #262626",
                  borderRadius: "12px",
                }}
              />
              <Bar
                dataKey="approved"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Bar
                dataKey="completed"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Bar
                dataKey="pending"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Updated Labels for Task Completion */}
          <div className="flex justify-center gap-6 mt-4">
            <span className="flex items-center gap-2 text-[10px] text-[#10b981] uppercase font-bold">
              <div className="w-2 h-2  bg-[#10b981]" />
              Approved
            </span>
            <span className="flex items-center gap-2 text-[10px] text-[#3b82f6] uppercase font-bold">
              <div className="w-2 h-2  bg-[#3b82f6]" />
              Completed
            </span>
            <span className="flex items-center gap-2 text-[10px] text-[#f59e0b] uppercase font-bold">
              <div className="w-2 h-2  bg-[#f59e0b]" />
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceComparison
          title="Attendance by Location"
          data={data?.attendance_by_location || []}
          type="attendance"
        />
        <PerformanceComparison
          title="Task Completion by Location"
          data={data?.task_completion_by_location || []}
          type="task"
        />
      </div>

      {/* Log Table
      <AttendanceLog data={data?.attendance_log || []} /> */}
    </div>
  );
}
