"use client";

import {
  selectUserRole,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAppSelector } from "@/redux/store";

import QRAttendeeView from "@/components/qr-section/qr-attendee/QRAttendeeView";

export default function QrAttendeePage() {
  const role = useAppSelector(selectUserRole);
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  // Verify user has qr_attendee role, otherwise redirect
  useEffect(() => {
    if (role && role !== "clock_in_user") {
      router.replace("/dashboard");
    }
  }, [role, router]);

  if (!role) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only render if user is confirmed qr_attendee
  if (role !== "clock_in_user") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <QRAttendeeView />;
}
