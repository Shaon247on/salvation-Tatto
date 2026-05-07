// import { cn } from "@/lib/utils";

// const ComparisonBar = ({
//   label,
//   value,
//   color,
// }: {
//   label: string;
//   value: number;
//   color: string;
// }) => (
//   <div className="flex items-center justify-between gap-4">
//     <span className="text-gray-500 text-xs w-28 truncate">{label}</span>
//     <div className="flex-1 bg-[#141414] h-1.5 rounded-full overflow-hidden">
//       <div
//         className={cn("h-full rounded-full transition-all duration-500", color)}
//         style={{ width: `${value}%` }}
//       />
//     </div>
//     <span
//       className={cn(
//         "text-xs font-bold w-10 text-right",
//         color.replace("bg-", "text-"), // Converts bg-indigo-500 to text-indigo-500
//       )}
//     >
//       {value}%
//     </span>
//   </div>
// );

// export default ComparisonBar;

import { cn } from "@/lib/utils";

const ComparisonBar = ({
  label,
  value,
  color, // This is now a hex code like "#6366F1"
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-gray-500 text-xs w-28 truncate uppercase tracking-wider">
      {label}
    </span>
    <div className="flex-1 bg-[#141414] h-1 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          backgroundColor: color, // Use hex color here
        }}
      />
    </div>
    <span
      className="text-xs font-bold w-10 text-right"
      style={{ color: color }} // Use hex color for text
    >
      {value}%
    </span>
  </div>
);

export default ComparisonBar;
