"use client";

import {
  selectUserRole,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";

import { useAppSelector } from "@/redux/store";
import AdminQrSection from "@/components/qr-section/admin/AdminQrSection";
import QRAttendeeView from "@/components/qr-section/qr-attendee/QRAttendeeView";
// import BranchManagerQrSection from "@/components/qr-section/branchManager/BranchManagerQrSection";
// import ManagerQrSection from "@/components/qr-section/manager/ManagerQrSection";

export default function QrSectionpage() {
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
      return <AdminQrSection />;
    case "clock_in_user":
      return <QRAttendeeView />;
    // case "district_manager":
    //   return <ManagerQrSection />;
    // case "branch_manager":
    //   return <BranchManagerQrSection />;
    default:
      return <div>Access Denied: Role not recognized.</div>;
  }
}
