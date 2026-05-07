import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatCardProps) => {
  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 flex flex-col gap-4 min-w-[280px] flex-1">
      {/* Icon Container */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor}`}
      >
        <Icon size={24} className={iconColor} />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {value}
        </h2>
        <p className="text-gray-200 font-medium">{title}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
