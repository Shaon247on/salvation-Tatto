/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { X, ChevronDown, MapPin, Building2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null; // Pass location object to Edit, null to Create
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export const LocationActionModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
}: LocationModalProps) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    studioName: initialData?.name || "",
    streetAddress:
      initialData?.address || initialData?.apiData?.street_address || "",
    cityState: initialData?.city || initialData?.apiData?.city_state || "",
    status: initialData?.status || "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studioName.trim()) {
      newErrors.studioName = "Studio name is required";
    }
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }
    if (!formData.cityState.trim()) {
      newErrors.cityState = "City, State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D]">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isEditMode ? "Edit Location" : "Create New Location"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Studio Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.studioName}
                onChange={(e) =>
                  setFormData({ ...formData, studioName: e.target.value })
                }
                placeholder="e.g. SALVATION — Downtown"
                className={cn(
                  "w-full bg-black border rounded-xl p-3.5 pl-10 text-sm text-white focus:outline-none transition-colors",
                  errors.studioName
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#262626] focus:border-[#404040]",
                )}
                disabled={isLoading}
              />
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            </div>
            {errors.studioName && (
              <p className="text-red-500 text-xs ml-1">{errors.studioName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Street Address *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) =>
                  setFormData({ ...formData, streetAddress: e.target.value })
                }
                placeholder="e.g. 142 N Michigan Ave"
                className={cn(
                  "w-full bg-black border rounded-xl p-3.5 pl-10 text-sm text-white focus:outline-none transition-colors",
                  errors.streetAddress
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#262626] focus:border-[#404040]",
                )}
                disabled={isLoading}
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            </div>
            {errors.streetAddress && (
              <p className="text-red-500 text-xs ml-1">
                {errors.streetAddress}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              City, State *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cityState}
                onChange={(e) =>
                  setFormData({ ...formData, cityState: e.target.value })
                }
                placeholder="e.g. Chicago, IL"
                className={cn(
                  "w-full bg-black border rounded-xl p-3.5 pl-10 text-sm text-white focus:outline-none transition-colors",
                  errors.cityState
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#262626] focus:border-[#404040]",
                )}
                disabled={isLoading}
              />
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            </div>
            {errors.cityState && (
              <p className="text-red-500 text-xs ml-1">{errors.cityState}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Status
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white outline-none appearance-none cursor-pointer focus:border-[#404040] transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1A1A1A] flex gap-3 bg-[#0D0D0D]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border border-[#262626] text-white rounded-2xl font-bold hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-3 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : isEditMode
                ? "Update Location"
                : "Create Location"}
          </button>
        </div>
      </div>
    </div>
  );
};
