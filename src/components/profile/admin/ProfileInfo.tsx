/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  MapPin,
  AlertCircle,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  UserRole,
  NormalisedProfile,
} from "@/types/ManagerProfile.type";

import { useAppDispatch } from "@/redux/store";
import { updateUser } from "@/redux/features/auth/authSlice";

// District manager
import { useUpdateDistrictManagerProfileMutation } from "@/redux/services/districtManager/districtManagerProfileApi";
// Branch manager
import { useUpdateBranchManagerProfileMutation } from "@/redux/services/branchManager/profile/branchManagerProfileApi";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  data: NormalisedProfile;
  user: UserRole;
  /**
   * Required for super_admin — used for both photo upload and name update
   * (same PATCH /admin/profile/ endpoint accepts multipart/form-data).
   * Optional for other roles — they call their own mutations directly.
   */
  onUpdatePhoto?: (formData: FormData) => Promise<any>;
  isUpdatingPhoto?: boolean;
  onRefresh: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readOnlyInputClass() {
  return "flex items-center gap-3 bg-black border border-[#968B79]/40 rounded-xl px-4 py-3 opacity-60";
}

function editableInputClass(editing: boolean, hasError?: boolean) {
  return cn(
    "w-full bg-black border rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors",
    hasError
      ? "border-red-500/60 focus:border-red-500"
      : "border-[#968B79]/40 focus:border-[#968B79]/60",
    !editing && "opacity-60 cursor-not-allowed",
  );
}

function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ProfileInfo = ({
  data,
  user,
  onUpdatePhoto,
  isUpdatingPhoto,
  onRefresh,
}: Props) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.full_name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync displayed name when upstream data refreshes (and we're not mid-edit)
  useEffect(() => {
    if (!isEditing) setName(data.full_name);
  }, [data.full_name, isEditing]);

  // ── Per-role update mutations (hooks always called, used conditionally) ──
  const [updateDM, { isLoading: loadingDM }] =
    useUpdateDistrictManagerProfileMutation();
  const [updateBM, { isLoading: loadingBM }] =
    useUpdateBranchManagerProfileMutation();

  const isSaving = loadingDM || loadingBM || !!isUpdatingPhoto;

  // ── Photo upload ──
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("profile_photo", file);

    setApiError(null);
    try {
      if (user === "super_admin") {
        if (onUpdatePhoto) await onUpdatePhoto(fd);
      } else if (user === "district_manager") {
        await updateDM(fd).unwrap();
      } else {
        await updateBM(fd).unwrap();
      }
      onRefresh();
    } catch (err: any) {
      setApiError(
        err?.data?.error || err?.data?.detail || "Failed to update photo",
      );
    }
    // Allow the same file to be re-selected if needed
    e.target.value = "";
  };

  // ── Save name ──
  const handleSave = async () => {
    setApiError(null);
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    setNameError(null);

    const fd = new FormData();
    fd.append("first_name", trimmed);

    try {
      if (user === "super_admin") {
        // Super admin: same PATCH /admin/profile/ endpoint handles name updates
        if (onUpdatePhoto) await onUpdatePhoto(fd);
      } else if (user === "district_manager") {
        await updateDM(fd).unwrap();
      } else {
        await updateBM(fd).unwrap();
      }
      dispatch(updateUser({ username: trimmed }));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      onRefresh();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setApiError(
        err?.data?.error || err?.data?.detail || "Failed to update profile",
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(data.full_name);
    setNameError(null);
    setApiError(null);
  };

  return (
    <div className="bg-[#968B79]/10 border border-[#968B79]/60 rounded-[32px] p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#111] border border-[#968B79]/40 rounded-2xl flex items-center justify-center shrink-0">
            <User size={20} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              Profile Information
            </h3>
            <p className="text-gray-500 text-xs">
              Manage your personal details
            </p>
          </div>
        </div>

        {/* Edit / Save + Cancel */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#968B79]/40 text-gray-400 hover:text-white hover:border-[#968B79]/70 transition-all text-xs font-semibold"
          >
            <Pencil size={13} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#262626] text-gray-400 hover:text-white transition-all text-xs font-semibold disabled:opacity-50"
            >
              <X size={13} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 transition-all text-xs font-bold disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* ── Alerts ── */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 items-start">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm font-medium">{apiError}</p>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-4 h-4 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
          <p className="text-emerald-400 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* ── Avatar ── */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#968B79]/30">
              {data.profile_photo ? (
                <Image
                  src={data.profile_photo}
                  alt={data.full_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                  {data.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Hover overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingPhoto}
              className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              {isUpdatingPhoto ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdatingPhoto}
            className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-40"
          >
            Change Photo
          </button>

          <div className="text-center">
            <p className="text-white font-bold text-sm">{data.full_name}</p>
            <p className="text-gray-500 text-xs">{data.role_display}</p>
          </div>
        </div>

        {/* ── Fields ── */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name — editable */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing || isSaving}
              placeholder="Full name"
              className={editableInputClass(isEditing, !!nameError)}
            />
            {nameError && (
              <p className="text-red-400 text-[11px] ml-1">{nameError}</p>
            )}
          </div>

          {/* Username — read-only */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Username
            </label>
            <div className={readOnlyInputClass()}>
              <span className="text-gray-400 text-sm">
                {data.username ? `@${data.username}` : "—"}
              </span>
            </div>
          </div>

          {/* Email — read-only */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Email
            </label>
            <div className={readOnlyInputClass()}>
              <Mail size={14} className="text-gray-500 shrink-0" />
              <span className="text-gray-200 text-sm truncate">
                {data.email}
              </span>
            </div>
          </div>

          {/* Role — read-only */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Role
            </label>
            <div className={readOnlyInputClass()}>
              <Shield size={14} className="text-gray-500 shrink-0" />
              <span className="text-gray-200 text-sm">{data.role_display}</span>
            </div>
          </div>

          {/* Date Joined — read-only */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Date Joined
            </label>
            <div className={readOnlyInputClass()}>
              <Calendar size={14} className="text-gray-500 shrink-0" />
              <span className="text-gray-200 text-sm">
                {formatDate(data.date_joined)}
              </span>
            </div>
          </div>

          {/* Location — branch manager only */}
          {data.location && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Assigned Location
              </label>
              <div className={cn(readOnlyInputClass(), "items-start")}>
                <MapPin
                  size={14}
                  className="text-gray-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-gray-200 text-sm font-semibold">
                    {data.location.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {data.location.street_address}, {data.location.city_state}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};