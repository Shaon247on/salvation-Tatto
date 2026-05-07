/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitCommitHorizontal } from "lucide-react";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const AttendanceChart = ({ data }: { data: any[] }) => (
  <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 h-full">
    <div className="mb-6">
      <h3 className="text-white font-bold text-lg">Attendance Overview</h3>
      <p className="text-gray-500 text-xs mt-1">Last 7 days · All locations</p>
    </div>
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#1A1A1A"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4B5563", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4B5563", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0A0A0A",
              border: "1px solid #262626",
            }}
          />
          <Area
            type="monotone"
            dataKey="present"
            stroke="#d4af37"
            fillOpacity={1}
            fill="url(#colorPresent)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="absent"
            stroke="#ef4444"
            fill="transparent"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="late"
            stroke="#f59e0b"
            fill="transparent"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <span className="flex items-center gap-2 text-[10px] text-[#d4af37] uppercase font-bold">
        <GitCommitHorizontal className="" />
        Present
      </span>
      <span className="flex items-center gap-2 text-[10px] text-[#ef4444] uppercase font-bold">
        <GitCommitHorizontal className="" /> Absent
      </span>
      <span className="flex items-center gap-2 text-[10px] text-[#f59e0b] uppercase font-bold">
        <GitCommitHorizontal className="" /> Late
      </span>
    </div>
  </div>
);
