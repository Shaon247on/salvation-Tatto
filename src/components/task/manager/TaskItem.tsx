import React from "react";
import {
  Circle,
  User,
  Briefcase,
  Calendar,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface TaskProps {
  title: string;
  description: string;
  assignee: string;
  role: string;
  dueDate: string;
  location?: string;
  status: "pending" | "approved" | "overdue" | "rejected";
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskItem = ({
  title,
  description,
  assignee,
  role,
  dueDate,
  location = "Downtown",
  status,
  onEdit,
  onDelete,
}: TaskProps) => {
  // Define status-specific styles based on API keys
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <Circle className="text-amber-500" size={20} />,
      badge: "border-amber-500/30 text-amber-500 bg-amber-500/5",
    },
    approved: {
      label: "Approved",
      icon: <CheckCircle2 className="text-emerald-500" size={20} />,
      badge: "border-emerald-500/30 text-emerald-500 bg-emerald-500/5",
    },
    overdue: {
      label: "Overdue",
      icon: <AlertCircle className="text-red-500" size={20} />,
      badge: "border-red-500/30 text-red-500 bg-red-500/5",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle className="text-gray-500" size={20} />,
      badge: "border-gray-500/30 text-gray-500 bg-gray-500/5",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="group flex items-center justify-between bg-[#0A0A0A] p-5 border border-[#262626] rounded-2xl transition-all hover:border-[#404040]">
      <div className="flex items-start gap-4">
        {/* Left Side: Status Icon */}
        <div className="mt-1 p-2 bg-[#1A1A1A] rounded-lg">{config.icon}</div>

        {/* Center: Content */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <div
              className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.badge}`}
            >
              {config.label}
            </div>
          </div>

          <p className="text-gray-500 text-sm max-w-xl">{description}</p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <User size={14} /> {assignee}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Briefcase size={14} /> {role}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={14} /> Due {dueDate}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin size={14} /> {location}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-white border border-[#262626] rounded-lg transition-colors"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-500/10 border border-red-500/50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;