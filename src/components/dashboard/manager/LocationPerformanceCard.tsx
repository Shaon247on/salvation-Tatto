import React from "react";
import { MapPin, AlertTriangle } from "lucide-react";

interface PerformanceMetricProps {
  label: string;
  value: number;
  color: "red" | "yellow" | "green";
}

const PerformanceMetric = ({ label, value, color }: PerformanceMetricProps) => {
  const colorMap = {
    red: "text-red-400 bg-red-400",
    yellow: "text-yellow-500 bg-yellow-500",
    green: "text-emerald-400 bg-emerald-400",
  };

  return (
    <div className="flex-1 bg-[#141414] border border-[#262626] rounded-xl p-3">
      <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold mb-2 ${colorMap[color].split(" ")[0]}`}>
        {value}%
      </p>
      <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color].split(" ")[1]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

interface LocationCardProps {
  name: string;
  location: string;
  status: "Active" | "Inactive";
  taskCompletion: number;
  attendance: number;
  staffCount: number;
  overdueCount: number;
}

const LocationPerformanceCard = ({
  name,
  location,
  status,
  taskCompletion,
  attendance,
  staffCount,
  overdueCount,
}: LocationCardProps) => {
  // Logic to determine bar colors based on percentages
  const getBarColor = (val: number) =>
    val < 60 ? "red" : val < 80 ? "yellow" : "green";

  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-5 flex flex-col gap-5 min-w-75 flex-1">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500 font-medium">{status}</span>
        </div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin size={14} />
          <span className="text-xs">{location}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex gap-3">
        <PerformanceMetric
          label="Task Completion"
          value={taskCompletion}
          color={getBarColor(taskCompletion)}
        />
        <PerformanceMetric
          label="Attendance"
          value={attendance}
          color={getBarColor(attendance)}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-4 pt-2 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-sm font-semibold text-white">{staffCount}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            staff
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-red-400/80">
          <AlertTriangle size={14} />
          <span className="text-sm font-semibold">{overdueCount}</span>
          <span className="text-xs uppercase tracking-wider">overdue</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPerformanceCard;
