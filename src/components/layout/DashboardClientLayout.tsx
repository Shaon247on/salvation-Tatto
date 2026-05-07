"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Handles both Desktop and Mobile logic */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 min-h-screen flex flex-col",
          "lg:pl-64",
          sidebarCollapsed && "lg:pl-16",
          "pl-0",
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="p-4 lg:p-6 flex-1">{children}</main>
      </div>
    </div>
  );

  return <ProtectedRoute>{content}</ProtectedRoute>;
}
