/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnTimeRateItem } from "@/types/districtManager/districtManagerReport.type";
import React from "react";
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

const OnTimeRateChart = ({ data }: { data: OnTimeRateItem[] }) => {

  console.log("the data to performance:",data)
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 h-full">
      <h3 className="text-white font-bold mb-1">On-Time Rate by Staff</h3>
      <p className="text-gray-500 text-xs mb-8">
        Punctuality across selected location(s)
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 40, right: 20 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#1A1A1A"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 10 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#0D0D0D",
                border: "1px solid #262626",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="onTimeRate" radius={[0, 4, 4, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.on_time_rate >= 90 ? "#10B981" : "#B45309"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OnTimeRateChart;
