"use client";

import React, { useState, useMemo } from "react";
import { useAppSelector } from "@/redux/store";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { ChevronDown, Search } from "lucide-react";

import ComparisonBar from "./ComparisonBar";
import PerformanceRadial from "./PerformanceRadial";

import PerformanceStatCard from "./PerformanceStatCard";
import EmployeeBreakdown from "./EmployeeBreakdown";
import TaskLog from "./TaskLog";

// --- Types ---
export type Status =
  | "Approved"
  | "Overdue"
  | "Awaiting Review"
  | "Pending"
  | "Rejected";

export default function PerformanceManager() {
  const user = useAppSelector(selectCurrentUser);

  // 1. Add State for the filter
  const [selectedLocation, setSelectedLocation] = useState("All Location");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Today");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedTaskStatus, setSelectedTaskStatus] = useState("All Status");

  // Helper function to calculate date ranges
  const getDateRange = (range: string) => {
    const today = new Date("2026-04-16");
    let start = new Date(today);
    let end = new Date(today);

    if (range === "Today") {
      start.setDate(today.getDate());
      end.setDate(today.getDate());
    } else if (range === "Weekly") {
      start.setDate(today.getDate() - 6);
    } else if (range === "Monthly") {
      start.setDate(today.getDate() - 29);
    } else if (range === "Yearly") {
      start.setFullYear(today.getFullYear() - 1);
    }

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const EMPLOYEES = [
    {
      id: "1",
      initials: "RC",
      name: "Remy Castillo",
      role: "Artist",
      location: "East End Parlor",
      presentCount: 28,
      absentCount: 1,
      lateCount: 1,
      completedCount: 48,
      overdueCount: 2,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Present" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Present" },
        { date: "2026-04-12", status: "Late" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Present" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Present" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Absent" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Present" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "2",
      initials: "MC",
      name: "Marcus Chen",
      role: "Artist",
      location: "Downtown Ink",
      presentCount: 25,
      absentCount: 3,
      lateCount: 2,
      completedCount: 45,
      overdueCount: 4,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Late" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Absent" },
        { date: "2026-04-12", status: "Present" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Absent" },
        { date: "2026-04-09", status: "Present" },
        { date: "2026-04-08", status: "Late" },
        { date: "2026-04-07", status: "Present" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Absent" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Late" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Present" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "3",
      initials: "NS",
      name: "Nova Singh",
      role: "Manager",
      location: "East End Parlor",
      presentCount: 29,
      absentCount: 0,
      lateCount: 1,
      completedCount: 58,
      overdueCount: 0,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Present" },
        { date: "2026-04-14", status: "Late" },
        { date: "2026-04-13", status: "Present" },
        { date: "2026-04-12", status: "Present" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Present" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Present" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Present" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "4",
      initials: "TW",
      name: "Tyler Woods",
      role: "Apprentice",
      location: "Northgate Tattoo",
      presentCount: 26,
      absentCount: 2,
      lateCount: 2,
      completedCount: 35,
      overdueCount: 5,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Late" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Absent" },
        { date: "2026-04-12", status: "Present" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Late" },
        { date: "2026-04-09", status: "Present" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Absent" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Late" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Present" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "5",
      initials: "JB",
      name: "Jordan Blake",
      role: "Apprentice",
      location: "Downtown Ink",
      presentCount: 24,
      absentCount: 4,
      lateCount: 2,
      completedCount: 32,
      overdueCount: 6,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Absent" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Late" },
        { date: "2026-04-12", status: "Present" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Absent" },
        { date: "2026-04-09", status: "Present" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Absent" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Late" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Absent" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Absent" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Late" },
        { date: "2026-03-23", status: "Present" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "6",
      initials: "KO",
      name: "Kai Okafor",
      role: "Artist",
      location: "Westside Studio",
      presentCount: 27,
      absentCount: 1,
      lateCount: 2,
      completedCount: 51,
      overdueCount: 3,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Present" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Present" },
        { date: "2026-04-12", status: "Late" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Present" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Late" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Absent" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Present" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "7",
      initials: "ZW",
      name: "Zoe Winters",
      role: "Apprentice",
      location: "East End Parlor",
      presentCount: 24,
      absentCount: 4,
      lateCount: 2,
      completedCount: 28,
      overdueCount: 8,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Absent" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Late" },
        { date: "2026-04-12", status: "Absent" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Absent" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Present" },
        { date: "2026-04-06", status: "Late" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Absent" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Absent" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Late" },
        { date: "2026-03-27", status: "Absent" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Absent" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Late" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "8",
      initials: "SR",
      name: "Sofia Rivera",
      role: "Receptionist",
      location: "Downtown Ink",
      presentCount: 22,
      absentCount: 5,
      lateCount: 3,
      completedCount: 38,
      overdueCount: 7,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Absent" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Late" },
        { date: "2026-04-12", status: "Absent" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Absent" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Late" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Absent" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Late" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Absent" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Absent" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Late" },
        { date: "2026-03-26", status: "Absent" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Absent" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Late" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Absent" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "9",
      initials: "LN",
      name: "Leila Nassar",
      role: "Artist",
      location: "Northgate Tattoo",
      presentCount: 25,
      absentCount: 3,
      lateCount: 2,
      completedCount: 42,
      overdueCount: 5,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Absent" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Present" },
        { date: "2026-04-12", status: "Late" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Absent" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Present" },
        { date: "2026-04-06", status: "Late" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Absent" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Present" },
        { date: "2026-03-30", status: "Absent" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Present" },
        { date: "2026-03-26", status: "Late" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Absent" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "10",
      initials: "AT",
      name: "Aria Thompson",
      role: "Artist",
      location: "Westside Studio",
      presentCount: 20,
      absentCount: 6,
      lateCount: 4,
      completedCount: 35,
      overdueCount: 10,
      _records: [
        { date: "2026-04-16", status: "Absent" },
        { date: "2026-04-15", status: "Present" },
        { date: "2026-04-14", status: "Absent" },
        { date: "2026-04-13", status: "Late" },
        { date: "2026-04-12", status: "Present" },
        { date: "2026-04-11", status: "Absent" },
        { date: "2026-04-10", status: "Late" },
        { date: "2026-04-09", status: "Absent" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Absent" },
        { date: "2026-04-06", status: "Late" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Absent" },
        { date: "2026-04-03", status: "Late" },
        { date: "2026-04-02", status: "Present" },
        { date: "2026-04-01", status: "Absent" },
        { date: "2026-03-31", status: "Late" },
        { date: "2026-03-30", status: "Absent" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Absent" },
        { date: "2026-03-27", status: "Late" },
        { date: "2026-03-26", status: "Absent" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Absent" },
        { date: "2026-03-23", status: "Late" },
        { date: "2026-03-22", status: "Absent" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Absent" },
        { date: "2026-03-19", status: "Late" },
        { date: "2026-03-18", status: "Present" },
      ],
    },
    {
      id: "11",
      initials: "ID",
      name: "Imani Diallo",
      role: "Receptionist",
      location: "Northgate Tattoo",
      presentCount: 23,
      absentCount: 4,
      lateCount: 3,
      completedCount: 36,
      overdueCount: 6,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Absent" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Late" },
        { date: "2026-04-12", status: "Absent" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Absent" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Late" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Present" },
        { date: "2026-04-04", status: "Absent" },
        { date: "2026-04-03", status: "Present" },
        { date: "2026-04-02", status: "Late" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Absent" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Present" },
        { date: "2026-03-27", status: "Absent" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Late" },
        { date: "2026-03-24", status: "Present" },
        { date: "2026-03-23", status: "Absent" },
        { date: "2026-03-22", status: "Present" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Present" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Absent" },
      ],
    },
    {
      id: "12",
      initials: "DP",
      name: "Devon Park",
      role: "Manager",
      location: "Westside Studio",
      presentCount: 22,
      absentCount: 5,
      lateCount: 3,
      completedCount: 40,
      overdueCount: 8,
      _records: [
        { date: "2026-04-16", status: "Present" },
        { date: "2026-04-15", status: "Absent" },
        { date: "2026-04-14", status: "Present" },
        { date: "2026-04-13", status: "Late" },
        { date: "2026-04-12", status: "Absent" },
        { date: "2026-04-11", status: "Present" },
        { date: "2026-04-10", status: "Present" },
        { date: "2026-04-09", status: "Absent" },
        { date: "2026-04-08", status: "Present" },
        { date: "2026-04-07", status: "Late" },
        { date: "2026-04-06", status: "Present" },
        { date: "2026-04-05", status: "Absent" },
        { date: "2026-04-04", status: "Present" },
        { date: "2026-04-03", status: "Late" },
        { date: "2026-04-02", status: "Absent" },
        { date: "2026-04-01", status: "Present" },
        { date: "2026-03-31", status: "Absent" },
        { date: "2026-03-30", status: "Present" },
        { date: "2026-03-29", status: "Present" },
        { date: "2026-03-28", status: "Late" },
        { date: "2026-03-27", status: "Absent" },
        { date: "2026-03-26", status: "Present" },
        { date: "2026-03-25", status: "Present" },
        { date: "2026-03-24", status: "Absent" },
        { date: "2026-03-23", status: "Late" },
        { date: "2026-03-22", status: "Absent" },
        { date: "2026-03-21", status: "Present" },
        { date: "2026-03-20", status: "Absent" },
        { date: "2026-03-19", status: "Present" },
        { date: "2026-03-18", status: "Late" },
      ],
    },
  ];

  const staffPerformanceData = [
    {
      id: 1,
      name: "Remy Castillo",
      initials: "RC",
      location: "East End Parlor",
      role: "Artist",
      onTimeRate: 97,
      tasksDone: "16/17",
      lateArrivals: 0,
      status: "Good",
    },
    {
      id: 2,
      name: "Marcus Chen",
      initials: "MC",
      location: "Downtown Ink",
      role: "Artist",
      onTimeRate: 96,
      tasksDone: "18/20",
      lateArrivals: 1,
      status: "Good",
    },
    {
      id: 3,
      name: "Nova Singh",
      initials: "NS",
      location: "East End Parlor",
      role: "Manager",
      onTimeRate: 95,
      tasksDone: "19/20",
      lateArrivals: 1,
      status: "Good",
    },
    {
      id: 4,
      name: "Tyler Woods",
      initials: "TW",
      location: "Northgate Tattoo",
      role: "Apprentice",
      onTimeRate: 94,
      tasksDone: "9/10",
      lateArrivals: 1,
      status: "Good",
    },
    {
      id: 5,
      name: "Jordan Blake",
      initials: "JB",
      location: "Downtown Ink",
      role: "Apprentice",
      onTimeRate: 92,
      tasksDone: "10/12",
      lateArrivals: 2,
      status: "Good",
    },
    {
      id: 6,
      name: "Kai Okafor",
      initials: "KO",
      location: "Westside Studio",
      role: "Artist",
      onTimeRate: 91,
      tasksDone: "17/20",
      lateArrivals: 2,
      status: "Good",
    },
    {
      id: 7,
      name: "Zoe Winters",
      initials: "ZW",
      location: "East End Parlor",
      role: "Apprentice",
      onTimeRate: 89,
      tasksDone: "8/9",
      lateArrivals: 2,
      status: "Monitor",
    },
    {
      id: 8,
      name: "Sofia Rivera",
      initials: "SR",
      location: "Downtown Ink",
      role: "Receptionist",
      onTimeRate: 88,
      tasksDone: "14/16",
      lateArrivals: 3,
      status: "Monitor",
    },
    {
      id: 9,
      name: "Leila Nassar",
      initials: "LN",
      location: "Northgate Tattoo",
      role: "Artist",
      onTimeRate: 87,
      tasksDone: "13/15",
      lateArrivals: 3,
      status: "Monitor",
    },
    {
      id: 10,
      name: "Aria Thompson",
      initials: "AT",
      location: "Westside Studio",
      role: "Artist",
      onTimeRate: 84,
      tasksDone: "15/19",
      lateArrivals: 4,
      status: "At Risk",
    },
    {
      id: 11,
      name: "Imani Diallo",
      initials: "ID",
      location: "Northgate Tattoo",
      role: "Receptionist",
      onTimeRate: 82,
      tasksDone: "11/14",
      lateArrivals: 4,
      status: "At Risk",
    },
    {
      id: 12,
      name: "Devon Park",
      initials: "DP",
      location: "Westside Studio",
      role: "Manager",
      onTimeRate: 80,
      tasksDone: "12/18",
      lateArrivals: 5,
      status: "At Risk",
    },
  ];

  const locations = [
    {
      name: "Downtown Ink",
      taskCompletion: 78,
      attendanceRate: 92,
      timeliness: 85,
      ratingScore: 90,
      staffScore: 70,
      color: "#6366F1",
    }, // Blue
    {
      name: "Westside Studio",
      taskCompletion: 61,
      attendanceRate: 85,
      timeliness: 75,
      ratingScore: 95,
      staffScore: 60,
      color: "#F59E0B",
    }, // Orange
    {
      name: "Northgate Tattoo",
      taskCompletion: 55,
      attendanceRate: 88,
      timeliness: 80,
      ratingScore: 92,
      staffScore: 65,
      color: "#10B981",
    }, // Green
    {
      name: "East End Parlor",
      taskCompletion: 84,
      attendanceRate: 95,
      timeliness: 84,
      ratingScore: 95,
      staffScore: 69,
      color: "#EF4444",
    }, // Red
  ];

  // Employee Breakdown Mock Data
  const employeeBreakdownData = [
    {
      id: 1,
      name: "Remy Castillo",
      initials: "RC",
      role: "Artist",
      location: "East End Parlor",
      presentCount: 19,
      absentCount: 1,
      lateCount: 2,
      completedCount: 16,
      overdueCount: 3,
    },
    {
      id: 2,
      name: "Marcus Chen",
      initials: "MC",
      role: "Artist",
      location: "Downtown Ink",
      presentCount: 20,
      absentCount: 0,
      lateCount: 1,
      completedCount: 18,
      overdueCount: 2,
    },
    {
      id: 3,
      name: "Nova Singh",
      initials: "NS",
      role: "Manager",
      location: "East End Parlor",
      presentCount: 20,
      absentCount: 0,
      lateCount: 1,
      completedCount: 19,
      overdueCount: 1,
    },
    {
      id: 4,
      name: "Tyler Woods",
      initials: "TW",
      role: "Apprentice",
      location: "Northgate Tattoo",
      presentCount: 19,
      absentCount: 1,
      lateCount: 1,
      completedCount: 9,
      overdueCount: 4,
    },
    {
      id: 5,
      name: "Jordan Blake",
      initials: "JB",
      role: "Apprentice",
      location: "Downtown Ink",
      presentCount: 18,
      absentCount: 2,
      lateCount: 2,
      completedCount: 10,
      overdueCount: 5,
    },
    {
      id: 6,
      name: "Kai Okafor",
      initials: "KO",
      role: "Artist",
      location: "Westside Studio",
      presentCount: 19,
      absentCount: 1,
      lateCount: 2,
      completedCount: 17,
      overdueCount: 3,
    },
    {
      id: 7,
      name: "Zoe Winters",
      initials: "ZW",
      role: "Apprentice",
      location: "East End Parlor",
      presentCount: 18,
      absentCount: 2,
      lateCount: 2,
      completedCount: 8,
      overdueCount: 6,
    },
    {
      id: 8,
      name: "Sofia Rivera",
      initials: "SR",
      role: "Receptionist",
      location: "Downtown Ink",
      presentCount: 17,
      absentCount: 3,
      lateCount: 3,
      completedCount: 14,
      overdueCount: 4,
    },
    {
      id: 9,
      name: "Leila Nassar",
      initials: "LN",
      role: "Artist",
      location: "Northgate Tattoo",
      presentCount: 18,
      absentCount: 2,
      lateCount: 3,
      completedCount: 13,
      overdueCount: 5,
    },
    {
      id: 10,
      name: "Aria Thompson",
      initials: "AT",
      role: "Artist",
      location: "Westside Studio",
      presentCount: 16,
      absentCount: 4,
      lateCount: 4,
      completedCount: 15,
      overdueCount: 7,
    },
    {
      id: 11,
      name: "Imani Diallo",
      initials: "ID",
      role: "Receptionist",
      location: "Northgate Tattoo",
      presentCount: 17,
      absentCount: 3,
      lateCount: 4,
      completedCount: 11,
      overdueCount: 6,
    },
    {
      id: 12,
      name: "Devon Park",
      initials: "DP",
      role: "Manager",
      location: "Westside Studio",
      presentCount: 16,
      absentCount: 4,
      lateCount: 5,
      completedCount: 12,
      overdueCount: 8,
    },
  ];

  // Task Log Mock Data
  const taskLogData = [
    {
      id: 1,
      task: "Q3 Quarterly Report",
      assignedTo: "Remy Castillo",
      location: "East End Parlor",
      assignedBy: "Super Admin",
      dueDate: "2025-10-15",
      status: "Approved",
    },
    {
      id: 2,
      task: "Client Follow-up",
      assignedTo: "Marcus Chen",
      location: "Downtown Ink",
      assignedBy: "District Manager",
      dueDate: "2025-10-18",
      status: "Approved",
    },
    {
      id: 3,
      task: "System Maintenance",
      assignedTo: "Nova Singh",
      location: "East End Parlor",
      assignedBy: "Store Manager",
      dueDate: "2025-10-10",
      status: "Overdue",
    },
    {
      id: 4,
      task: "Team Training Session",
      assignedTo: "Tyler Woods",
      location: "Northgate Tattoo",
      assignedBy: "District Manager",
      dueDate: "2025-10-19",
      status: "Awaiting Review",
    },
    {
      id: 5,
      task: "Budget Review",
      assignedTo: "Jordan Blake",
      location: "Downtown Ink",
      assignedBy: "Super Admin",
      dueDate: "2025-10-20",
      status: "Pending",
    },
    {
      id: 6,
      task: "Project Documentation",
      assignedTo: "Kai Okafor",
      location: "Westside Studio",
      assignedBy: "Store Manager",
      dueDate: "2025-10-16",
      status: "Approved",
    },
    {
      id: 7,
      task: "Performance Metrics",
      assignedTo: "Zoe Winters",
      location: "East End Parlor",
      assignedBy: "District Manager",
      dueDate: "2025-10-09",
      status: "Overdue",
    },
    {
      id: 8,
      task: "Client Presentation",
      assignedTo: "Sofia Rivera",
      location: "Downtown Ink",
      assignedBy: "Store Manager",
      dueDate: "2025-10-22",
      status: "Awaiting Review",
    },
    {
      id: 9,
      task: "Code Review",
      assignedTo: "Leila Nassar",
      location: "Northgate Tattoo",
      assignedBy: "Super Admin",
      dueDate: "2025-10-17",
      status: "Approved",
    },
    {
      id: 10,
      task: "Inventory Check",
      assignedTo: "Aria Thompson",
      location: "Westside Studio",
      assignedBy: "District Manager",
      dueDate: "2025-10-08",
      status: "Rejected",
    },
    {
      id: 11,
      task: "Staff Planning",
      assignedTo: "Imani Diallo",
      location: "Northgate Tattoo",
      assignedBy: "Store Manager",
      dueDate: "2025-10-21",
      status: "Pending",
    },
    {
      id: 12,
      task: "Quality Assurance",
      assignedTo: "Devon Park",
      location: "Westside Studio",
      assignedBy: "Super Admin",
      dueDate: "2025-10-19",
      status: "Awaiting Review",
    },
  ];

  // Task Log Mock Data
  const TASKS = [
    {
      id: 1,
      task: "Q2 Performance Review",
      assignedTo: "Remy Castillo",
      location: "East End Parlor",
      assignedBy: "Super Admin",
      dueDate: "2026-04-16",
      status: "Approved" as Status,
    },
    {
      id: 2,
      task: "Client Consultation",
      assignedTo: "Marcus Chen",
      location: "Downtown Ink",
      assignedBy: "District Manager",
      dueDate: "2026-04-15",
      status: "Approved" as Status,
    },
    {
      id: 3,
      task: "System Maintenance",
      assignedTo: "Nova Singh",
      location: "East End Parlor",
      assignedBy: "Store Manager",
      dueDate: "2026-04-14",
      status: "Overdue" as Status,
    },
    {
      id: 4,
      task: "Team Training Session",
      assignedTo: "Tyler Woods",
      location: "Northgate Tattoo",
      assignedBy: "District Manager",
      dueDate: "2026-04-18",
      status: "Awaiting Review" as Status,
    },
    {
      id: 5,
      task: "Budget Analysis",
      assignedTo: "Jordan Blake",
      location: "Downtown Ink",
      assignedBy: "Super Admin",
      dueDate: "2026-04-20",
      status: "Pending" as Status,
    },
    {
      id: 6,
      task: "Project Documentation",
      assignedTo: "Kai Okafor",
      location: "Westside Studio",
      assignedBy: "Store Manager",
      dueDate: "2026-04-16",
      status: "Approved" as Status,
    },
    {
      id: 7,
      task: "Performance Metrics",
      assignedTo: "Zoe Winters",
      location: "East End Parlor",
      assignedBy: "District Manager",
      dueDate: "2026-04-09",
      status: "Overdue" as Status,
    },
    {
      id: 8,
      task: "Client Presentation",
      assignedTo: "Sofia Rivera",
      location: "Downtown Ink",
      assignedBy: "Store Manager",
      dueDate: "2026-04-22",
      status: "Awaiting Review" as Status,
    },
    {
      id: 9,
      task: "Code Review",
      assignedTo: "Leila Nassar",
      location: "Northgate Tattoo",
      assignedBy: "Super Admin",
      dueDate: "2026-04-17",
      status: "Approved" as Status,
    },
    {
      id: 10,
      task: "Inventory Check",
      assignedTo: "Aria Thompson",
      location: "Westside Studio",
      assignedBy: "District Manager",
      dueDate: "2026-04-08",
      status: "Rejected" as Status,
    },
    {
      id: 11,
      task: "Staff Planning",
      assignedTo: "Imani Diallo",
      location: "Northgate Tattoo",
      assignedBy: "Store Manager",
      dueDate: "2026-04-21",
      status: "Pending" as Status,
    },
    {
      id: 12,
      task: "Quality Assurance",
      assignedTo: "Devon Park",
      location: "Westside Studio",
      assignedBy: "Super Admin",
      dueDate: "2026-04-19",
      status: "Awaiting Review" as Status,
    },
    {
      id: 13,
      task: "Customer Feedback Report",
      assignedTo: "Remy Castillo",
      location: "East End Parlor",
      assignedBy: "District Manager",
      dueDate: "2026-04-12",
      status: "Approved" as Status,
    },
    {
      id: 14,
      task: "Compliance Review",
      assignedTo: "Marcus Chen",
      location: "Downtown Ink",
      assignedBy: "Super Admin",
      dueDate: "2026-04-11",
      status: "Overdue" as Status,
    },
    {
      id: 15,
      task: "Training Documentation",
      assignedTo: "Nova Singh",
      location: "East End Parlor",
      assignedBy: "Store Manager",
      dueDate: "2026-04-13",
      status: "Approved" as Status,
    },
    {
      id: 16,
      task: "Safety Inspection",
      assignedTo: "Tyler Woods",
      location: "Northgate Tattoo",
      assignedBy: "District Manager",
      dueDate: "2026-03-28",
      status: "Overdue" as Status,
    },
    {
      id: 17,
      task: "Supplier Negotiation",
      assignedTo: "Jordan Blake",
      location: "Downtown Ink",
      assignedBy: "Store Manager",
      dueDate: "2026-03-31",
      status: "Rejected" as Status,
    },
    {
      id: 18,
      task: "Payroll Processing",
      assignedTo: "Kai Okafor",
      location: "Westside Studio",
      assignedBy: "Super Admin",
      dueDate: "2026-04-10",
      status: "Approved" as Status,
    },
    {
      id: 19,
      task: "Equipment Maintenance",
      assignedTo: "Zoe Winters",
      location: "East End Parlor",
      assignedBy: "District Manager",
      dueDate: "2026-04-07",
      status: "Overdue" as Status,
    },
    {
      id: 20,
      task: "Marketing Strategy",
      assignedTo: "Sofia Rivera",
      location: "Downtown Ink",
      assignedBy: "Store Manager",
      dueDate: "2026-04-25",
      status: "Pending" as Status,
    },
    {
      id: 21,
      task: "Health & Safety Training",
      assignedTo: "Leila Nassar",
      location: "Northgate Tattoo",
      assignedBy: "District Manager",
      dueDate: "2026-04-24",
      status: "Awaiting Review" as Status,
    },
    {
      id: 22,
      task: "Data Backup",
      assignedTo: "Aria Thompson",
      location: "Westside Studio",
      assignedBy: "Super Admin",
      dueDate: "2026-04-06",
      status: "Overdue" as Status,
    },
    {
      id: 23,
      task: "Stakeholder Meeting",
      assignedTo: "Imani Diallo",
      location: "Northgate Tattoo",
      assignedBy: "Store Manager",
      dueDate: "2026-04-23",
      status: "Pending" as Status,
    },
    {
      id: 24,
      task: "Process Improvement",
      assignedTo: "Devon Park",
      location: "Westside Studio",
      assignedBy: "District Manager",
      dueDate: "2026-04-05",
      status: "Rejected" as Status,
    },
    {
      id: 25,
      task: "Annual Audit",
      assignedTo: "Remy Castillo",
      location: "East End Parlor",
      assignedBy: "Super Admin",
      dueDate: "2026-04-30",
      status: "Pending" as Status,
    },
  ];

  // 2. Filter Logic with date range
  const dateRange = getDateRange(selectedTimePeriod);

  const filteredEmployees = useMemo(() => {
    if (searchEmployee === "") {
      // Summary view: return all employees with location filter
      return EMPLOYEES.filter(
        (emp) =>
          selectedLocation === "All Location" ||
          emp.location === selectedLocation,
      );
    } else {
      // Today breakdown view: return employees matching search with filtered records
      return EMPLOYEES.filter(
        (emp) =>
          (selectedLocation === "All Location" ||
            emp.location === selectedLocation) &&
          (emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchEmployee.toLowerCase())),
      ).map((emp) => ({
        ...emp,
        _records: emp._records.filter(
          (record) =>
            record.date >= dateRange.start && record.date <= dateRange.end,
        ),
      }));
    }
  }, [searchEmployee, selectedLocation, selectedTimePeriod]);

  const filteredTasks = useMemo(() => {
    return TASKS.filter((task) => {
      const dateMatch =
        task.dueDate >= dateRange.start && task.dueDate <= dateRange.end;
      const employeeMatch = searchEmployee
        ? task.assignedTo
            .toLowerCase()
            .includes(searchEmployee.toLowerCase()) ||
          task.task.toLowerCase().includes(searchEmployee.toLowerCase())
        : true;
      const statusMatch =
        selectedTaskStatus === "All Status" ||
        task.status === selectedTaskStatus;
      const locationMatch =
        selectedLocation === "All Location" ||
        task.location === selectedLocation;

      return dateMatch && employeeMatch && statusMatch && locationMatch;
    });
  }, [
    searchEmployee,
    selectedTaskStatus,
    selectedLocation,
    selectedTimePeriod,
  ]);

  // Legacy filtering for staff performance data (for the top sections)
  const filteredStaffData = React.useMemo(
    () =>
      searchEmployee === ""
        ? staffPerformanceData.filter(
            (staff) =>
              selectedLocation === "All Location" ||
              staff.location === selectedLocation,
          )
        : staffPerformanceData.filter(
            (staff) =>
              (selectedLocation === "All Location" ||
                staff.location === selectedLocation) &&
              (staff.name
                .toLowerCase()
                .includes(searchEmployee.toLowerCase()) ||
                staff.role
                  .toLowerCase()
                  .includes(searchEmployee.toLowerCase())),
          ),
    [searchEmployee, selectedLocation],
  );

  return (
    <div className="p-8 bg-black min-h-screen space-y-8">
      {/* --- Updated Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Performance Monitoring
          </h1>
          <p className="text-gray-500 text-sm">
            Compare locations and monitor staff punctuality
          </p>
        </div>

        {/* Filters Container */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Time Period Filter */}
          <div className="relative inline-block">
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="appearance-none bg-black text-white text-sm border border-[#968B79] rounded-lg px-4 py-2 pr-10 focus:outline-none cursor-pointer hover:bg-[#1A1A1A] transition-colors"
            >
              <option value="Today">Today</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#968B79]">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative inline-block">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-black text-white text-sm border border-[#968B79] rounded-lg px-4 py-2 pr-10 focus:outline-none cursor-pointer hover:bg-[#1A1A1A] transition-colors"
            >
              <option value="All Location">All Location</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#968B79]">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Task Status Filter */}
          <div className="relative inline-block">
            <select
              value={selectedTaskStatus}
              onChange={(e) => setSelectedTaskStatus(e.target.value)}
              className="appearance-none bg-black text-white text-sm border border-[#968B79] rounded-lg px-4 py-2 pr-10 focus:outline-none cursor-pointer hover:bg-[#1A1A1A] transition-colors"
            >
              <option value="All Status">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Overdue">Overdue</option>
              <option value="Awaiting Review">Awaiting Review</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#968B79]">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Employee Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              className="bg-black text-white text-sm border border-[#968B79] rounded-lg px-4 py-2 pl-10 focus:outline-none hover:bg-[#1A1A1A] transition-colors w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
      {/* ------------------------------ */}

      {/* 1. Top Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(selectedLocation === "All Location"
          ? locations
          : locations.filter((loc) => loc.name === selectedLocation)
        ).map((loc) => (
          <PerformanceStatCard
            key={loc.name}
            location={loc.name}
            percentage={loc.taskCompletion}
            color={loc.color}
          />
        ))}
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Comparison (Bars) */}
        <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1 text-lg">
            Location Comparison
          </h3>
          <p className="text-gray-500 text-xs mb-8">
            Task completion vs attendance rates
          </p>

          {/* --- TASK COMPLETION SUB-SECTION --- */}
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-gray-400 tracking-widest mb-4 uppercase">
              Task Completion
            </h4>
            <div className="space-y-4">
              {(selectedLocation === "All Location"
                ? locations
                : locations.filter((loc) => loc.name === selectedLocation)
              ).map((loc) => (
                <ComparisonBar
                  key={`${loc.name}-task`}
                  label={loc.name}
                  value={loc.taskCompletion}
                  color={loc.color}
                />
              ))}
            </div>
          </div>

          {/* Subtle Divider Line */}
          <div className="border-t border-gray-800/50 my-6" />

          {/* --- ATTENDANCE RATE SUB-SECTION --- */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 tracking-widest mb-4 uppercase">
              Attendance Rate
            </h4>
            <div className="space-y-4">
              {(selectedLocation === "All Location"
                ? locations
                : locations.filter((loc) => loc.name === selectedLocation)
              ).map((loc) => (
                <ComparisonBar
                  key={`${loc.name}-attendance`}
                  label={loc.name}
                  value={loc.attendanceRate}
                  color={loc.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Overview (Radials) */}
        {/* Right: Overview (Multi-colored Radials) */}
        <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold mb-1 text-lg">
              Location Performance Overview
            </h3>
            <p className="text-gray-500 text-xs mb-10">
              All performance dimensions per location
            </p>

            {/* The 5-Chart Grid */}
            <div className="grid grid-cols-3 gap-y-12 gap-x-4 mb-12">
              <PerformanceRadial
                label="Task Completion"
                avgValue={70}
                locations={locations.map((l) => ({
                  name: l.name,
                  color:
                    l.color.replace("bg-", "") === l.color
                      ? l.color
                      : "#6366F1" /* Fallback if using tailwind classes */,
                }))}
              />
              <PerformanceRadial
                label="Attendance Rate"
                avgValue={90}
                locations={locations.map((l) => ({
                  name: l.name,
                  color: l.color,
                }))}
              />
              <PerformanceRadial
                label="Timeliness"
                avgValue={81}
                locations={locations.map((l) => ({
                  name: l.name,
                  color: l.color,
                }))}
              />
              <PerformanceRadial
                label="Rating Score"
                avgValue={93}
                locations={locations.map((l) => ({
                  name: l.name,
                  color: l.color,
                }))}
              />
              <PerformanceRadial
                label="Staff Score"
                avgValue={66}
                locations={locations.map((l) => ({
                  name: l.name,
                  color: l.color,
                }))}
              />
            </div>
          </div>

          {/* Legend at the bottom */}
          <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 pt-6 border-t border-gray-800/50">
            {locations.map((loc) => (
              <div key={loc.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: loc.color }}
                />
                <span className="text-gray-400 text-xs">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Breakdown Section */}
      <EmployeeBreakdown
        data={filteredEmployees}
        showDailyRecords={searchEmployee !== ""}
      />

      {/* Task Log Section */}
      <TaskLog data={filteredTasks} />
    </div>
  );
}
