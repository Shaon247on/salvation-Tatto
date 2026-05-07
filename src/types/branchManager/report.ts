import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const ReportPeriodSchema = z.enum([
  "today",
  "weekly",
  "monthly",
  "yearly",
]);

export const ReportStatusSchema = z.enum([
  "approved",
  "pending",
  "overdue",
  "rejected",
]);

// ─── Query Params ─────────────────────────────────────────────────────────────

export const ReportQueryParamsSchema = z.object({
  period: ReportPeriodSchema.optional(),
  status: ReportStatusSchema.optional(),
  search: z.string().optional(),
});

// ─── Stats ────────────────────────────────────────────────────────────────────

export const ReportStatsSchema = z.object({
  completed: z.number(),
  overdue: z.number(),
  in_progress: z.number(),
  avg_attendance: z.number(),
});

// ─── Task Completion Chart ────────────────────────────────────────────────────

export const TaskCompletionChartItemSchema = z.object({
  employee: z.string(),
  completed: z.number(),
  overdue: z.number(),
});

// ─── Attendance Chart ─────────────────────────────────────────────────────────

export const AttendanceChartItemSchema = z.object({
  employee: z.string(),
  attendance_rate: z.number(),
});

// ─── Employee Breakdown ───────────────────────────────────────────────────────

export const EmployeeBreakdownItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  total_present: z.number(),
  total_late: z.number(),
  total_absent: z.number(),
  attendance_rate: z.number(),
  completed: z.number(),
  overdue: z.number(),
});

// ─── Task Log ─────────────────────────────────────────────────────────────────

export const TaskLogItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  assigned_to: z.string(),
  assigned_by: z.string(),
  due_date: z.string(),
  status: ReportStatusSchema,
});

// ─── Task Log Meta ────────────────────────────────────────────────────────────

export const TaskLogMetaSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

// ─── Full Report Response ─────────────────────────────────────────────────────

export const BranchManagerReportResponseSchema = z.object({
  period: ReportPeriodSchema,
  stats: ReportStatsSchema,
  task_completion_chart: z.array(TaskCompletionChartItemSchema),
  attendance_chart: z.array(AttendanceChartItemSchema),
  employee_breakdown: z.array(EmployeeBreakdownItemSchema),
  task_log: z.array(TaskLogItemSchema),
  task_log_meta: TaskLogMetaSchema,
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type ReportPeriod = z.infer<typeof ReportPeriodSchema>;
export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export type ReportQueryParams = z.infer<typeof ReportQueryParamsSchema>;
export type ReportStats = z.infer<typeof ReportStatsSchema>;
export type TaskCompletionChartItem = z.infer<typeof TaskCompletionChartItemSchema>;
export type AttendanceChartItem = z.infer<typeof AttendanceChartItemSchema>;
export type EmployeeBreakdownItem = z.infer<typeof EmployeeBreakdownItemSchema>;
export type TaskLogItem = z.infer<typeof TaskLogItemSchema>;
export type TaskLogMeta = z.infer<typeof TaskLogMetaSchema>;
export type BranchManagerReportResponse = z.infer<typeof BranchManagerReportResponseSchema>;