"use client";

import {
  selectUserRole,
  // selectCurrentUser,
} from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";
import VerificationsAdmin from "@/components/verifications/admin/AdminView";
import VerificationsManager from "@/components/verifications/manager/ManagerView";
import { useAppSelector } from "@/redux/store";
import VerificationsBranchManager from "@/components/verifications/branchManager/BranchManagerView";

export default function VerificationsPage() {
  const role = useAppSelector(selectUserRole);
  // const user = useAppSelector(selectCurrentUser);

  if (!role) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Dispatcher Logic - only admin and manager have verifications access
  switch (role) {
    case "super_admin":
      return <VerificationsAdmin />;
    case "district_manager":
      return <VerificationsManager />;
    case "branch_manager":
      return <VerificationsBranchManager />;
    default:
      return (
        <div>
          Access Denied: You do not have permission to view verifications.
        </div>
      );
  }
}
