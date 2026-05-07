import { DistrictManagerDashboardResponse } from "@/types/districtManager/districtManagerDashboard.type";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", assigned: 11, completed: 8 },
  { day: "Tue", assigned: 14, completed: 12 },
  { day: "Wed", assigned: 13, completed: 9 },
  { day: "Thu", assigned: 16, completed: 15 },
  { day: "Fri", assigned: 14, completed: 11 },
  { day: "Sat", assigned: 9, completed: 6 },
  { day: "Sun", assigned: 4, completed: 3 },
];

const TaskActivityChart = ({
  data,
}: {
  data: DistrictManagerDashboardResponse["weekly_task_activity"];
}) => {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 w-full h-112.5">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white text-lg font-bold">Weekly Task Activity</h3>
          <p className="text-gray-500 text-sm">Tasks assigned vs completed</p>
        </div>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid
              vertical={false}
              stroke="#1A1A1A"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12 }}
            />
            <Bar
              dataKey="assigned"
              fill="#1E1B4B"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="completed"
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
          <span className="text-xs text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1E1B4B]" />
          <span className="text-xs text-gray-400">Assigned</span>
        </div>
      </div>
    </div>
  );
};

export default TaskActivityChart;
