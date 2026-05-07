"use client";

import React from "react";
import { ProfileInfo } from "./ProfileInfo";
import { ChangePassword } from "./ChangePassword";

export default function ManagerProfile() {
  // --- MANAGER SPECIFIC DUMMY DATA ---
  const managerData = {
    name: "Sarah Chen",
    role: "Studio Manager",
    status: "Active",
    email: "s.chen@salvation.com",
    location: "SALVATION — Downtown Branch", // Managers are assigned to a specific branch
    memberSince: "August 01, 2022",
    lastLogin: "March 26, 2026 - 08:15 AM",
  };

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Settings</h1>
        <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest italic">
          Manage your personal profile and branch account security.
        </p>
      </div>

      <div className="space-y-8">
        {/* We pass the manager-specific data here */}
        <ProfileInfo data={managerData} />
        <ChangePassword />
      </div>
    </div>
  );
}
