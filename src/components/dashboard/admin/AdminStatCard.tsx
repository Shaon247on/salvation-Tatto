import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
}: AdminStatProps) => (
  <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6 flex-1 min-w-50 hover:border-[#404040] transition-colors">
    <div
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center mb-6",
        bgColor,
      )}
    >
      <Icon className={cn("w-5 h-5", iconColor)} />
    </div>
    <div className="space-y-1">
      <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
      <p className="text-gray-500 text-xs font-medium">{title}</p>
    </div>
  </div>
);

export default AdminStatCard;
