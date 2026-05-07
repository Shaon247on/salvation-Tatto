/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#A855F7",
  "#06B6D4",
];

const TasksByCategory = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 h-full">
      <h3 className="text-white font-bold mb-1">Tasks by Category</h3>
      <p className="text-gray-500 text-[10px] mb-4">
        Distribution of task types
      </p>

      <div className="h-48 w-full relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-gray-500 text-[10px]">{item.name}</span>
            </div>
            <span className="text-white text-[10px] font-bold">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksByCategory;
