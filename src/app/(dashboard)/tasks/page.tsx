"use client";

import {
  selectUserRole,
  // selectCurrentUser,
} from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";
// import AdminView from "@/components/task/admin/AdminView";
import ManagerView from "@/components/task/manager/ManagerView";
import BranchManagerView from "@/components/task/branchManager/BranchManagerView";
import { useAppSelector } from "@/redux/store";
import TaskManagementSystem from "@/components/task/admin/TaskManagementSystem";

export default function TaskPage() {
  const role = useAppSelector(selectUserRole);
  // const user = useAppSelector(selectCurrentUser);

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
      // return <AdminView />;
      return <TaskManagementSystem />;
    case "district_manager":
      return <ManagerView />;
    case "branch_manager":
      return <BranchManagerView />;
    default:
      return <div>Access Denied: Role not recognized.</div>;
  }
}
