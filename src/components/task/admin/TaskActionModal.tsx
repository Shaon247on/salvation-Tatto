/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, RotateCcw, Camera, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken, selectUserRole } from "@/redux/features/auth/authSlice";
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";
import {
  useGetEmployeesForDropdownQuery,
  useGetLocationsByDistrictManagerQuery,
  useGetEmployeesByLocationByDistrictManagerQuery,
} from "@/redux/services/admin/tasks/taskApi";
import { EmployeeMultiSelect } from "./EmployeeMultiSelect";
import { useGetManagerEmployeesByBranchManagerQuery } from "@/redux/services/branchManager/task/theBranchManagerTaskApi";
import { RecurrencePicker, RecurrenceValue, describeRecurrence } from "./RecurrencePicker";

interface TaskActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null; // Pass task data for Edit, null for Create
  onSave: (data: any) => void;
  isLoading?: boolean;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const emptyRecurrence = (): RecurrenceValue => ({
  startDate: todayISO(),
  isRecurring: false,
  frequency: "daily",
  recurrence: null,
});

export const TaskActionModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
}: TaskActionModalProps) => {
  const isEditMode = !!initialData;
  const token = useAppSelector(selectCurrentToken);
  const userRole = useAppSelector(selectUserRole);

  const isDistrictManager = userRole === "district_manager";
  const isBranchManager = userRole === "branch_manager";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    locationId: 0,
    assignedToIds: [] as number[],
    requirePhoto: false,
  });

  // Start date + recurrence now live in their own value object, owned by
  // RecurrencePicker, instead of separate dueDate / frequency fields.
  const [recurrenceValue, setRecurrenceValue] = useState<RecurrenceValue>(emptyRecurrence());
  const [isRecurrencePickerOpen, setIsRecurrencePickerOpen] = useState(false);

  const {
    data: dmLocationsResponse,
    isLoading: dmLocationsLoading,
  } = useGetLocationsByDistrictManagerQuery(undefined, {
    skip: !isDistrictManager || !token,
  });

  const {
    data: adminLocationsResponse,
    isLoading: adminLocationsLoading,
  } = useGetLocationsQuery(undefined, {
    skip: isDistrictManager || isBranchManager || !token,
  });

  const locationsResponse = isDistrictManager ? dmLocationsResponse : adminLocationsResponse;
  const locationsLoading = isDistrictManager ? dmLocationsLoading : adminLocationsLoading;

  const activeLocations =
    locationsResponse?.locations?.filter((loc: any) => loc.status === "active" || !loc.status) || [];

  // --- Sync initialData to local state when modal opens ---
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.taskName || "",
        description: initialData?.description || "",
        location: initialData?.location || "",
        locationId: initialData?.locationId || 0,
        assignedToIds: Array.isArray(initialData?.assignedToIds)
          ? initialData.assignedToIds
              .map((a: any) => (typeof a === "number" ? a : a?.id ? Number(a.id) : NaN))
              .filter((n: number) => !Number.isNaN(n))
          : initialData?.assignedToIds
            ? [
                typeof initialData.assignedToIds === "number"
                  ? initialData.assignedToIds
                  : initialData.assignedToIds.id
                    ? Number(initialData.assignedToIds.id)
                    : NaN,
              ].filter((n) => !Number.isNaN(n))
            : [],
        requirePhoto: initialData?.requirePhoto || false,
      });

      // initialData carries either the legacy flat shape (dueDate/frequency)
      // or the new shape (startDate/recurrence) depending on what the list
      // page mapped from the API response — handle both. The live API still
      // returns the date under `due_date` (mapped to `dueDate` by the DTO),
      // never `startDate`, so dueDate must come first in the fallback chain.
      const isRecurring = initialData?.isRecurring || false;
      const startDate = initialData?.dueDate || initialData?.startDate || todayISO();
      const apiFrequency = (initialData?.frequency && initialData.frequency !== "none"
        ? initialData.frequency
        : initialData?.recurrence?.frequency || "daily") as any;

      // Some existing tasks are recurring but were saved before the
      // recurrence object existed, so `recurrence` comes back as null even
      // though `is_recurring` is true and `frequency` is set (e.g. "daily").
      // In that case fall back to a sane default recurrence (interval 1,
      // anchored on the start date) so the picker still opens correctly.
      const apiRecurrence = initialData?.recurrence;
      const parsedStart = (() => {
        const [y, m, d] = startDate.split("-").map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
      })();

      setRecurrenceValue({
        startDate,
        isRecurring,
        frequency: isRecurring ? apiFrequency : "daily",
        recurrence: isRecurring
          ? {
              frequency: apiFrequency,
              interval: apiRecurrence?.interval || 1,
              day_of_month:
                apiRecurrence?.day_of_month ?? (apiFrequency === "monthly" ? parsedStart.getDate() : undefined),
              weekdays: apiRecurrence?.weekdays ?? undefined,
            }
          : null,
      });
    }
  }, [initialData, isOpen]);

  const {
    data: bmEmployeesResponse,
    isLoading: bmEmployeesLoading,
  } = useGetManagerEmployeesByBranchManagerQuery(undefined, {
    skip: !isBranchManager || !isOpen,
  });

  const {
    data: dmEmployeesResponse,
    isLoading: dmEmployeesLoading,
  } = useGetEmployeesByLocationByDistrictManagerQuery(formData.locationId, {
    skip: !isDistrictManager || !formData.locationId || !isOpen,
  });

  const {
    data: adminEmployeesResponse,
    isLoading: adminEmployeesLoading,
  } = useGetEmployeesForDropdownQuery(formData.locationId, {
    skip: isDistrictManager || isBranchManager || !formData.locationId || !isOpen,
  });

  let employeesResponse;
  let isLoadingEmployees;

  if (isBranchManager) {
    employeesResponse = bmEmployeesResponse;
    isLoadingEmployees = bmEmployeesLoading;
  } else if (isDistrictManager) {
    employeesResponse = dmEmployeesResponse;
    isLoadingEmployees = dmEmployeesLoading;
  } else {
    employeesResponse = adminEmployeesResponse;
    isLoadingEmployees = adminEmployeesLoading;
  }

  const employees = employeesResponse?.employees || [];

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }
    if (!isBranchManager && !formData.locationId) {
      alert("Location is required");
      return;
    }
    if (formData.assignedToIds.length === 0) {
      alert("At least one employee must be assigned");
      return;
    }
    if (!recurrenceValue.startDate) {
      alert("Start date is required");
      return;
    }

    // Frequency is always attached to the payload, recurring or not —
    // "none" when the task doesn't repeat, otherwise the resolved
    // daily/weekly/monthly/yearly value.
    onSave({
      ...formData,
      startDate: recurrenceValue.startDate,
      isRecurring: recurrenceValue.isRecurring,
      frequency: recurrenceValue.isRecurring ? recurrenceValue.frequency : "none",
      recurrence: recurrenceValue.isRecurring ? recurrenceValue.recurrence : null,
    });
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D] sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditMode ? "Edit Task" : "Create Task"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {isEditMode ? "Update task details and assignments" : "Create a new task assignment"}
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what needs to be done..."
              disabled={isLoading}
              className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white min-h-25 resize-none outline-none focus:border-[#404040] disabled:opacity-50"
            />
          </div>

          {/* Location Select - Only show for super admin and district manager */}
          {!isBranchManager && (
            <div className="space-y-1.5 relative">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Select Store *
              </label>
              <div className="relative">
                <select
                  value={formData.location}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const selectedLoc = activeLocations.find((loc: any) => loc.name === selectedName);
                    setFormData({
                      ...formData,
                      location: selectedName,
                      locationId: selectedLoc?.id || 0,
                      assignedToIds: [],
                    });
                  }}
                  disabled={isLoading || locationsLoading}
                  className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white appearance-none outline-none cursor-pointer pr-10 disabled:opacity-50"
                >
                  <option value="">Select a location...</option>
                  {activeLocations.map((location: any) => (
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
          )}

          {/* For Branch Manager - Show location as read-only */}
          {isBranchManager && initialData?.location && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Location
              </label>
              <div className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-gray-400">
                {initialData.location}
              </div>
            </div>
          )}

          {/* Start date / recurrence trigger — replaces the old Due Date input.
              Opens RecurrencePicker as a popover, the same pattern used by
              EmployeeMultiSelect. */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Start Date *
            </label>
            <button
              type="button"
              onClick={() => !isLoading && setIsRecurrencePickerOpen((v) => !v)}
              disabled={isLoading}
              className="w-full flex items-center justify-between bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#404040] disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <CalendarClock size={15} className="text-gray-500" />
                {describeRecurrence(recurrenceValue)}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            <RecurrencePicker
              isOpen={isRecurrencePickerOpen}
              onClose={() => setIsRecurrencePickerOpen(false)}
              value={recurrenceValue}
              onChange={(next) => setRecurrenceValue(next)}
            />
          </div>

          {/* Assign To - multi select */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1 flex items-center justify-between">
              <span>Assign To *</span>
              {formData.assignedToIds.length > 0 && (
                <span className="text-[#c4a47c]">{formData.assignedToIds.length} selected</span>
              )}
            </label>
            <EmployeeMultiSelect
              employees={employees}
              selectedIds={formData.assignedToIds}
              onChange={(ids) => setFormData({ ...formData, assignedToIds: ids })}
              isLoading={isLoadingEmployees}
              disabled={isLoading || (!isBranchManager && !formData.locationId)}
              locationId={formData.locationId}
            />
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 pt-2">
            {/* Recurring Task */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                recurrenceValue.isRecurring ? "bg-white/3 border-white/10" : "bg-black border-[#262626]",
              )}
              onClick={() =>
                !isLoading &&
                setRecurrenceValue((prev) => {
                  const nextIsRecurring = !prev.isRecurring;
                  if (!nextIsRecurring) {
                    return { ...prev, isRecurring: false, recurrence: null };
                  }
                  // Turning recurrence on: default to daily, interval 1,
                  // anchored on the currently selected start date.
                  return {
                    ...prev,
                    isRecurring: true,
                    frequency: "daily",
                    recurrence: { frequency: "daily", interval: 1 },
                  };
                })
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
                  recurrenceValue.isRecurring ? "bg-emerald-500" : "bg-[#262626]",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-sm",
                    recurrenceValue.isRecurring ? "left-7 bg-black" : "left-1 bg-gray-500",
                  )}
                />
              </div>
            </div>

            {/* When recurring is on, surface the recurrence summary + a quick
                edit affordance instead of the old 3-button frequency grid —
                full editing happens in RecurrencePicker above. */}
            {recurrenceValue.isRecurring && (
              <button
                type="button"
                onClick={() => setIsRecurrencePickerOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#262626] bg-black animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <span className="text-xs text-gray-400">{describeRecurrence(recurrenceValue)}</span>
                <span className="text-[10px] font-bold text-[#A39171] uppercase tracking-wide">Edit</span>
              </button>
            )}

            {/* Photo Verification */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                formData.requirePhoto ? "bg-white/3 border-white/10" : "bg-black border-[#262626]",
              )}
              onClick={() =>
                !isLoading && setFormData({ ...formData, requirePhoto: !formData.requirePhoto })
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center border border-white/5">
                  <Camera size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Photo Verification</p>
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
                    formData.requirePhoto ? "left-7 bg-black" : "left-1 bg-gray-500",
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
            {isLoading ? "Processing..." : isEditMode ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};