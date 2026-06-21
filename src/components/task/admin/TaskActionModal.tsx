// /* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, RotateCcw, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";
import { useGetEmployeesForDropdownQuery } from "@/redux/services/admin/tasks/taskApi";
import { EmployeeMultiSelect } from "./EmployeeMultiSelect";

interface TaskActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null; // Pass task data for Edit, null for Create
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export const TaskActionModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
}: TaskActionModalProps) => {
  const isEditMode = !!initialData;

  // Get token from Redux
  const token = useAppSelector(selectCurrentToken);

  // Fetch active locations from API - skip if no token
  const { data: locationsResponse } = useGetLocationsQuery(undefined, {
    skip: !token,
  });

  const activeLocations =
    locationsResponse?.locations?.filter((loc) => loc.status === "active") ||
    [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    locationId: 0,
    assignedToIds: [] as number[],
    dueDate: "",
    isRecurring: false,
    frequency: "daily",
    requirePhoto: false,
  });

  // --- CRITICAL FIX: Sync initialData to local state when modal opens ---
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.taskName || "",
        description: initialData?.description || "",
        location: initialData?.location || "",
        locationId: initialData?.locationId || 0,
        assignedToIds: initialData?.assignedToIds || [],
        dueDate: initialData?.dueDate || "",
        isRecurring: initialData?.isRecurring || false,
        frequency: initialData?.frequency || "daily",
        requirePhoto: initialData?.requirePhoto || false,
      });
    }
  }, [initialData, isOpen]);

  // Fetch employees for selected location using locationId
  const { data: employeesResponse, isLoading: isLoadingEmployees } =
    useGetEmployeesForDropdownQuery(formData.locationId, {
      skip: !formData.locationId || !isOpen,
    });

  const employees = employeesResponse?.employees || [];

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }
    if (!formData.locationId) {
      alert("Location is required");
      return;
    }
    if (formData.assignedToIds.length === 0) {
      alert("At least one employee must be assigned");
      return;
    }
    if (!formData.dueDate) {
      alert("Due date is required");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D] sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditMode ? "Edit Task" : "Create Task"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {isEditMode
                ? "Update task details and assignments"
                : "Create a new task assignment"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-white transition-colors bg-[#1A1A1A] rounded-full disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Task Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Sanitize Tattoo Stations"
              disabled={isLoading}
              className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white focus:border-[#404040] outline-none transition-all disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what needs to be done..."
              disabled={isLoading}
              className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white min-h-25 resize-none outline-none focus:border-[#404040] disabled:opacity-50"
            />
          </div>

          {/* Location Select */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Select Store *
            </label>
            <div className="relative">
              <select
                value={formData.location}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedLoc = activeLocations.find(
                    (loc) => loc.name === selectedName,
                  );
                  setFormData({
                    ...formData,
                    location: selectedName,
                    locationId: selectedLoc?.id || 0,
                    assignedToIds: [],
                  });
                }}
                disabled={isLoading}
                className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white appearance-none outline-none cursor-pointer pr-10 disabled:opacity-50"
              >
                <option value="">Select a location...</option>
                {activeLocations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              disabled={isLoading}
              className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#404040] scheme-dark disabled:opacity-50"
            />
          </div>

          {/* Assign To - multi select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1 flex items-center justify-between">
              <span>Assign To *</span>
              {formData.assignedToIds.length > 0 && (
                <span className="text-[#c4a47c]">
                  {formData.assignedToIds.length} selected
                </span>
              )}
            </label>
            <EmployeeMultiSelect
              employees={employees}
              selectedIds={formData.assignedToIds}
              onChange={(ids) =>
                setFormData({ ...formData, assignedToIds: ids })
              }
              isLoading={isLoadingEmployees}
              disabled={isLoading || !formData.locationId}
            />
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 pt-2">
            {/* Recurring Task */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                formData.isRecurring
                  ? "bg-white/3 border-white/10"
                  : "bg-black border-[#262626]",
              )}
              onClick={() =>
                !isLoading &&
                setFormData({ ...formData, isRecurring: !formData.isRecurring })
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                  <RotateCcw size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Recurring Task</p>
                  <p className="text-xs text-gray-500">Repeat automatically</p>
                </div>
              </div>
              <div
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300",
                  formData.isRecurring ? "bg-emerald-500" : "bg-[#262626]",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-sm",
                    formData.isRecurring
                      ? "left-7 bg-black"
                      : "left-1 bg-gray-500",
                  )}
                />
              </div>
            </div>

            {/* Frequency Selection */}
            {formData.isRecurring && (
              <div className="grid grid-cols-3 gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {["daily", "weekly", "monthly"].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, frequency: freq as any })
                    }
                    className={cn(
                      "py-3 rounded-xl text-xs font-bold capitalize transition-all border",
                      formData.frequency === freq
                        ? "bg-[#A39171] text-white border-[#A39171]"
                        : "bg-transparent text-gray-500 border-[#262626]",
                    )}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            )}

            {/* Photo Verification */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                formData.requirePhoto
                  ? "bg-white/3 border-white/10"
                  : "bg-black border-[#262626]",
              )}
              onClick={() =>
                !isLoading &&
                setFormData({
                  ...formData,
                  requirePhoto: !formData.requirePhoto,
                })
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                  <Camera size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Photo Verification
                  </p>
                  <p className="text-xs text-gray-500">Must submit photo</p>
                </div>
              </div>
              <div
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-300",
                  formData.requirePhoto ? "bg-white" : "bg-[#262626]",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-sm",
                    formData.requirePhoto
                      ? "left-7 bg-black"
                      : "left-1 bg-gray-500",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1A1A1A] flex gap-3 bg-[#0D0D0D]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-4 border border-[#262626] text-white rounded-2xl font-bold hover:bg-[#1A1A1A] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : isEditMode
                ? "Update Task"
                : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};