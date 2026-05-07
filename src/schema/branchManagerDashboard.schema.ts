// src/schemas/branchManagerDashboard.schema.ts

import { z } from "zod";

export const todayAttendanceSchema = z.object({
  total: z.number(),
  present: z.number(),
  late: z.number(),
  absent: z.number(),
});

export const statsSchema = z.object({
  total_employees: z.number(),
  pending_verifications: z.number(),
  today_attendance: todayAttendanceSchema,
});

export const todayStaffSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  status: z.enum(["present", "late", "absent"]),
  late_minutes: z.number().nullable(),
  clock_in: z.string().nullable(),
});

export const recentTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  assigned_to: z.string(),
  due_date: z.string(),
  status: z.string(),
  status_display: z.string(),
});

export const branchManagerDashboardSchema = z.object({
  greeting: z.string(),
  date_display: z.string(),
  location_name: z.string(),
  stats: statsSchema,
  today_staff: z.array(todayStaffSchema),
  recent_tasks: z.array(recentTaskSchema),
});