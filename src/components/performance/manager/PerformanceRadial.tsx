// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// const PerformanceRadial = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: number;
// }) => {
//   const data = [{ value }, { value: 100 - value }];
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="relative w-24 h-24">
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               innerRadius={30}
//               outerRadius={40}
//               startAngle={90}
//               endAngle={450}
//               paddingAngle={0}
//               dataKey="value"
//             >
//               <Cell fill="#8DC63F" stroke="none" />
//               <Cell fill="#1A1A1A" stroke="none" />
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-white font-bold text-sm">{value}%</span>
//           <span className="text-gray-600 text-[8px] uppercase">avg</span>
//         </div>
//       </div>
//       <span className="text-gray-500 text-[10px] uppercase font-bold">
//         {label}
//       </span>
//     </div>
//   );
// };

// export default PerformanceRadial;

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface RadialData {
  name: string;
  color: string;
}

const PerformanceRadial = ({
  label,
  avgValue,
  locations,
}: {
  label: string;
  avgValue: number;
  locations: RadialData[];
}) => {
  // Create 4 equal segments for the ring
  const data = locations.map((loc) => ({ value: 25 }));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={45}
              startAngle={90}
              endAngle={450}
              paddingAngle={2} // Small gap between segments
              dataKey="value"
              stroke="none"
            >
              {locations.map((loc, index) => (
                <Cell key={`cell-${index}`} fill={loc.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg">{avgValue}%</span>
          <span className="text-gray-500 text-[10px] uppercase font-medium">
            avg
          </span>
        </div>
      </div>
      <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
};

export default PerformanceRadial;
