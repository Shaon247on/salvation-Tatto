import { cn } from "@/lib/utils";
import { Search, Plus, Shield, Briefcase, Users } from "lucide-react";

interface UserStats {
  district_managers: number;
  managers: number;
  employees: number;
}

interface UserManagementHeaderProps {
  onOpenModal: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  stats?: UserStats;
}

export const UserManagementHeader = ({
  onOpenModal,
  searchQuery = "",
  onSearchChange,
  stats = {
    district_managers: 0,
    managers: 0,
    employees: 0,
  },
}: UserManagementHeaderProps) => (
  <div className="space-y-8">
    {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
          size={18}
        />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-[#0D0D0D] border border-[#262626] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#404040] transition-colors"
        />

       
       
      </div>
      <button
        onClick={onOpenModal}
        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
      >
        <Plus size={18} /> Create User
      </button>
    </div> */}

    <div className="grid grid-cols-1 md:grid-cols-14 md:items-center gap-4 w-full">
      {/* Search Bar - Spans 12 columns */}
      <div className="relative md:col-span-12">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
          size={18}
        />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-[#0D0D0D] border border-[#968B79]/60 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#404040] transition-colors"
        />
      </div>

      {/* Button - Spans 2 columns */}
      <button
        onClick={onOpenModal}
        className="md:col-span-2 flex items-center justify-center gap-2 bg-white text-black px-4 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all whitespace-nowrap"
      >
        <Plus size={18} />
        <span>Create User</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          label: "District Managers",
          val: stats.district_managers,
          icon: <Shield size={18} />,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        },
        {
          label: "Managers",
          val: stats.managers,
          icon: <Briefcase size={18} />,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          label: "Employees",
          val: stats.employees,
          icon: <Users size={18} />,
          color: "text-gray-400",
          bg: "bg-gray-500/10",
        },
      ].map((card) => (
        <div
          key={card.label}
          className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-6 flex items-center gap-6"
        >
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5",
              card.bg,
              card.color,
            )}
          >
            {card.icon}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{card.val}</h2>
            <p className="text-gray-500 text-xs font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
