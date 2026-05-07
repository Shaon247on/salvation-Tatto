"use client";

import {
  selectUserRole,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";

import ReportsManager from "@/components/reports/manager/ManagerView";
import ReportsBranchManager from "@/components/reports/branchManager/ReportsBranchManager";
import { useAppSelector } from "@/redux/store";
import ReportsAdmin from "@/components/reports/admin/ReportsAdmin";

export default function ReportsPage() {
  const role = useAppSelector(selectUserRole);
  const user = useAppSelector(selectCurrentUser);

  if (!role) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Dispatcher Logic
  switch (role) {
    case "super_admin":
      return <ReportsAdmin />;
    case "district_manager":
      return <ReportsManager />;
    case "branch_manager":
      return <ReportsBranchManager />;
    default:
      return <div>Access Denied: Role not recognized.</div>;
  }
}
