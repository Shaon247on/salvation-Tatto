export const StatSummary = ({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "blue" | "green" | "red" | "purple";
}) => {
  const colors = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    red: "text-red-400",
    purple: "text-indigo-400", // Using indigo for Pending
  };

  return (
    <div className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-2xl p-6 text-center shadow-sm">
      <h2 className={`text-4xl font-bold mb-1 ${colors[color]}`}>{count}</h2>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
};
