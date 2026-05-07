"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";

// Super admin
import {
  ProfileType,
  useGetProfileQuery,
  useUpdateProfilePhotoMutation,
} from "@/redux/services/admin/profile/profileApi";

// District manager
import { useGetDistrictManagerProfileQuery } from "@/redux/services/districtManager/districtManagerProfileApi";

// Branch manager
import { useGetBranchManagerProfileQuery } from "@/redux/services/branchManager/profile/branchManagerProfileApi";

// Shared types
import {
  UserRole,
  NormalisedProfile,
  DistrictManagerProfile,
  BranchManagerProfile,
} from "@/types/ManagerProfile.type";

// Components
import { ProfileInfo } from "./ProfileInfo";
import { ChangePassword } from "./ChangePassword";

// ─── Normalisers ──────────────────────────────────────────────────────────────

/**
 * The super admin API may return either `date_joined` or `member_since` and
 * either `last_login` or `last_login_at` depending on the backend version.
 * We coerce both here so the component never receives undefined.
 */
function normaliseSuperAdmin(
  raw: ProfileType & { username?: string },
): NormalisedProfile {
  return {
    id: raw.id,
    full_name:
      raw.full_name ??
      [raw.first_name, raw.last_name].filter(Boolean).join(" "),
    username: raw.username ?? "",
    email: raw.email,
    phone: raw.phone ?? null,
    role_display: raw.role_display ?? "Super Admin",
    profile_photo: raw.profile_photo ?? null,
    // accept either field name the backend sends
    date_joined: raw.date_joined ?? raw.member_since ?? "",
    last_login: raw.last_login ?? raw.last_login_at ?? null,
  };
}

function normaliseDistrictManager(
  raw: DistrictManagerProfile,
): NormalisedProfile {
  return {
    id: raw.id,
    full_name: raw.full_name,
    username: raw.username,
    email: raw.email,
    phone: raw.phone,
    role_display: raw.role_display,
    profile_photo: raw.profile_photo,
    date_joined: raw.date_joined,
    last_login: raw.last_login,
  };
}

function normaliseBranchManager(raw: BranchManagerProfile): NormalisedProfile {
  return {
    id: raw.id,
    full_name: raw.full_name,
    username: raw.username,
    email: raw.email,
    phone: raw.phone,
    role_display: raw.role_display,
    profile_photo: raw.profile_photo,
    date_joined: raw.date_joined,
    last_login: raw.last_login,
    location: raw.location,
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  user: UserRole;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ProfileLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={32} className="animate-spin text-white" />
    </div>
  );
}

function ProfileError() {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
      <p className="text-red-400 text-sm">
        Failed to load profile. Please try again.
      </p>
    </div>
  );
}

// ─── Per-role sub-pages ───────────────────────────────────────────────────────

function SuperAdminProfile() {
  const token = useAppSelector(selectCurrentToken);

  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(undefined, { skip: !token });

  const [updateProfilePhoto, { isLoading: isUpdatingPhoto }] =
    useUpdateProfilePhotoMutation();

  // Re-fetch once the token is available after initial hydration
  React.useEffect(() => {
    if (token && !isLoading) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isLoading) return <ProfileLoader />;
  if (error || !raw) return <ProfileError />;

  const profile = normaliseSuperAdmin(raw);

  return (
    <>
      <ProfileInfo
        data={profile}
        user="super_admin"
        /**
         * The same PATCH /admin/profile/ endpoint handles both photo uploads
         * and name updates via multipart/form-data. ProfileInfo builds the
         * FormData and calls this function for both operations.
         */
        onUpdatePhoto={(fd: FormData) => updateProfilePhoto(fd).unwrap()}
        isUpdatingPhoto={isUpdatingPhoto}
        onRefresh={refetch}
      />
      <ChangePassword user="super_admin" />
    </>
  );
}

function DistrictManagerProfilePage() {
  const token = useAppSelector(selectCurrentToken);

  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useGetDistrictManagerProfileQuery(undefined, { skip: !token });

  if (isLoading) return <ProfileLoader />;
  if (error || !raw) return <ProfileError />;

  return (
    <>
      <ProfileInfo
        data={normaliseDistrictManager(raw)}
        user="district_manager"
        onRefresh={refetch}
      />
      <ChangePassword user="district_manager" />
    </>
  );
}

function BranchManagerProfilePage() {
  const token = useAppSelector(selectCurrentToken);

  const {
    data: raw,
    isLoading,
    error,
    refetch,
  } = useGetBranchManagerProfileQuery(undefined, { skip: !token });

  if (isLoading) return <ProfileLoader />;
  if (error || !raw) return <ProfileError />;

  return (
    <>
      <ProfileInfo
        data={normaliseBranchManager(raw)}
        user="branch_manager"
        onRefresh={refetch}
      />
      <ChangePassword user="branch_manager" />
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function AdminProfile({ user }: Props) {
  return (
    <div className="space-y-8 p-4 sm:p-6 bg-black min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest italic">
          Manage your account settings and security preferences.
        </p>
      </div>

      <div className="space-y-8">
        {user === "super_admin" && <SuperAdminProfile />}
        {user === "district_manager" && <DistrictManagerProfilePage />}
        {user === "branch_manager" && <BranchManagerProfilePage />}
      </div>
    </div>
  );
}