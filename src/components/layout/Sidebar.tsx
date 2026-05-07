"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import {
  selectCurrentUser,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { getFilteredSidebarItems, type SidebarItem } from "@/types/rbac";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  ClipboardCheck,
  BarChart3,
  Users,
  MapPin,
  Bell,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  QrCode,
  LogOut,
  Smartphone,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  CheckSquare,
  ClipboardCheck,
  BarChart3,
  Users,
  MapPin,
  Bell,
  FileText,
  TrendingUp,
  QrCode,
  Smartphone,
  User,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const role = useAppSelector(selectUserRole);
  const sidebarItems = role ? getFilteredSidebarItems(role) : [];

  return (
    <>
      {/* Mobile Overlay: visible only when sidebar is open on mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          // Mobile Logic: Slide off screen
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop Logic: Width toggle
          collapsed ? "lg:w-16" : "lg:w-64",
          "w-64", // Mobile default width
        )}
      >
        <SidebarContent
          items={sidebarItems}
          collapsed={collapsed}
          pathname={pathname}
          onToggle={onToggle}
          iconMap={iconMap}
          setMobileOpen={setMobileOpen}
          mobileOpen={mobileOpen}
        />
      </aside>
    </>
  );
}

interface SidebarContentProps {
  items: SidebarItem[];
  collapsed: boolean;
  pathname: string;
  onToggle: () => void;
  iconMap: Record<string, React.ComponentType<{ className?: string }>>;
  setMobileOpen: (open: boolean) => void;
  mobileOpen: boolean;
}

function SidebarContent({
  items,
  collapsed,
  pathname,
  onToggle,
  iconMap,
  setMobileOpen,
  mobileOpen,
}: SidebarContentProps) {
  const user = useAppSelector(selectCurrentUser);
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center min-h-16 border-b border-[#968B79]/20 px-4 ",
          collapsed ? "lg:justify-center" : "justify-between",
        )}
      >
        {(!collapsed || mobileOpen) && (
          // <h1 className="text-lg font-bold text-foreground">
          //   Salvation<span className="text-primary">Tattoo</span>
          // </h1>
          <Image
            src={logo}
            alt="Salvation Tattoo Lounge Logo"
            width={200}
            height={120}
            className="py-4"
          ></Image>
        )}

        {/* Desktop toggle / Mobile close button */}
        <button
          onClick={mobileOpen ? () => setMobileOpen(false) : onToggle}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)} // Fixes the setState error
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    collapsed && !mobileOpen && "lg:justify-center lg:px-2",
                    isActive
                      ? " text-[#968B79] border border-[#968B79]/60  "
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {(!collapsed || mobileOpen) && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info Footer */}
      <div className="border-t border-[#968B79]/30 p-4">
        {(!collapsed || mobileOpen) && (
          <Link href={"/profile"} className="cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.username?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
          </Link>
        )}
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && !mobileOpen && "lg:justify-center lg:px-2",
          )}
          title={collapsed && !mobileOpen ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {(!collapsed || mobileOpen) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
