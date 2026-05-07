// import { Filter } from "lucide-react";

// export const ReportFilters = () => (
//   <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 flex items-center gap-4">
//     <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
//       <Filter size={16} />
//       <span>Filters:</span>
//     </div>

//     <div className="flex flex-wrap gap-3">
//       {["All Location", "All User", "Last 7 Days"].map((filter) => (
//         <button
//           key={filter}
//           className="bg-black border border-[#262626] px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-4 hover:border-[#404040] transition-all"
//         >
//           {filter}
//         </button>
//       ))}
//     </div>
//   </div>
// );

"use client";

import React, { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportFiltersProps {
  currentPeriod: "today" | "weekly" | "monthly" | "yearly";
  setPeriod: (period: "today" | "weekly" | "monthly" | "yearly") => void;
}

export const ReportFilters = ({
  currentPeriod,
  setPeriod,
}: ReportFiltersProps) => {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  // Helper to handle selection
  const handleSelect = (
    e: React.MouseEvent,
    period: "today" | "weekly" | "monthly" | "yearly",
  ) => {
    e.stopPropagation(); // Prevents the click from hitting the overlay
    setPeriod(period);
    setIsPeriodOpen(false);
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-4 flex items-center gap-4">
      {/* Label */}
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
        <Filter size={16} />
        <span>Filters:</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Placeholder Buttons */}
        <button
          type="button"
          className="bg-black border border-[#968B79]/60 px-6 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:border-[#404040] transition-all min-w-35 text-left"
        >
          All Location
        </button>

        <button
          type="button"
          className="bg-black border border-[#968B79]/60 px-6 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:border-[#404040] transition-all min-w-35 text-left"
        >
          All User
        </button>

        {/* Period Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPeriodOpen(!isPeriodOpen)}
            className={cn(
              "bg-black border border-[#968B79]/60 px-6 py-2.5 rounded-xl text-xs font-medium transition-all min-w-35 flex items-center justify-between gap-4 relative z-30",
              isPeriodOpen
                ? "border-[#968B79]/50 text-white"
                : "text-gray-300 hover:border-[#404040]",
            )}
          >
            <span className="capitalize">{currentPeriod}</span>
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                isPeriodOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isPeriodOpen && (
            <>
              {/* Overlay: Fixed to cover screen, z-10 */}
              <div
                className="fixed inset-0 z-10 bg-transparent"
                onClick={() => setIsPeriodOpen(false)}
              />

              {/* Menu: Absolute, z-40 to be well above overlay */}
              <div className="absolute top-full left-0 mt-2 w-full bg-[#0D0D0D] border border-[#968B79]/60 rounded-xl overflow-hidden shadow-2xl z-40 animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={(e) => handleSelect(e, "today")}
                  className={cn(
                    "w-full text-left px-6 py-3 text-xs font-medium transition-colors hover:bg-white/5",
                    currentPeriod === "today"
                      ? "text-white bg-white/10"
                      : "text-gray-500",
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSelect(e, "weekly")}
                  className={cn(
                    "w-full text-left px-6 py-3 text-xs font-medium transition-colors hover:bg-white/5",
                    currentPeriod === "weekly"
                      ? "text-white bg-white/10"
                      : "text-gray-500",
                  )}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSelect(e, "monthly")}
                  className={cn(
                    "w-full text-left px-6 py-3 text-xs font-medium transition-colors hover:bg-white/5",
                    currentPeriod === "monthly"
                      ? "text-white bg-white/10"
                      : "text-gray-500",
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSelect(e, "yearly")}
                  className={cn(
                    "w-full text-left px-6 py-3 text-xs font-medium transition-colors hover:bg-white/5",
                    currentPeriod === "yearly"
                      ? "text-white bg-white/10"
                      : "text-gray-500",
                  )}
                >
                  Yearly
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
