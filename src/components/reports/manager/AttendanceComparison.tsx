/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AttendanceComparison = ({ data }: { data: any[] }) => (
  <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6">
    <h3 className="text-white font-bold mb-1">
      Completion vs Attendance by Location
    </h3>
    <p className="text-gray-500 text-[10px] mb-6">
      Performance metrics per location
    </p>

    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid
            vertical={false}
            stroke="#1A1A1A"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="name"
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
            contentStyle={{
              backgroundColor: "#0A0A0A",
              border: "1px solid #262626",
            }}
          />
          <Bar
            dataKey="completion"
            fill="#6366F1"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar
            dataKey="attendance"
            fill="#312E81"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AttendanceComparison;
