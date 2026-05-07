/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { useGetAttendanceQuery } from "@/redux/services/admin/attendance/attendanceApi";
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";
import AttendanceDetailView from "./AttendanceDetailView";
import AttendanceSummaryTable from "./AttendanceSummaryTable";
import Pagination from "./Pagination";

export default function UsersAttendance() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [period, setPeriod] = useState("Weekly");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAttendanceQuery({
    search,
    location,
    period,
    page,
  });

  const { data: locationsData } = useGetLocationsQuery(undefined);

  // Reset page when filters change
  const handleFilterChange = (type: string, value: string) => {
    if (type === "search") setSearch(value);
    if (type === "location") setLocation(value);
    if (type === "period") setPeriod(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black p-8 space-y-6 text-white">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search User"
            value={search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#968B79]/50"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] rounded-xl px-4 py-2 text-sm outline-none cursor-pointer min-w-35"
          >
            <option value="all">All Locations</option>
            {locationsData?.locations?.map((loc: any) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => handleFilterChange("period", e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] rounded-xl px-4 py-2 text-sm outline-none cursor-pointer"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : data?.view === "detail" ? (
        <AttendanceDetailView data={data} />
      ) : (
        <AttendanceSummaryTable data={data} />
      )}

      {/* Pagination */}
      <Pagination
        count={
          data?.view === "detail"
            ? data?.attendance_log?.count
            : data?.employees?.count
        }
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
