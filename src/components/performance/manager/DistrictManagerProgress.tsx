"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, ChevronLeft, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetLocationsByDistrictManagerQuery } from "@/redux/services/districtManager/distictManagerTaskApi";
import {
  useGetEmployeesAttendanceQuery,
  useGetEmployeeMonthlyAttendanceQuery,
} from "@/redux/services/districtManager/districtManagerProgressApi";

import {
  AttendanceEmployee,
  DailyAttendanceRecord,
  DayAttendanceStatus,
} from "@/types/districtManager/districtManagerProgress.type";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_CONFIG: Record<
  DayAttendanceStatus,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  present: {
    label: "Present",
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  late: {
    label: "Late",
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  absent: {
    label: "Absent",
    dot: "bg-red-500",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  weekday: {
    label: "Off",
    dot: "bg-gray-600",
    bg: "bg-transparent",
    text: "text-gray-600",
    border: "border-transparent",
  },
};

// ─── Helper: pad a 2-digit month ─────────────────────────────────────────────

function toMonthParam(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Mini summary pill */
function StatPill({
  count,
  type,
}: {
  count: number;
  type: "present" | "late" | "absent";
}) {
  const map = {
    present: { text: "text-emerald-400", label: "Present" },
    late: { text: "text-amber-400", label: "Late" },
    absent: { text: "text-red-400", label: "Absent" },
  };
  return (
    <div className="flex flex-col items-center">
      <span className={cn("text-lg font-bold", map[type].text)}>{count}</span>
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
        {map[type].label}
      </span>
    </div>
  );
}

/** Month card selector */
function MonthCard({
  month,
  index,
  isSelected,
  onClick,
}: {
  month: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border",
        isSelected
          ? "bg-[#968B79] text-black border-[#968B79]"
          : "bg-[#0A0A0A] text-gray-400 border-[#262626] hover:border-[#968B79]/50 hover:text-gray-200",
      )}
    >
      {month}
    </button>
  );
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Maps the API's weekday string to a 0-6 index (Sun=0 … Sat=6)
const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

/** Proper month calendar grid */
function MonthCalendar({ records }: { records: DailyAttendanceRecord[] }) {
  // Only work-day records (present / absent / late) + all records for layout
  const workDays = records.filter((r) => r.is_work_day);

  // Determine the first day's column offset from the full records list
  // The API returns every calendar day of the month, so record[0] is day 1
  const firstRecord = records[0];
  const startOffset = firstRecord ? (WEEKDAY_INDEX[firstRecord.weekday] ?? 0) : 0;

  // Build a 42-cell grid (6 weeks × 7 days); null = empty leading/trailing cell
  const cells: (DailyAttendanceRecord | null)[] = [
    ...Array(startOffset).fill(null),
    ...records,
  ];
  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="w-full">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-600 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#1A1A1A] mb-2" />

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((record, idx) => {
          if (!record) {
            return <div key={`empty-${idx}`} className="min-h-[60px]" />;
          }

          const cfg = STATUS_CONFIG[record.status];
          const isOff = record.status === "weekday";

          return (
            <div
              key={record.date}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border min-h-[60px] px-1 py-2 transition-all select-none",
                isOff
                  ? "border-[#1A1A1A] bg-transparent"
                  : cn(cfg.bg, cfg.border),
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  "text-xs font-bold leading-none",
                  isOff ? "text-gray-700" : cfg.text,
                )}
              >
                {record.day}
              </span>

              {/* Status indicator */}
              {!isOff && (
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5",
                    cfg.dot,
                  )}
                />
              )}

              {/* Status label — hidden on very small screens */}
              {!isOff && (
                <span
                  className={cn(
                    "hidden sm:block text-[8px] uppercase tracking-wider mt-1 font-semibold",
                    cfg.text,
                  )}
                >
                  {cfg.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Skeleton calendar loading state */
function CalendarSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center py-2">
            <div className="h-3 w-6 mx-auto bg-[#1A1A1A] rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="border-t border-[#1A1A1A] mb-2" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[60px] rounded-xl bg-[#1A1A1A] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

/** Expanded row content: year picker + month grid + calendar */
function ExpandedAttendance({ employee }: { employee: AttendanceEmployee }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  const monthParam = toMonthParam(year, selectedMonth);

  const { data, isLoading, isFetching } = useGetEmployeeMonthlyAttendanceQuery({
    employeeId: employee.id,
    month: monthParam,
  });

  const records = data?.records ?? [];
  const summary = data?.summary;

  return (
    <div className="px-4 pb-6 pt-4 border-t border-[#1A1A1A]">
      {/* Year picker */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="p-1.5 rounded-lg border border-[#262626] hover:bg-white/5 transition-colors text-gray-400"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-white font-bold text-sm tracking-wide min-w-[40px] text-center">
            {year}
          </span>
          <button
            onClick={() => setYear((y) => y + 1)}
            disabled={year >= currentYear}
            className="p-1.5 rounded-lg border border-[#262626] hover:bg-white/5 transition-colors text-gray-400 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Summary pills */}
        {summary && (
          <div className="flex items-center gap-6 pr-2">
            <StatPill count={summary.present} type="present" />
            <StatPill count={summary.late} type="late" />
            <StatPill count={summary.absent} type="absent" />
          </div>
        )}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 mb-5">
        {MONTHS.map((m, i) => (
          <MonthCard
            key={m}
            month={m}
            index={i}
            isSelected={selectedMonth === i}
            onClick={() => setSelectedMonth(i)}
          />
        ))}
      </div>

      {/* Month label */}
      <p className="text-gray-500 text-xs mb-3">
        {MONTH_NAMES[selectedMonth]} {year}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {(["present", "late", "absent"] as DayAttendanceStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", STATUS_CONFIG[s].dot)} />
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">
              {STATUS_CONFIG[s].label}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-600 opacity-30" />
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            Day Off
          </span>
        </div>
      </div>

      {/* Calendar grid */}
      {isLoading || isFetching ? (
        <CalendarSkeleton />
      ) : records.length === 0 ? (
        <div className="flex items-center justify-center h-24 text-gray-600 text-sm">
          No attendance data available for this period.
        </div>
      ) : (
        <MonthCalendar records={records} />
      )}
    </div>
  );
}

/** Single expandable table row */
function EmployeeRow({ employee }: { employee: AttendanceEmployee }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className={cn(
          "cursor-pointer transition-colors border-[#1A1A1A] hover:bg-white/5",
          expanded && "bg-white/5",
        )}
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Employee */}
        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E1B2E] flex items-center justify-center text-[11px] font-bold text-[#9171F8] shrink-0">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="text-gray-200 text-xs font-bold leading-tight">
                {employee.name}
              </p>
              <p className="text-gray-500 text-[10px] mt-0.5">{employee.role}</p>
            </div>
          </div>
        </TableCell>

        {/* Location */}
        <TableCell className="px-6 py-4">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <MapPin size={11} className="text-gray-600" />
            {employee.location_name}
          </div>
        </TableCell>

        {/* Present */}
        <TableCell className="px-6 py-4 text-center">
          <span className="text-emerald-500 font-bold text-sm">
            {employee.present}
          </span>
        </TableCell>

        {/* Late */}
        <TableCell className="px-6 py-4 text-center">
          <span className="text-amber-500 font-bold text-sm">
            {employee.late}
          </span>
        </TableCell>

        {/* Absent */}
        <TableCell className="px-6 py-4 text-center">
          <span className="text-red-500 font-bold text-sm">
            {employee.absent}
          </span>
        </TableCell>

        {/* Expand toggle */}
        <TableCell className="px-6 py-4 text-right">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold transition-colors",
              expanded ? "text-[#968B79]" : "text-gray-600",
            )}
          >
            {expanded ? "Collapse" : "Details"}
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded content row */}
      {expanded && (
        <TableRow className="border-[#1A1A1A] hover:bg-transparent bg-[#060606]">
          <TableCell colSpan={6} className="p-0">
            <ExpandedAttendance employee={employee} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DistrictManagerProgress() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  // Debounce search
  const searchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  };

  // Locations from existing taskApi
  const { data: locationsData } = useGetLocationsByDistrictManagerQuery();

  // Employees attendance
  const { data, isLoading, isFetching } = useGetEmployeesAttendanceQuery({
    search: debouncedSearch || undefined,
    location: selectedLocation,
  });

  const employees = data?.employees ?? [];
  const meta = data?.employees_meta;

  // Client-side pagination (or swap for server-side with page param)
  const PAGE_SIZE = 8;
  const totalPages = Math.ceil((meta?.count ?? employees.length) / PAGE_SIZE);
  const paginatedEmployees = useMemo(
    () => employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [employees, page],
  );

  return (
    <div className="p-4 sm:p-8 bg-black min-h-screen space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Employee Attendence
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Track employee attendance across all locations
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Location Filter */}
          <div className="relative inline-block">
            <select
              value={selectedLocation ?? ""}
              onChange={(e) => {
                setSelectedLocation(
                  e.target.value ? Number(e.target.value) : undefined,
                );
                setPage(1);
              }}
              className="appearance-none bg-black text-white text-sm border border-[#968B79] rounded-lg px-4 py-2 pr-10 focus:outline-none cursor-pointer hover:bg-[#1A1A1A] transition-colors w-full sm:w-auto"
            >
              <option value="">All Locations</option>
              {locationsData?.locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#968B79]">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={handleSearchChange}
              className="bg-black text-white text-sm border border-[#968B79] rounded-lg px-4 py-2 pl-9 focus:outline-none hover:bg-[#1A1A1A] transition-colors w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl overflow-hidden">
        {/* Table header bar */}
        <div className="p-5 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <h3 className="text-white font-bold text-sm">Employee Attendance</h3>
          </div>
          {meta && (
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              {meta.count} employees
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1A1A1A] hover:bg-transparent">
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  Employee
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  Location
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">
                  Present
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">
                  Late
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">
                  Absent
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">
                  &nbsp;
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading || isFetching ? (
                // Skeleton rows
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-[#1A1A1A] hover:bg-transparent">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j} className="px-6 py-4">
                        <div className="h-4 rounded bg-[#1A1A1A] animate-pulse w-full max-w-[120px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedEmployees.length === 0 ? (
                <TableRow className="border-[#1A1A1A] hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-600 text-sm"
                  >
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((emp) => (
                  <EmployeeRow key={emp.id} employee={emp} />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#1A1A1A] flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5 text-gray-400"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 border border-[#262626] rounded-lg disabled:opacity-30 hover:bg-white/5 text-gray-400"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}