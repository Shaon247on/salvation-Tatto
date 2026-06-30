/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

// Mirrors the API body exactly:
// {
//   start_date: "2026-07-15",
//   recurrence: { frequency: "monthly", interval: 1, day_of_month: 15 },
// }
export interface RecurrenceValue {
  startDate: string; // "YYYY-MM-DD"
  isRecurring: boolean;
  frequency: RecurrenceFrequency; // top-level flat frequency, mirrors recurrence.frequency
  recurrence: {
    frequency: RecurrenceFrequency;
    interval: number;
    day_of_month?: number;
    weekdays?: string[];
  } | null;
}

interface RecurrencePickerProps {
  isOpen: boolean;
  onClose: () => void;
  value: RecurrenceValue;
  onChange: (value: RecurrenceValue) => void;
}

/* ------------------------------------------------------------------ */
/*  Date helpers — all operate on local-time Y/M/D, never on ISO       */
/*  strings, so there are no timezone-shift bugs.                      */
/* ------------------------------------------------------------------ */

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAY_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const BYDAY = ["SU","MO","TU","WE","TH","FR","SA"];

function parseLocalDate(iso: string): Date {
  // "YYYY-MM-DD" -> local Date at midnight, never via `new Date(iso)`
  // which parses as UTC and can shift the day depending on timezone.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toLocalISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const RecurrencePicker = ({ isOpen, onClose, value, onChange }: RecurrencePickerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const start = useMemo(() => parseLocalDate(value.startDate || toLocalISO(new Date())), [value.startDate]);

  // "Custom" is a UI-only mode. It always resolves back to one of the four
  // real API frequencies (daily | weekly | monthly | yearly) with whatever
  // interval/weekdays/day_of_month the user picked. There is no "custom"
  // value sent to the API.
  const [uiMode, setUiMode] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM">(
    (value.recurrence?.frequency?.toUpperCase() as any) || "DAILY",
  );
  const [customUnit, setCustomUnit] = useState<"Day" | "Week" | "Month" | "Year">("Week");

  // FIX: interval defaults to 1 always; only editable once "Custom" is chosen.
  const [interval, setIntervalVal] = useState<number>(value.recurrence?.interval || 1);

  // FIX (bug in original HTML): weekday default must come from the actual
  // selected start date's weekday, not a hardcoded [1,3,5].
  const [weekdays, setWeekdays] = useState<number[]>(
    value.recurrence?.weekdays?.length
      ? value.recurrence.weekdays.map((w) => BYDAY.indexOf(w))
      : [start.getDay()],
  );

  // FIX (bug in original HTML): day_of_month default must come from the
  // actual selected start date's day-of-month, not a hardcoded 15.
  const [dayOfMonth, setDayOfMonth] = useState<number>(value.recurrence?.day_of_month || start.getDate());

  const [viewYear, setViewYear] = useState(start.getFullYear());
  const [viewMonth, setViewMonth] = useState(start.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(start);

  // Click-outside to close (same pattern as EmployeeMultiSelect's popover)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Re-sync local state whenever the popover is (re)opened with new incoming value
  useEffect(() => {
    if (!isOpen) return;
    const s = parseLocalDate(value.startDate || toLocalISO(new Date()));
    setSelectedDate(s);
    setViewYear(s.getFullYear());
    setViewMonth(s.getMonth());

    if (value.recurrence) {
      const freq = value.recurrence.frequency.toUpperCase() as any;
      const isCustomInterval = (value.recurrence.interval || 1) > 1;
      setUiMode(isCustomInterval ? "CUSTOM" : freq);
      if (isCustomInterval) {
        setCustomUnit(
          freq === "DAILY" ? "Day" : freq === "WEEKLY" ? "Week" : freq === "MONTHLY" ? "Month" : "Year",
        );
      }
      setIntervalVal(value.recurrence.interval || 1);
      setWeekdays(
        value.recurrence.weekdays?.length ? value.recurrence.weekdays.map((w) => BYDAY.indexOf(w)) : [s.getDay()],
      );
      setDayOfMonth(value.recurrence.day_of_month || s.getDate());
    } else {
      setUiMode("DAILY");
      setIntervalVal(1);
      setWeekdays([s.getDay()]);
      setDayOfMonth(s.getDate());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ---------------- derived: the actual API-facing frequency ---------------- */

  const effFrequency: RecurrenceFrequency = useMemo(() => {
    if (uiMode !== "CUSTOM") return uiMode.toLowerCase() as RecurrenceFrequency;
    return ({ Day: "daily", Week: "weekly", Month: "monthly", Year: "yearly" } as const)[customUnit];
  }, [uiMode, customUnit]);

  const effInterval = uiMode === "CUSTOM" ? interval : 1;

  /* ---------------- matching logic (fixed) ---------------- */

  function matches(date: Date): boolean {
    if (date < new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())) return false;

    if (effFrequency === "daily") {
      const diffDays = Math.round((date.getTime() - selectedDate.getTime()) / 86400000);
      return diffDays % effInterval === 0;
    }

    if (effFrequency === "weekly") {
      const days = weekdays.length ? weekdays : [selectedDate.getDay()];
      if (!days.includes(date.getDay())) return false;
      const weekDiff = Math.round((startOfWeek(date).getTime() - startOfWeek(selectedDate).getTime()) / (7 * 86400000));
      return weekDiff % effInterval === 0;
    }

    if (effFrequency === "monthly") {
      const diff = monthsBetween(selectedDate, date);
      if (diff < 0 || diff % effInterval !== 0) return false;
      const dim = daysInMonth(date.getFullYear(), date.getMonth());
      // FIX: clamp target day to the days actually in this month (e.g. day 31
      // in a 30-day month correctly lands on the 30th, not silently skipped).
      return date.getDate() === Math.min(dayOfMonth, dim);
    }

    if (effFrequency === "yearly") {
      if (date.getMonth() !== selectedDate.getMonth()) return false;
      const dim = daysInMonth(date.getFullYear(), date.getMonth());
      if (date.getDate() !== Math.min(selectedDate.getDate(), dim)) return false;
      const yearDiff = date.getFullYear() - selectedDate.getFullYear();
      return yearDiff >= 0 && yearDiff % effInterval === 0;
    }

    return false;
  }

  function nextDates(count: number): Date[] {
    const result: Date[] = [];
    const cursor = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    // FIX: cap iterations generously (4 yrs) so large intervals (e.g. every
    // 12 months on a day that doesn't exist some years) still resolve.
    for (let i = 0; i < 1500 && result.length < count; i++) {
      if (matches(cursor)) result.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }

  const upcoming = useMemo(
    () => nextDates(3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effFrequency, effInterval, weekdays, dayOfMonth, selectedDate],
  );

  const upcomingForCalendar = useMemo(
    () => nextDates(10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effFrequency, effInterval, weekdays, dayOfMonth, selectedDate, viewMonth, viewYear],
  );

  /* ---------------- calendar grid ---------------- */

  const calendarCells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const dim = daysInMonth(viewYear, viewMonth);
    const prevDim = daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

    const cells: { day: number; current: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push({ day: prevDim - firstWeekday + 1 + i, current: false });
    for (let d = 1; d <= dim; d++) cells.push({ day: d, current: true });
    const remainder = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remainder; i++) cells.push({ day: i, current: false });
    return cells;
  }, [viewYear, viewMonth]);

  function goPrevMonth() {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }
  function goNextMonth() {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function pickDate(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    setSelectedDate(d);
    // Keep monthly/yearly anchors in sync with the newly picked start date
    setDayOfMonth(d.getDate());
    setWeekdays((prev) => (prev.length === 1 ? [d.getDay()] : prev));
  }

  function toggleWeekday(idx: number) {
    setWeekdays((prev) => {
      if (prev.includes(idx)) {
        if (prev.length === 1) return prev; // keep at least one day selected
        return prev.filter((d) => d !== idx);
      }
      return [...prev, idx].sort((a, b) => a - b);
    });
  }

  function handleApply() {
    onChange({
      startDate: toLocalISO(selectedDate),
      isRecurring: true,
      frequency: effFrequency,
      recurrence: {
        frequency: effFrequency,
        interval: effInterval,
        ...(effFrequency === "weekly" && { weekdays: weekdays.map((d) => BYDAY[d]) }),
        ...(effFrequency === "monthly" && { day_of_month: dayOfMonth }),
      },
    });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-130 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative w-full max-w-sm bg-[#161616] border border-[#2a2a2d] rounded-2xl p-4 shadow-2xl text-[#ededea] max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Start date row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Start date</span>
          <span className="flex items-center gap-1.5 bg-[#1f1f1d] border border-[#3a3a35] rounded-lg px-2.5 py-1.5 text-xs">
            <Calendar size={13} className="text-[#1db584]" />
            {MONTH_SHORT[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
          </span>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={goPrevMonth} className="p-1 text-gray-500 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium">
            {MONTH_FULL[viewMonth]} {viewYear}
          </span>
          <button type="button" onClick={goNextMonth} className="p-1 text-gray-500 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className="text-center text-[10px] text-gray-600">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5 mb-3">
          {calendarCells.map((cell, i) => {
            if (!cell.current) {
              return (
                <span key={i} className="text-center text-xs h-7 flex items-center justify-center text-gray-700">
                  {cell.day}
                </span>
              );
            }
            const cellDate = new Date(viewYear, viewMonth, cell.day);
            const isSelected = sameDay(cellDate, selectedDate);
            const isUpcoming = !isSelected && upcomingForCalendar.some((u) => sameDay(u, cellDate));
            return (
              <button
                type="button"
                key={i}
                onClick={() => pickDate(cell.day)}
                className={cn(
                  "text-center text-xs h-7 rounded-full flex items-center justify-center transition-colors",
                  isSelected && "bg-[#185fa5] text-white font-medium",
                  isUpcoming && "bg-[#1f3a52] text-[#85b7eb]",
                  !isSelected && !isUpcoming && "text-gray-300 hover:bg-[#2a2a26]",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        <div className="h-px bg-[#262624] my-3" />

        {/* Repeats select */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Repeats</span>
          <div className="relative">
            <select
              value={uiMode}
              onChange={(e) => setUiMode(e.target.value as any)}
              className="appearance-none bg-[#1f1f1d] border border-[#3a3a35] rounded-lg pl-2.5 pr-7 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Mode-specific controls */}
        <div className="mb-3">
          {uiMode === "DAILY" && (
            <p className="text-xs text-gray-500 bg-[#1a1a18] border border-[#2a2a26] rounded-lg px-3 py-2.5">
              Repeats every day, starting from the date above.
            </p>
          )}

          {uiMode === "WEEKLY" && <WeekdayPills selected={weekdays} onToggle={toggleWeekday} />}

          {uiMode === "MONTHLY" && (
            <DayOfMonthSelect value={dayOfMonth} onChange={setDayOfMonth} />
          )}

          {uiMode === "YEARLY" && (
            <p className="text-xs text-gray-500 bg-[#1a1a18] border border-[#2a2a26] rounded-lg px-3 py-2.5">
              Repeats every year on {MONTH_FULL[selectedDate.getMonth()]} {selectedDate.getDate()}.
            </p>
          )}

          {uiMode === "CUSTOM" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Every</span>
                <div className="flex gap-1.5">
                  <select
                    value={interval}
                    onChange={(e) => setIntervalVal(Math.max(1, Number(e.target.value)))}
                    className="appearance-none bg-[#1f1f1d] border-[1.5px] border-[#d85a30] rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as any)}
                    className="appearance-none bg-[#1f1f1d] border border-[#3a3a35] rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                  >
                    {["Day", "Week", "Month", "Year"].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {customUnit === "Week" && <WeekdayPills selected={weekdays} onToggle={toggleWeekday} />}
              {customUnit === "Month" && <DayOfMonthSelect value={dayOfMonth} onChange={setDayOfMonth} />}
              {customUnit === "Day" && (
                <p className="text-xs text-gray-500 bg-[#1a1a18] border border-[#2a2a26] rounded-lg px-3 py-2.5">
                  Repeats every {interval} day{interval > 1 ? "s" : ""}.
                </p>
              )}
              {customUnit === "Year" && (
                <p className="text-xs text-gray-500 bg-[#1a1a18] border border-[#2a2a26] rounded-lg px-3 py-2.5">
                  Every {interval} year{interval > 1 ? "s" : ""} on {MONTH_FULL[selectedDate.getMonth()]}{" "}
                  {selectedDate.getDate()}.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="pt-3 border-t border-[#262624]">
          <div className="text-[10px] uppercase tracking-wide text-[#b0a06a] mb-1.5">Next dates</div>
          <div className="text-xs text-gray-300 leading-relaxed">
            {upcoming.length
              ? upcoming.map((d, i) => (
                  <div key={i}>
                    {WEEKDAY_SHORT[d.getDay()]}, {MONTH_SHORT[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
                  </div>
                ))
              : "—"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#2a2a2d] text-gray-300 rounded-xl text-xs font-bold hover:bg-[#1f1f1d] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 bg-[#A39171] text-black rounded-xl text-xs font-bold hover:bg-[#b5a384] transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};/* ------------------------------------------------------------------ */
/*  Small sub-components                                               */
/* ------------------------------------------------------------------ */

function WeekdayPills({ selected, onToggle }: { selected: number[]; onToggle: (idx: number) => void }) {
  return (
    <div>
      <div className="text-[10px] tracking-wide text-[#b0a06a] mb-2 uppercase">On these days</div>
      <div className="flex gap-1.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => onToggle(idx)}
            className={cn(
              "flex-1 aspect-square flex items-center justify-center text-xs rounded-lg border transition-colors",
              selected.includes(idx)
                ? "bg-[#1db584] text-[#04221a] font-semibold border-[#1db584]"
                : "bg-[#1f1f1d] text-gray-500 border-[#3a3a35]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DayOfMonthSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">On day</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none bg-[#1f1f1d] border border-[#3a3a35] rounded-lg pl-2.5 pr-7 py-1.5 text-xs outline-none cursor-pointer"
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper to build a human-readable one-line summary for the trigger  */
/*  field shown in TaskActionModal (e.g. "Jul 15, 2026 · Monthly on    */
/*  the 15th").                                                        */
/* ------------------------------------------------------------------ */

export function describeRecurrence(value: RecurrenceValue): string {
  if (!value.startDate) return "Select a date";
  const d = parseLocalDate(value.startDate);
  const dateLabel = `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  if (!value.isRecurring || !value.recurrence) return dateLabel;

  const { frequency, interval, day_of_month, weekdays } = value.recurrence;
  const isCustomInterval = interval > 1;

  if (frequency === "daily") {
    return `${dateLabel} · ${isCustomInterval ? `Every ${interval} days` : "Daily"}`;
  }
  if (frequency === "weekly") {
    const days = (weekdays || []).map((w) => WEEKDAY_SHORT[BYDAY.indexOf(w)]).join(", ");
    return `${dateLabel} · ${isCustomInterval ? `Every ${interval} weeks` : "Weekly"} on ${days}`;
  }
  if (frequency === "monthly") {
    return `${dateLabel} · ${isCustomInterval ? `Every ${interval} months` : "Monthly"} on day ${day_of_month}`;
  }
  if (frequency === "yearly") {
    return `${dateLabel} · ${isCustomInterval ? `Every ${interval} years` : "Yearly"}`;
  }
  return dateLabel;
}