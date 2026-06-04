"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  Calendar as CalendarIcon,
  ChevronDown,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";

type ApiScheduleItem = {
  id?: number;
  day: string;
  is_active: boolean;
  start_time: string | null;
  end_time: string | null;
};

type UserData = {
  apiData?: {
    email?: string;
    role?: string;
    location?: number;
    user_status?: string;
    work_schedules?: ApiScheduleItem[];
  };
  name?: string;
  role?: string;
  location?: string;
};

type ScheduleRow = {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
};

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserData | null;
  onSave: (data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    location: string | number;
    status: string;
    schedule: ScheduleRow[];
  }) => Promise<Record<string, string> | undefined>;
  isLoading?: boolean;
}

// const DEFAULT_SCHEDULE = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
//   (day) => ({
//     day,
//     enabled: true,
//     start: "09:00",
//     end: "20:00",
//   }),
// );

const TIME_OPTIONS = [
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
];

const ROLE_OPTIONS = [
  { value: "district_manager", label: "District Manager" },
  { value: "branch_manager", label: "Store Manager" },
  { value: "tattoo_artist", label: "Tattoo Artist" },
  { value: "body_piercer", label: "Body Piercer" },
  { value: "staff", label: "Staff" },
  { value: "clock_in_user", label: "Clock In User" },
];

