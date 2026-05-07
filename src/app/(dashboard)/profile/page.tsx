"use client";

import { selectUserRole } from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import AdminProfile from "@/components/profile/admin/AdminProfile";

export default function ProfilePage() {
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
      return <AdminProfile user="super_admin" />;
    case "district_manager":
      return <AdminProfile user="district_manager" />;
    case "branch_manager":
      return <AdminProfile user="branch_manager" />;
    default:
      return <div>Access Denied: Role not recognized.</div>;
  }
}
