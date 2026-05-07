import React from "react";
import { User, Mail, Shield, Clock, Globe, Camera } from "lucide-react";

interface AdminProfileData {
  name: string;
  role: string;
  status: string;
  email: string;
  memberSince: string;
  lastLogin: string;
}

export const ProfileInfo = ({ data }: { data: AdminProfileData }) => {
  const detailItems = [
    { label: "Email Address", value: data.email, icon: Mail },
    { label: "Role & Permissions", value: data.role, icon: Shield },
    { label: "Member Since", value: data.memberSince, icon: Clock },
    { label: "Last Login", value: data.lastLogin, icon: Globe },
  ];

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[32px] p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Avatar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#141414] border border-[#262626] rounded-2xl flex items-center justify-center relative">
            <User size={32} className="text-gray-500" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {data.name}
            </h2>
            <p className="text-gray-500 text-sm font-medium">{data.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                {data.status}
              </span>
            </div>
          </div>
        </div>
        <button className="bg-[#111] border border-[#262626] text-gray-400 px-6 py-2.5 rounded-xl text-xs font-bold hover:text-white hover:bg-[#1A1A1A] transition-all flex items-center gap-2">
          <Camera size={14} /> Upload Photo
        </button>
      </div>

      {/* Details List */}
      <div className="space-y-1">
        {detailItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-[#141414] last:border-0 hover:bg-white/1 transition-colors rounded-xl"
          >
            <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center border border-white/5">
              <item.icon size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
                {item.label}
              </p>
              <p className="text-gray-300 text-sm font-medium mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
