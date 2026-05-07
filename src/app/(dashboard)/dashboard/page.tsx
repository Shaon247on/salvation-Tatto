"use client";

import {
  selectUserRole,
  // selectCurrentUser,
} from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAppSelector } from "@/redux/store";
import DashboardAdmin from "@/components/dashboard/admin/AdminDashboard";
import DashboardManager from "@/components/dashboard/manager/DashboardManager";
import DashboardBranchManager from "@/components/dashboard/branchManager/DashboardBranchManager";

export default function DashboardPage() {
  const role = useAppSelector(selectUserRole);
  const router = useRouter();
  // const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    // Redirect QR Attendees to their dedicated page
    if (role === "clock_in_user") {
      router.replace("/qr-attendee");
    }
  }, [role, router]);

  if (!role || role === "clock_in_user") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Dispatcher Logic
  switch (role) {
    case "super_admin":
      return <DashboardAdmin />;

    case "district_manager":
      return <DashboardManager />;
    case "branch_manager":
      return <DashboardBranchManager />;
    default:
      return <div>Access Denied: Role not recognized.</div>;
  }
}
