// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector(selectCurrentToken);
  const router = useRouter();

  useEffect(() => {
    // If middleware somehow fails or Redux loses state and cookie is gone
    if (!token) {
      router.replace("/auth/signin");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
