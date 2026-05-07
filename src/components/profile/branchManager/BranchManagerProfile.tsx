"use client";

import React from "react";
import { ProfileInfo } from "./ProfileInfo";
import { ChangePassword } from "./ChangePassword";

export default function BranchManagerProfile() {
  // --- BRANCH MANAGER SPECIFIC DUMMY DATA ---
  const managerData = {
    name: "Alex Kim",
    role: "Branch Manager",
    status: "Active",
    email: "a.kim@inkempire.com",
    branch: "Salvation — Downtown Chicago", // Specific branch assignment
    staffCount: "12 Employees",
    memberSince: "November 12, 2023",
    lastLogin: "March 26, 2026 - 10:45 AM",
  };

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      {/* Page Title */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Branch Management Profile
          </h1>
          <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest italic">
            Personal settings and branch authority controls
          </p>
        </div>
        {/* Subtle Branch Badge */}
        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl hidden md:block">
          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            Primary Branch
          </p>
          <p className="text-white text-xs font-bold">{managerData.branch}</p>
        </div>
      </div>

      <div className="space-y-8">
        <ProfileInfo data={managerData} />
        <ChangePassword />
      </div>
    </div>
  );
}
