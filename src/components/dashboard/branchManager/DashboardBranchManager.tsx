"use client";

import { Calendar, Users, ClipboardCheck } from "lucide-react";
import StatCard from "./StatCard";
import { StaffList, TaskActivity } from "./DashboardLists";
import { useAppSelector } from "@/redux/store";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetBranchManagerDashboardQuery } from "@/redux/services/branchManager/dashboard/branchManagerDashboardApi";

export default function DashboardBranchManager() {
  const user = useAppSelector(selectCurrentUser);

  const { data, isLoading, error } =
    useGetBranchManagerDashboardQuery();

  if (isLoading) return <div className="p-6 text-white">Loading...</div>;
  if (error || !data)
    return <div className="p-6 text-red-500">Failed to load dashboard</div>;

  const { stats, today_staff, recent_tasks } = data;

  // --- Stats Mapping ---
  const attendance = stats.today_attendance;

  const total = attendance.total || 1;

  const statsData = [
    {
      title: "Total Employees",
      value: stats.total_employees,
      subtitle: "At this location",
      icon: Users,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
    },
    {
      title: "Pending Verifications",
      value: stats.pending_verifications,
      subtitle: "Awaiting review",
      icon: ClipboardCheck,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Today's Attendance",
      value: attendance.total,
      subtitle: `${attendance.present} present · ${attendance.late} late · ${attendance.absent} absent`,
      icon: Calendar,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      progressData: [
        {
          color: "bg-emerald-500",
          percent: (attendance.present / total) * 100,
        },
        {
          color: "bg-amber-500",
          percent: (attendance.late / total) * 100,
        },
        {
          color: "bg-red-500",
          percent: (attendance.absent / total) * 100,
        },
      ],
    },
  ];

  // --- Staff Mapping ---
  const todayStaff = today_staff.map((s) => ({
    initials: s.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    name: s.name,
    role: s.role,
    status:
      s.status === "present"
        ? "Present"
        : s.status === "late"
        ? "Late"
        : "Absent",
    time: s.late_minutes ? `${s.late_minutes} min` : undefined,
  }));

  // --- Tasks Mapping ---
  const recentTasks = recent_tasks.map((t) => ({
    title: t.title,
    assignee: t.assigned_to,
    due: t.due_date,
    status: t.status_display,
  }));

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {data.greeting}
          </h1>
          <p className="text-gray-500 text-sm">
            {data.date_display} — {data.location_name}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Lists */}
      <div className="flex flex-col lg:flex-row gap-6">
        <StaffList staff={todayStaff} />
        <TaskActivity tasks={recentTasks} />
      </div>
    </div>
  );
}