export const UserActionModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
}: UserActionModalProps) => {
  const token = useAppSelector(selectCurrentToken);
  const { data: locationsResponse } = useGetLocationsQuery(undefined, {
    skip: !token,
  });
  const isEditMode = !!initialData;

  const activeLocations =
    (locationsResponse?.locations || []) as Array<{
      id: number;
      name: string;
      status: string;
    }>;

  const timeStringToMinutes = (t?: string | null) => {
    if (!t) return 0;
    const ampm = t.match(/(AM|PM)/i);
    if (ampm) {
      const m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
      if (!m) return 0;
      let hour = Number(m[1]);
      const minute = m[2] ? Number(m[2]) : 0;
      const period = m[3].toUpperCase();
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    }
    const parts = t.split(":").map(Number);
    if (parts.length >= 2) return parts[0] * 60 + parts[1];
    const num = Number(t);
    return isNaN(num) ? 0 : num * 60;
  };

  const to12HourDisplay = (val?: string | null) => {
    if (!val) return "9 AM";
    // strip seconds if present
    const parts = val.split(":");
    const hour = Number(parts[0]);
    const minute = parts[1] ? Number(parts[1]) : 0;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return minute ? `${displayHour}:${String(minute).padStart(2, "0")} ${period}` : `${displayHour} ${period}`;
  };

  const getInitialSchedule = (apiSchedules: ApiScheduleItem[] = []) =>
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
      const found = apiSchedules.find((s) => s.day === day.toLowerCase());
      return {
        day,
        enabled: found ? found.is_active : true,
        start: found ? to12HourDisplay(found.start_time) : "9 AM",
        end: found ? to12HourDisplay(found.end_time) : "8 PM",
      };
    });

  const getInitialFormData = () => ({
    fullName: initialData?.name || "",
    email: initialData?.apiData?.email || "",
    password: "",
    role: initialData?.apiData?.role || initialData?.role || "",
    location: initialData?.apiData?.location || initialData?.location || "",
    status: initialData?.apiData?.user_status || "active",
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [schedule, setSchedule] = useState<ScheduleRow[]>(() =>
    getInitialSchedule(initialData?.apiData?.work_schedules),
  );

  const [activePicker, setActivePicker] = useState<{
    index: number;
    field: "start" | "end";
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scheduleErrors, setScheduleErrors] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const showSchedule =
    formData.role !== "" &&
    formData.role !== "clock_in_user" &&
    (typeof formData.location === "number" || formData.location !== "");

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    setSchedule(newSchedule);
    // clear or validate error for this row
    setScheduleErrors((err) => {
      const next = { ...err };
      if (!newSchedule[index].enabled) {
        delete next[index];
      } else {
        const sMin = timeStringToMinutes(newSchedule[index].start);
        const eMin = timeStringToMinutes(newSchedule[index].end);
        if (sMin >= eMin) next[index] = "Start time must be before end time";
        else delete next[index];
      }
      return next;
    });
  };

  const handleTimeChange = (
    index: number,
    field: "start" | "end",
    newVal: string,
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = newVal;
    setSchedule(newSchedule);
    setActivePicker(null);

    // validate this row immediately
    const start = field === "start" ? newVal : newSchedule[index].start;
    const end = field === "end" ? newVal : newSchedule[index].end;
    const startMin = timeStringToMinutes(start);
    const endMin = timeStringToMinutes(end);
    setScheduleErrors((err) => {
      const next = { ...err };
      if (newSchedule[index].enabled && startMin >= endMin) {
        next[index] = "Start time must be before end time";
      } else {
        delete next[index];
      }
      return next;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!isEditMode && !formData.password)
      newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.location) newErrors.location = "Location is required";
    // schedule validation
    const schedErrors: Record<number, string> = {};
    schedule.forEach((row, idx) => {
      if (!row.enabled) return;
      const sMin = timeStringToMinutes(row.start);
      const eMin = timeStringToMinutes(row.end);
      if (sMin >= eMin) schedErrors[idx] = "Start time must be before end time";
    });

    setScheduleErrors(schedErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(schedErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const serverErrors = await onSave({ ...formData, schedule });
    if (serverErrors && typeof serverErrors === "object") {
      // map API field errors to local form fields
      const nextErrors: Record<string, string> = {};
      if (serverErrors.email) nextErrors.email = serverErrors.email;
      // backend might return username error when email is duplicate
      if (serverErrors.username && !nextErrors.email)
        nextErrors.email = serverErrors.username;
      if (serverErrors.non_field_errors)
        nextErrors.general = serverErrors.non_field_errors;
      setErrors((e) => ({ ...e, ...nextErrors }));
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D] sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isEditMode ? "Edit User Profile" : "Create New User"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {errors.general && (
            <div className="p-3 rounded-md bg-red-900/40 text-red-200 text-sm">
              {errors.general}
            </div>
          )}
          {/* Status Toggle - Super Admin Only Logic */}
          {isEditMode && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Account Status
              </label>
              <div className="flex gap-2 p-1 bg-black border border-[#262626] rounded-2xl">
                {["active", "suspended"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                      formData.status === s
                        ? "bg-white text-black"
                        : "text-gray-500 hover:text-white",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={cn(
                  "w-full bg-black border rounded-xl p-3.5 text-sm text-white focus:outline-none",
                  errors.fullName ? "border-red-500" : "border-[#262626]",
                )}
                placeholder="Jordan Smith"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={cn(
                  "w-full bg-black border rounded-xl p-3.5 text-sm text-white focus:outline-none",
                  errors.email ? "border-red-500" : "border-[#262626]",
                )}
                placeholder="jsmith@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                {isEditMode ? "New Password" : "Password *"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={cn(
                    "w-full bg-black border rounded-xl p-3.5 pl-10 text-sm text-white focus:outline-none",
                    errors.password ? "border-red-500" : "border-[#262626]",
                  )}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                  Role *
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className={cn(
                      "w-full bg-black border rounded-xl p-3.5 text-sm text-white outline-none appearance-none cursor-pointer transition-colors",
                      errors.role ? "border-red-500" : "border-[#262626]",
                    )}
                  >
                    <option value="">Select Role</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-400 text-xs mt-1">{errors.role}</p>
                  )}
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                  Location Assignment *
                </label>
                <div className="relative">
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: parseInt(e.target.value),
                      })
                    }
                    className={cn(
                      "w-full bg-black border rounded-xl p-3.5 text-sm text-white outline-none appearance-none cursor-pointer transition-colors",
                      errors.location ? "border-red-500" : "border-[#262626]",
                    )}
                  >
                    <option value="">Select Location</option>
                    {activeLocations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="text-red-400 text-xs mt-1">{errors.location}</p>
                  )}
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Working Schedule - Updated Design based on image */}
          {showSchedule && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarIcon size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest ml-1">
                  Weekly Working Schedule
                </span>
              </div>
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={item.day}
                    className={cn(
                      "flex justify-between gap-2 p-3.5 border rounded-[20px] transition-all",
                      item.enabled
                        ? "bg-black border-[#968B79]/60"
                        : "bg-[#0A0A0A] border-[#1A1A1A] opacity-50",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          item.enabled ? "bg-[#968B79]" : "bg-[#262626]",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            item.enabled ? "translate-x-6" : "translate-x-1",
                          )}
                        />
                      </button>
                      <span className="text-sm font-bold text-gray-300 w-8">
                        {item.day}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-3",
                        !item.enabled && "pointer-events-none opacity-20",
                      )}
                    >
                      {/* Start Time Box */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActivePicker({ index, field: "start" })
                          }
                          className="bg-[#0D0D0D] border border-[#262626] px-4 py-2.5 rounded-[14px] text-[0.6rem] md:text-xs font-medium text-white flex items-center gap-2 min-w-20 md:min-w-25 hover:border-[#404040] transition-colors"
                        >
                          <Clock size={14} className="text-gray-500" />
                          {item.start}
                        </button>
                        {activePicker?.index === index &&
                          activePicker?.field === "start" && (
                            <TimeDropdown
                              onSelect={(val) =>
                                handleTimeChange(index, "start", val)
                              }
                              onClose={() => setActivePicker(null)}
                            />
                          )}
                      </div>

                      {/* End Time Box */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActivePicker({ index, field: "end" })
                          }
                          className="bg-[#0D0D0D] border border-[#262626] px-4 py-2.5 rounded-[14px] text-[0.6rem] md:text-xs font-medium text-white flex items-center gap-2 min-w-20 md:min-w-25 hover:border-[#404040] transition-colors"
                        >
                          <Clock size={14} className="text-gray-500" />
                          {item.end}
                        </button>
                        {activePicker?.index === index &&
                          activePicker?.field === "end" && (
                            <TimeDropdown
                              onSelect={(val) =>
                                handleTimeChange(index, "end", val)
                              }
                              onClose={() => setActivePicker(null)}
                            />
                          )}
                      </div>
                    </div>

                    {scheduleErrors[index] && (
                      <div className="text-red-400 text-xs mt-2">
                        {scheduleErrors[index]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#1A1A1A] flex gap-3 bg-[#0D0D0D]">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 border border-[#262626] text-white rounded-2xl font-bold hover:bg-[#1A1A1A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || Object.keys(scheduleErrors).length > 0}
            className="flex-1 py-3.5 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : isEditMode
                ? "Update User"
                : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TimeDropdown = ({
  onSelect,
  onClose,
}: {
  onSelect: (v: string) => void;
  onClose: () => void;
}) => (
  <>
    <div className="fixed inset-0 z-110" onClick={onClose} />
    <div className="absolute right-0 top-full mt-2 w-28 max-h-48 overflow-y-auto bg-[#111] border border-[#262626] rounded-xl shadow-2xl z-120 custom-scrollbar">
      {TIME_OPTIONS.map((t) => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className="w-full text-left px-4 py-2 text-[10px] text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
        >
          {t}
        </button>
      ))}
    </div>
  </>
);
