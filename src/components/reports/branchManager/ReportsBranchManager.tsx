"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import PerformanceSummaryCard from "./SummaryCards";
import EmployeeBreakdown from "./EmployeeBreakdown";
import TaskLog from "./TaskLog";

import type {
  ReportPeriod,
  ReportStatus,
} from "@/types/branchManager/report";
import { useGetBranchManagerReportQuery } from "@/redux/services/branchManager/reports/branchManagerReportApi";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_RANGES: ReportPeriod[] = ["today", "weekly", "monthly", "yearly"];

const TASK_STATUSES: Array<"All Status" | ReportStatus> = [
  "All Status",
  "approved",
  "pending",
  "overdue",
  "rejected",
];

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  today: "Today",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportsBranchManager() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [taskStatus, setTaskStatus] = useState<"All Status" | ReportStatus>(
    "All Status",
  );

  // Debounce search input so we don't fire on every keystroke
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout((handleSearchChange as { _t?: ReturnType<typeof setTimeout> })._t);
    const timer = setTimeout(() => setDebouncedSearch(val), 400);
    (handleSearchChange as { _t?: ReturnType<typeof setTimeout> })._t = timer;
  };

  // ─── API Call ──────────────────────────────────────────────────────────────

  const queryParams = useMemo(
    () => ({
      period,
      ...(taskStatus !== "All Status" && { status: taskStatus }),
      ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    }),
    [period, taskStatus, debouncedSearch],
  );

  const { data, isLoading, isError, isFetching } =
    useGetBranchManagerReportQuery(queryParams);

  // ─── Derived: Summary Cards ────────────────────────────────────────────────

  const summaryStats = useMemo(() => {
    if (!data) return [];

    return [
      {
        label: "Completed",
        value: data.stats.completed,
        subtitle: "Approved tasks",
        type: "completed" as const,
      },
      {
        label: "Overdue",
        value: data.stats.overdue,
        subtitle: "Past due date",
        type: "overdue" as const,
      },
      {
        label: "In Progress",
        value: data.stats.in_progress,
        subtitle: "Active tasks",
        type: "in-progress" as const,
      },
      {
        label: "Avg. Attendance",
        value: `${data.stats.avg_attendance}%`,
        subtitle: `Based on ${PERIOD_LABELS[period]}`,
        type: "attendance" as const,
      },
    ];
  }, [data, period]);

  // ─── Render States ─────────────────────────────────────────────────────────

  const isLoadingOrFetching = isLoading || isFetching;

  return (
    <div className="space-y-8 p-6 bg-black min-h-screen text-white font-sans">
      {/* 1. Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Performance
          </h1>
          <p className="text-gray-500 text-sm italic">
            Salvation Tattoo Lounge · Branch Manager
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              className="w-full bg-[#0A0A0A] border border-[#968B79]/40 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#968B79] transition-all"
              placeholder="Filter by employee name..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Period Toggle */}
          <div className="bg-[#0A0A0A] border border-[#968B79]/60 p-1 rounded-xl flex gap-1 h-fit">
            {TIME_RANGES.map((t) => (
              <button
                key={t}
                onClick={() => setPeriod(t)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all capitalize",
                  period === t
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                {PERIOD_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex justify-end">
            <div className="bg-[#0A0A0A] border border-[#968B79]/60 p-1 rounded-xl flex gap-1 flex-wrap max-w-2xl">
              {TASK_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => setTaskStatus(status)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap capitalize",
                    taskStatus === status
                      ? "bg-white text-black shadow-lg"
                      : "text-gray-500 hover:text-gray-300",
                  )}
                >
                  {status === "All Status" ? "All Status" : status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading / Error States */}
      {isError && (
        <div className="flex items-center justify-center h-32 text-red-500 text-sm">
          Failed to load report data. Please try again.
        </div>
      )}

      {isLoadingOrFetching && !data && (
        <div className="flex items-center justify-center h-32 gap-3 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading report...
        </div>
      )}

      {/* Content — only renders once we have data */}
      {data && (
        <>
          {/* Subtle fetching overlay indicator */}
          {isFetching && (
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Refreshing...
            </div>
          )}

          {/* 2. Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryStats.map((stat, i) => (
              <PerformanceSummaryCard key={i} {...stat} />
            ))}
          </div>

          {/* 3. Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Completion Bar Chart */}
            <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6 h-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Task Completion
                  </h3>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                    Completed vs Overdue
                  </p>
                </div>
                <div className="flex gap-4 text-[9px] font-bold uppercase">
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#6366F1]" />{" "}
                    Completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#991B1B]" />{" "}
                    Overdue
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={data.task_completion_chart}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1A1A1A"
                  />
                  <XAxis
                    dataKey="employee"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4B5563", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4B5563", fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    contentStyle={{
                      backgroundColor: "#0D0D0D",
                      border: "1px solid #262626",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="overdue"
                    name="Overdue"
                    fill="#991B1B"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Rate Bar Chart */}
            <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6 h-100">
              <h3 className="font-bold text-white text-lg">
                Attendance Overview
              </h3>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1 mb-8">
                Efficiency Percentage
              </p>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={data.attendance_chart}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1A1A1A"
                  />
                  <XAxis
                    dataKey="employee"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4B5563", fontSize: 10 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4B5563", fontSize: 10 }}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    contentStyle={{
                      backgroundColor: "#0D0D0D",
                      border: "1px solid #262626",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="attendance_rate"
                    name="Attendance"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  >
                    {data.attendance_chart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.attendance_rate >= 90 ? "#8B5CF6" : "#4C1D95"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Employee Breakdown Table */}
          <EmployeeBreakdown data={data.employee_breakdown} />

          {/* 5. Task Log Table */}
          <TaskLog
            data={data.task_log}
            meta={data.task_log_meta}
          />
        </>
      )}
    </div>
  );
}