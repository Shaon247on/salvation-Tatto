import React, { useState } from "react";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import {
  EmployeeBreakdownResponse,
  TaskByLocation,
} from "@/redux/services/admin/dashboard/adminDashboardApi";
import { cn } from "@/lib/utils";

interface Props {
  breakdown: EmployeeBreakdownResponse;
  locations: TaskByLocation[];
  selectedLocation: string;
  onLocationChange: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const EmployeeBreakdown = ({
  breakdown,
  locations,
  selectedLocation,
  onLocationChange,
  currentPage,
  onPageChange,
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /** * FIXED: Based on your API response logs, the limit is 5 items per page.
   * Setting this correctly ensures the pagination UI displays when total count > 5.
   */
  const itemsPerPage = 5;
  const totalPages = Math.ceil(breakdown.count / itemsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "late":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "absent":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const currentLocName =
    selectedLocation === "all"
      ? "All Locations"
      : locations.find((l) => l.location_id.toString() === selectedLocation)
          ?.location_name || "Location";

  return (
    <div className="bg-black">
      <div className="mx-auto">
        <div className="bg-black/40 border border-[#968B79]/60 rounded-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-500" />
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Employee Breakdown
              </h2>
            </div>

            {/* Location Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#404040] rounded-lg text-sm text-white flex items-center gap-2 hover:border-gray-500 transition-colors"
              >
                {currentLocName}{" "}
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform",
                    isDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Invisible backdrop to close dropdown on click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#404040] rounded-lg shadow-2xl z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        onLocationChange("all");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-gray-400 hover:text-white hover:bg-[#252525] border-b border-[#333333]"
                    >
                      All Locations
                    </button>
                    {locations.map((loc) => (
                      <button
                        key={loc.location_id}
                        onClick={() => {
                          onLocationChange(loc.location_id.toString());
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-gray-400 hover:text-white hover:bg-[#252525]"
                      >
                        {loc.location_name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-2 pb-4 border-b border-[#333333]">
            <div className="col-span-4 text-[10px] uppercase font-bold tracking-widest text-white">
              Employee
            </div>
            <div className="col-span-3 text-[10px] uppercase font-bold tracking-widest text-white">
              Role
            </div>
            <div className="col-span-3 text-[10px] uppercase font-bold tracking-widest text-white">
              Location
            </div>
            <div className="col-span-2 text-[10px] uppercase font-bold tracking-widest text-white text-right">
              Status
            </div>
          </div>

          {/* Employee Results */}
          <div className="space-y-3 mt-3">
            {breakdown.results.map((employee) => (
              <div
                key={employee.id}
                className="grid grid-cols-12 gap-4 items-center px-2 py-3 rounded-lg hover:bg-white/5 transition-all group"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-indigo-600/20 border border-indigo-600/30 font-bold text-xs">
                    {getInitials(employee.name)}
                  </div>
                  <span className="text-white font-medium">
                    {employee.name}
                  </span>
                </div>

                <div className="col-span-3 text-gray-400 text-sm">
                  {employee.role_display}
                </div>

                <div className="col-span-3 flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={14} className="text-gray-600" />
                  {employee.location_name}
                </div>

                <div className="col-span-2 flex justify-end">
                  <div
                    className={`px-3 py-1 text-[10px] font-bold border rounded-full uppercase tracking-tight transition-all ${getStatusStyles(employee.today_status)}`}
                  >
                    {employee.today_status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {breakdown.results.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic text-sm">
              No employees found for the selected criteria.
            </div>
          )}

          {/* FIXED Pagination Logic */}
          {breakdown.count > itemsPerPage && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#333333]">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!breakdown.previous}
                className="px-4 py-2 text-xs font-bold border border-[#404040] rounded-lg text-gray-300 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium">
                  Page{" "}
                  <span className="text-white font-bold">{currentPage}</span> of{" "}
                  {totalPages}
                </span>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                  Total Employees: {breakdown.count}
                </span>
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!breakdown.next}
                className="px-4 py-2 text-xs font-bold border border-[#404040] rounded-lg text-gray-300 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeBreakdown;
