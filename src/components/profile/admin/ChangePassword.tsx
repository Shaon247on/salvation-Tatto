/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, Pencil, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

import { UserRole } from "@/types/ManagerProfile.type";

// Super admin
import { useChangePasswordMutation } from "@/redux/services/admin/profile/profileApi";
// District manager
import { useChangeDistrictManagerPasswordMutation } from "@/redux/services/districtManager/districtManagerProfileApi";
// Branch manager
import { useChangeBranchManagerPasswordMutation } from "@/redux/services/branchManager/profile/branchManagerProfileApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  user: UserRole;
}

interface FormState {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const EMPTY_FORM: FormState = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ChangePassword = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ── Per-role mutation hooks ──
  const [changePasswordSuperAdmin, { isLoading: loadingSA }] =
    useChangePasswordMutation();
  const [changePasswordDM, { isLoading: loadingDM }] =
    useChangeDistrictManagerPasswordMutation();
  const [changePasswordBM, { isLoading: loadingBM }] =
    useChangeBranchManagerPasswordMutation();

  const isChanging = loadingSA || loadingDM || loadingBM;

  // ── Helpers ──
  const validate = (): boolean => {
    const errors: Partial<FormState> = {};

    if (!formData.current_password.trim())
      errors.current_password = "Current password is required";
    if (!formData.new_password.trim())
      errors.new_password = "New password is required";
    else if (formData.new_password.length < 8)
      errors.new_password = "Password must be at least 8 characters long";
    else if (formData.current_password === formData.new_password)
      errors.new_password =
        "New password must be different from current password";
    if (!formData.confirm_password.trim())
      errors.confirm_password = "Please confirm your new password";
    else if (formData.new_password !== formData.confirm_password)
      errors.confirm_password = "Passwords do not match";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setApiError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setApiError(null);
    setSuccess(null);
    if (!validate()) return;

    const payload = {
      current_password: formData.current_password,
      new_password: formData.new_password,
      confirm_password: formData.confirm_password,
    };

    try {
      if (user === "super_admin") {
        await changePasswordSuperAdmin(payload).unwrap();
      } else if (user === "district_manager") {
        await changePasswordDM(payload).unwrap();
      } else {
        await changePasswordBM(payload).unwrap();
      }

      setSuccess("Password updated successfully!");
      setFormData(EMPTY_FORM);
      setFieldErrors({});
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setApiError(
        err?.data?.error ||
          err?.data?.detail ||
          err?.data?.current_password?.[0] ||
          err?.data?.non_field_errors?.[0] ||
          "Failed to change password",
      );
    }
  };

  // ── Field helper ──
  const inputClass = (field: keyof FormState) =>
    cn(
      "w-full bg-black border rounded-xl p-4 pr-12 text-sm text-white outline-none transition-colors",
      fieldErrors[field]
        ? "border-red-500/60 focus:border-red-500"
        : "border-[#968B79]/40 focus:border-[#968B79]/60",
      !isEditing && "opacity-60 cursor-not-allowed",
    );

  const toggle = (field: keyof typeof showPass) =>
    setShowPass((p) => ({ ...p, [field]: !p[field] }));

  return (
    <div className="bg-[#968B79]/10 border border-[#968B79]/60 rounded-[32px] p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#111] border border-[#968B79]/40 rounded-2xl flex items-center justify-center shrink-0">
            <Lock size={20} className="text-gray-500" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Change Password</h3>
            <p className="text-gray-500 text-xs">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        {/* Edit / Cancel+Save buttons */}
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
              disabled={isChanging}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#262626] text-gray-400 hover:text-white transition-all text-xs font-semibold disabled:opacity-50"
            >
              <X size={13} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isChanging}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 transition-all text-xs font-bold disabled:opacity-50"
            >
              {isChanging ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {isChanging ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* API Error */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 items-start">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm font-medium">{apiError}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-4 h-4 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
          <p className="text-emerald-400 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-5 max-w-4xl">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPass.current ? "text" : "password"}
              placeholder={isEditing ? "Enter current password" : "••••••••"}
              value={formData.current_password}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  current_password: e.target.value,
                }))
              }
              disabled={!isEditing || isChanging}
              className={inputClass("current_password")}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => toggle("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
          {fieldErrors.current_password && (
            <p className="text-red-400 text-[11px] ml-1">
              {fieldErrors.current_password}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPass.new ? "text" : "password"}
              placeholder={isEditing ? "Enter new password" : "••••••••"}
              value={formData.new_password}
              onChange={(e) =>
                setFormData((f) => ({ ...f, new_password: e.target.value }))
              }
              disabled={!isEditing || isChanging}
              className={inputClass("new_password")}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => toggle("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
          {fieldErrors.new_password ? (
            <p className="text-red-400 text-[11px] ml-1">
              {fieldErrors.new_password}
            </p>
          ) : (
            <p className="text-[10px] text-gray-600 font-medium ml-1">
              Must be at least 8 characters long
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPass.confirm ? "text" : "password"}
              placeholder={isEditing ? "Confirm new password" : "••••••••"}
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  confirm_password: e.target.value,
                }))
              }
              disabled={!isEditing || isChanging}
              className={inputClass("confirm_password")}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => toggle("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
          {fieldErrors.confirm_password && (
            <p className="text-red-400 text-[11px] ml-1">
              {fieldErrors.confirm_password}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};