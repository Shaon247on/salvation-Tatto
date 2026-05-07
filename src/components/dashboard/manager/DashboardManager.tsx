"use client";

import { MapPin, ClipboardCheck, Users, AlertTriangle } from "lucide-react";
import StatCard from "./StatCard";
import LocationPerformanceCard from "./LocationPerformanceCard";
import AttendanceTable from "./AttendanceTable";
import TaskActivityChart from "./TaskActivityChart";
import { useGetDistrictDashboardQuery, useGetDistrictManagerTaskLogsQuery } from "@/redux/services/districtManager/districtManagerDashboard";
import TaskLogTable from "./TaskLogTable";

export default function DashboardManager() {
  const { data, isLoading } = useGetDistrictDashboardQuery();
  const { data: taskLogs } = useGetDistrictManagerTaskLogsQuery();

  if (isLoading) return <div className="p-6 text-white">Loading Dashboard...</div>;
  if (!data) return null;

  const stats = [
    {
      title: "Active Locations",
      value: data.stats.active_locations.toString(),
      description: "All locations operational",
      icon: MapPin,
      iconBgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Task Completion",
      value: `${data.stats.task_completion}%`,
      description: data.stats.task_completion_detail,
      icon: ClipboardCheck,
      iconBgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      title: "Avg Attendance",
      value: `${data.stats.avg_attendance}%`,
      description: data.stats.avg_attendance_label,
      icon: Users,
      iconBgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Overdue Tasks",
      value: data.stats.overdue_tasks.toString(),
      description: "Requires attention",
      icon: AlertTriangle,
      iconBgColor: "bg-red-500/10",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{data.greeting}</h1>
        <p className="text-sm text-muted-foreground">{data.date_display}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="pt-6">
        <h2 className="text-white text-xl font-bold mb-6">Location Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.location_performance.map((loc) => (
            <LocationPerformanceCard 
              key={loc.location_id}
              name={loc.location_name}
              location={loc.city_state}
              status={loc.status === "active" ? "Active" : "Inactive"}
              taskCompletion={loc.task_completion}
              attendance={loc.attendance_rate}
              staffCount={loc.staff_count}
              overdueCount={loc.overdue_count}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <TaskActivityChart data={data.weekly_task_activity} />
        <AttendanceTable data={data.attendance_summary} />
      </div>
      <TaskLogTable data={taskLogs?.task_log || []} />
    </div>
  );
}