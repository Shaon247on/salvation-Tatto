"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  LayoutDashboard,
  Users as UsersIcon,
  CheckSquare,
  TrendingUp,
  FileText,
} from "lucide-react";

import TopPerformers from "./TopPerformers";
import AttendanceComparison from "./AttendanceComparison";
import LocationSummaryTable from "./LocationSummaryTable";
import EmployeePerformanceTable from "./EmployeePerformanceTable";
import OnTimeRateChart from "./OnTimeRateChart";

import {
  useGetOverviewReportForDistrictManagerQuery,
  useGetEmployeePerformanceReportForDistrictManagerQuery,
} from "@/redux/services/districtManager/districtManagerReportApi";

import { useGetLocationsByDistrictManagerQuery } from "@/redux/services/districtManager/distictManagerTaskApi";

export default function ReportsManager() {
  const [activeTab, setActiveTab] = useState<"overview" | "employee">("overview");
  const [timeRange, setTimeRange] = useState("Week");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  // ✅ Map UI → API
  const period = useMemo(() => {
    if (timeRange === "Week") return "weekly";
    if (timeRange === "Month") return "monthly";
    return "yearly";
  }, [timeRange]);

  // ✅ API Calls
  const { data: overviewData, isLoading: overviewLoading } =
    useGetOverviewReportForDistrictManagerQuery(period, {
      skip: activeTab !== "overview",
    });

  const { data: employeeDataApi, isLoading: employeeLoading } =
    useGetEmployeePerformanceReportForDistrictManagerQuery(
      {
        period,
        location: selectedLocation || undefined,
      },
      { skip: activeTab !== "employee" },
    );

  const { data: locationsData } = useGetLocationsByDistrictManagerQuery();

  // ✅ Safe Mapping (NO CRASH)
  const comparisonData =
    overviewData?.location_chart?.map((item) => ({
      name: item.location,
      completion: item.completion,
      attendance: item.attendance,
    })) || [];

  const summaryData =
    overviewData?.location_summary?.map((item) => ({
      name: item.location_name,
      staff: item.staff_count,
      tasksDone: item.tasks_display,
      completion: item.completion_rate,
      attendance: item.attendance_rate,
      overdue: item.overdue_count,
    })) || [];


  // ✅ Loading Guards
  if (activeTab === "overview" && overviewLoading) {
    return <div className="text-center text-gray-500 py-10">Loading overview...</div>;
  }

  if (activeTab === "employee" && employeeLoading) {
    return <div className="text-center text-gray-500 py-10">Loading employees...</div>;
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports</h1>
          <p className="text-gray-500 text-sm">
            District performance reports and analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter */}
          <div className="bg-[#0A0A0A] border border-[#968B79]/60 p-1 rounded-xl flex gap-1">
            {["Week", "Month", "Quarter"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold",
                  timeRange === t
                    ? "bg-white text-black"
                    : "text-gray-500",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ✅ Location Filter ONLY for Employee Tab */}
          {activeTab === "employee" && (
            <select
              onChange={(e) =>
                setSelectedLocation(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className="bg-[#0A0A0A] border border-[#968B79]/60 px-4 py-2 rounded-xl text-xs text-white"
            >
              <option value="">All Locations</option>
              {(locationsData?.locations || []).map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 p-1 rounded-2xl flex gap-1 w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-6 py-2 text-xs font-bold rounded-xl flex gap-2",
            activeTab === "overview" ? "bg-white text-black" : "text-gray-500",
          )}
        >
          <LayoutDashboard size={16} /> Overview
        </button>

        <button
          onClick={() => setActiveTab("employee")}
          className={cn(
            "px-6 py-2 text-xs font-bold rounded-xl flex gap-2",
            activeTab === "employee" ? "bg-white text-black" : "text-gray-500",
          )}
        >
          <UsersIcon size={16} /> Employee
        </button>
      </div>

      {/* Content */}
      {activeTab === "overview" ? (
        <OverviewSection
          stats={overviewData?.stats}
          comparisonData={comparisonData}
          summaryData={summaryData}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPerformers 
            performers={employeeDataApi?.top_performers || []}
            />
            <OnTimeRateChart data={ employeeDataApi?.on_time_rate_chart || []} />
          </div>

          <EmployeePerformanceTable data={employeeDataApi?.employee_performance.results || []} />
        </div>
      )}
    </div>
  );
}

function OverviewSection({ stats, comparisonData, summaryData }: any) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportStatCard title={`${stats?.task_completion_rate || 0}%`} subtitle="Task Completion" />
        <ReportStatCard title={`${stats?.avg_attendance_rate || 0}%`} subtitle="Avg Attendance" />
        <ReportStatCard title={stats?.overdue_tasks || 0} subtitle="Overdue Task" />
        <ReportStatCard title={stats?.late_arrivals || 0} subtitle="Late Arrival" />
      </div>

      {/* ✅ FULL WIDTH CHART */}
      <AttendanceComparison data={comparisonData || []} />

      <LocationSummaryTable data={summaryData || []} />
    </div>
  );
}

function ReportStatCard({ title, subtitle }: {title: string; subtitle: string}) {
  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}