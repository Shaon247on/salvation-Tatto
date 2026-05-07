"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Award, Target, Clock, Users, Calendar, Loader2 } from "lucide-react";
import { useGetPerformanceRankingsQuery } from "@/redux/services/admin/performance/performanceApi";
import { TopPerformer } from "./TopPerformer";
import { EmployeeRankings } from "./EmployeeRankings";

export default function PerformanceAdmin() {
  const [timeframe, setTimeframe] = useState<
    "weekly" | "monthly" | "today" | "yearly"
  >("weekly");

  const { data, isLoading, error } = useGetPerformanceRankingsQuery({
    period: timeframe,
  });

  const kpis = data
    ? [
        {
          title: "Avg Completion Rate",
          value: `${data.stats.avg_completion_rate}%`,
          icon: Target,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          title: "Avg Attendance Rate",
          value: `${data.stats.avg_attendance_rate ?? 0}%`,
          icon: Clock,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          title: "Total Tasks Completed",
          value: `${data.stats.total_tasks_completed}`,
          icon: Award,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
        {
          title: "Active Employees",
          value: `${data.stats.active_employees}`,
          icon: Users,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        },
      ]
    : [];

  const topPerformerData = data
    ? {
        name: data.top_performer?.name,
        initials: data.top_performer?.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        score: data.top_performer?.performance_score,
        tasks: data.top_performer?.tasks_completed,
        attendance: data.top_performer?.attendance ?? 0,
        completion: data.top_performer?.completion_rate,
      }
    : null;

  const rankingsData = data
    ? data.rankings.results.map((emp, index) => ({
        rank: emp.rank,
        name: emp.name || "Unknown Employee", // Handle empty name
        initials: (emp.name || "??")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        email: emp.email || "No Email Provided",
        tasks: emp.tasks_completed ?? 0, // Handle empty tasks
        overdue: emp.overdue ? `${emp.overdue}%` : "0%", // Formatting as percentage
        attendance: emp.attendance ?? 0,
        completion: emp.completion_rate ?? 0,
        status:
          emp.status === "Top Performer"
            ? "Good"
            : emp.status === "At Risk"
              ? "Alert"
              : "Monitor",
        avatarColor: [
          "bg-teal-600",
          "bg-red-600",
          "bg-blue-600",
          "bg-purple-600",
          "bg-emerald-600",
          "bg-indigo-600",
          "bg-amber-600",
          "bg-pink-600",
        ][index % 8],
      }))
    : [];

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-500">
        Failed to load performance data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      {/* 1. Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* <h1 className="text-3xl font-bold tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest italic">
            Salvation Tattoo Lounge · Admin Panel
          </p> */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Employee Performance</h2>
            <p className="text-gray-500 text-xs">
              Track productivity and identify top performers
            </p>
          </div>
        </div>

        {/* Weekly/Monthly Toggle */}
        <div className="bg-[#0A0A0A] border border-[#968B79]/60 p-1 rounded-xl flex gap-1 h-fit">
          {(["today", "weekly", "monthly", "yearly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                timeframe === t
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-500 hover:text-gray-300",
              )}
            >
              <Calendar size={14} /> {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((stat, i) => (
          <div
            key={i}
            className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-6",
                stat.bg,
              )}
            >
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <h2 className="text-3xl font-bold mb-1">{stat.value}</h2>
            <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Top Performer Spotlight */}
      {topPerformerData && <TopPerformer data={topPerformerData} />}

      {/* 4. Employee Rankings Table */}
      <EmployeeRankings rankings={rankingsData} />
    </div>
  );
}
