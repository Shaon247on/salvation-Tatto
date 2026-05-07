"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

export const FilterDropdown = ({
  value,
  onChange,
  options,
  className,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative z-20", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between min-w-[160px] gap-4 px-5 py-3 bg-[#121214] border border-[#2a2a2d] rounded-full text-sm font-medium transition-all group",
          isOpen
            ? "border-[#968B79] ring-1 ring-[#968B79]/20"
            : "hover:border-[#404040]",
        )}
      >
        <span className={cn(isOpen ? "text-[#968B79]" : "text-gray-300")}>
          {value}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-gray-500 transition-transform duration-200",
            isOpen ? "rotate-180 text-[#968B79]" : "group-hover:text-gray-300",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full min-w-[180px] bg-[#121214] border border-[#968B79]/30 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left text-xs transition-colors",
                  value === option
                    ? "bg-[#968B79]/20 text-[#968B79] font-bold"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200",
                )}
              >
                <span>{option}</span>
                {value === option && <Check size={14} className="shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
