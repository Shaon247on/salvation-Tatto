import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserRole } from "@/types";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectUserRole,
  setCredentials,
  logout as logoutAction,
  setLoading,
  // setError,
} from "@/redux/features/auth/authSlice";
import { hasPermission, getPermissions } from "@/types/rbac";
import type { User, Permission } from "@/types";

// Hook for checking authentication status
export function useAuth() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectUserRole);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const login = useCallback(
    (userData: User, token: string) => {
      dispatch(setCredentials({ user: userData, token }));
      router.push("/dashboard");
    },
    [dispatch, router],
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    // Clear cookie on logout
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Clear persisted Redux state from localStorage
    localStorage.removeItem("persist:root");
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    role,
    login,
    logout,
  };
}

// Hook for checking permissions
export function usePermission(permission: Permission): boolean {
  const role = useAppSelector(selectUserRole);

  if (!role) return false;

  return hasPermission(role, permission);
}

// Hook for getting all permissions
export function usePermissions(): Permission[] {
  const role = useAppSelector(selectUserRole);

  if (!role) return [];

  return getPermissions(role);
}

// Hook for protected route
export function useProtectedRoute(redirectTo: string = "/auth/signin") {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // const router = useRouter();

  // Disabled automatic redirect - users can stay on page after logout
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push(redirectTo);
  //   }
  // }, [isAuthenticated, router, redirectTo]);

  return isAuthenticated;
}

// Hook for role-based route access
export function useRoleAccess(
  allowedRoles: UserRole[],
  redirectTo: string = "/dashboard",
) {
  const role = useAppSelector(selectUserRole);
  // const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Disabled automatic redirect - users can stay on page after logout
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/auth/signin");
  //     return;
  //   }
  //
  //   if (role && !allowedRoles.includes(role)) {
  //     router.push(redirectTo);
  //   }
  // }, [role, isAuthenticated, router, allowedRoles, redirectTo]);

  return {
    hasAccess: role ? allowedRoles.includes(role) : false,
    role,
  };
}

// Mock login for demo purposes
export function useDemoLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loginAsAdmin = useCallback(() => {
    dispatch(setLoading(true));
    // Simulate API call
    setTimeout(() => {
      dispatch(
        setCredentials({
          user: {
            id: 1,
            email: "admin@salvationlounge.com",
            username: "Admin User",
            role: "super_admin",
            role_display: "Super Admin",
            is_super_admin: true,
          },
          token: "demo-token-admin",
        }),
      );
      // Set cookie for middleware to detect demo login
      document.cookie = "accessToken=demo-token-admin; path=/; max-age=86400";
      dispatch(setLoading(false));
      router.push("/dashboard");
    }, 500);
  }, [dispatch, router]);

  const loginAsManager = useCallback(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(
        setCredentials({
          user: {
            id: 2,
            email: "districtmanager@salvationlounge.com",
            username: "District Manager",
            role: "district_manager",
            role_display: "District Manager",
            is_super_admin: false,
          },
          token: "demo-token-manager",
        }),
      );
      // Set cookie for middleware to detect demo login
      document.cookie = "accessToken=demo-token-manager; path=/; max-age=86400";
      dispatch(setLoading(false));
      router.push("/dashboard");
    }, 500);
  }, [dispatch, router]);

  const loginAsBranchManager = useCallback(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(
        setCredentials({
          user: {
            id: 1,
            email: "storemanger@salvationlounge.com",
            username: "Store Manager",
            role: "branch_manager",
            role_display: "Branch Manager",
            is_super_admin: false,
          },
          token: "demo-token-branch",
        }),
      );
      // Set cookie for middleware to detect demo login
      document.cookie = "accessToken=demo-token-branch; path=/; max-age=86400";
      dispatch(setLoading(false));
      router.push("/dashboard");
    }, 500);
  }, [dispatch, router]);

  const loginAsQRAttendee = useCallback(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(
        setCredentials({
          user: {
            id: 3,
            email: "attendee@salvationlounge.com",
            username: "QR Attendee",
            role: "qr_attendee",
            role_display: "QR Attendee",
            is_super_admin: false,
          },
          token: "demo-token-qr-attendee",
        }),
      );
      // Set cookie for middleware to detect demo login
      document.cookie =
        "accessToken=demo-token-qr-attendee; path=/; max-age=86400";
      dispatch(setLoading(false));
      router.push("/dashboard");
    }, 500);
  }, [dispatch, router]);

  return {
    loginAsAdmin,
    loginAsManager,
    loginAsBranchManager,
    loginAsQRAttendee,
  };
}
