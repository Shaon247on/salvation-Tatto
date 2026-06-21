"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, X, Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationEmployee } from "@/redux/services/admin/tasks/taskApi";

interface EmployeeMultiSelectProps {
  employees?: LocationEmployee[];
  selectedIds?: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function EmployeeMultiSelect({
  employees = [],
  selectedIds = [],
  onChange,
  isLoading,
  disabled,
  placeholder = "Select a store first",
}: EmployeeMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedEmployees = useMemo(
    () => employees.filter((emp) => selectedIds.includes(emp.id)),
    [employees, selectedIds],
  );

  const getInitials = (emp: LocationEmployee) =>
    `${emp.first_name[0] || ""}${emp.last_name[0] || ""}`.toUpperCase();

  const removeEmployee = (id: number) => {
    onChange(selectedIds.filter((i) => i !== id));
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled || isLoading}
        className="w-full bg-black border border-[#262626] rounded-xl p-3.5 text-sm text-left outline-none focus:border-[#404040] disabled:opacity-50 flex items-center justify-between gap-2"
      >
        <span
          className={cn(
            selectedEmployees.length ? "text-white" : "text-gray-500",
          )}
        >
          {isLoading
            ? "Loading employees..."
            : disabled
              ? placeholder
              : selectedEmployees.length
                ? `${selectedEmployees.length} employee${selectedEmployees.length > 1 ? "s" : ""} selected`
                : "Select employees..."}
        </span>
        <ChevronDown size={16} className="text-gray-500 shrink-0" />
      </button>

      {/* Selected chips */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedEmployees.map((emp) => (
            <span
              key={emp.id}
              className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#262626] rounded-full pl-1 pr-2 py-1 text-xs text-gray-300"
            >
              <span className="w-5 h-5 rounded-full bg-[#A39171]/20 text-[#c4a47c] flex items-center justify-center text-[9px] font-bold shrink-0">
                {getInitials(emp)}
              </span>
              {emp.first_name} {emp.last_name}
              <button
                type="button"
                onClick={() => removeEmployee(emp.id)}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <EmployeeSelectDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        employees={employees}
        selectedIds={selectedIds}
        onChange={onChange}
      />
    </div>
  );
}

// --- Dialog ---

interface EmployeeSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employees: LocationEmployee[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function EmployeeSelectDialog({
  isOpen,
  onClose,
  employees,
  selectedIds,
  onChange,
}: EmployeeSelectDialogProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [draftIds, setDraftIds] = useState<number[]>(selectedIds);

  // Sync draft selection + reset filters whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      setDraftIds(selectedIds);
      setSearch("");
      setRoleFilter("All");
    }
  }, [isOpen, selectedIds]);

  const roles = useMemo(() => {
    const unique = Array.from(new Set(employees.map((e) => e.role_display)));
    return ["All", ...unique];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "All" || emp.role_display === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  if (!isOpen) return null;

  const toggleEmployee = (id: number) => {
    setDraftIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAllFiltered = () => {
    const ids = filteredEmployees.map((e) => e.id);
    setDraftIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const clearAllFiltered = () => {
    const filteredIdSet = new Set(filteredEmployees.map((e) => e.id));
    setDraftIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
  };

  const getInitials = (emp: LocationEmployee) =>
    `${emp.first_name[0] || ""}${emp.last_name[0] || ""}`.toUpperCase();

  const handleApply = () => {
    onChange(draftIds);
    onClose();
  };

  const isFiltering = roleFilter !== "All" || search.length > 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D] sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Assign Employees
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Select one or more employees for this task
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors bg-[#1A1A1A] rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search + role filters */}
        <div className="p-4 border-b border-[#1A1A1A]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full bg-black border border-[#262626] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-[#404040]"
            />
          </div>

          {roles.length > 2 && (
            <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 -mb-1">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all",
                    roleFilter === role
                      ? "bg-[#A39171] text-white border-[#A39171]"
                      : "bg-transparent text-gray-500 border-[#262626]",
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulk actions */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#1A1A1A] text-[10px]">
          <button
            type="button"
            onClick={selectAllFiltered}
            className="text-[#c4a47c] hover:text-white font-bold uppercase tracking-wide transition-colors"
          >
            Select all{isFiltering ? " filtered" : ""} (
            {filteredEmployees.length})
          </button>
          <span className="text-gray-500 flex items-center gap-1.5">
            <Users size={12} /> {draftIds.length} selected
          </span>
          <button
            type="button"
            onClick={clearAllFiltered}
            className="text-gray-500 hover:text-red-400 font-bold uppercase tracking-wide transition-colors"
          >
            Clear
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {filteredEmployees.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-10">
              No employees found
            </p>
          ) : (
            filteredEmployees.map((emp) => {
              const isChecked = draftIds.includes(emp.id);
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => toggleEmployee(emp.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-white/[0.03] transition-colors border-b border-[#1A1A1A]/50",
                    isChecked && "bg-[#c4a47c]/5",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                      isChecked
                        ? "bg-[#c4a47c] border-[#c4a47c]"
                        : "border-[#404040]",
                    )}
                  >
                    {isChecked && <Check size={11} className="text-black" />}
                  </div>
                  <span className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/5 text-gray-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {getInitials(emp)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      {emp.role_display}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1A1A1A] flex gap-3 bg-[#0D0D0D]">
          <button
            onClick={onClose}
            className="flex-1 py-4 border border-[#262626] text-white rounded-2xl font-bold hover:bg-[#1A1A1A] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 shadow-lg active:scale-95 transition-all"
          >
            Apply ({draftIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}