import { z } from "zod";

export const VerificationTabSchema = z.enum([
  "awaiting_review",
  "approved",
  "rejected",
  "overdue",
]);

export const VerificationTaskStatusSchema = z.enum([
  "awaiting_review",
  "approved",
  "rejected",
  "overdue",
  "pending",
]);

export const TaskFrequencySchema = z.enum([
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "today",
]);

// ─── Slim Nested User (list endpoint: created_by) ─────────────────────────────

export const VerificationCreatedBySchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
});

// ─── Slim Nested User (list endpoint: assigned_to) ────────────────────────────

export const VerificationAssignedToSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
});

// ─── Rich Nested User (task detail / approve / reject responses) ──────────────
// Used for: assigned_to, created_by, completed_by, approved_by, rejected_by

export const TaskUserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  role_display: z.string(),
  location_name: z.string().optional(),
});

// ─── Task Detail ──────────────────────────────────────────────────────────────
// Returned by: GET /admin/manager/tasks/{id}/
//              POST /admin/manager/tasks/{id}/approve/
//              POST /admin/manager/tasks/{id}/reject/

export const TaskDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.number(),
  location_name: z.string(),
  assigned_to: TaskUserSchema,
  created_by: TaskUserSchema,
  due_date: z.string(),
  status: VerificationTaskStatusSchema,
  status_display: z.string(),
  is_recurring: z.boolean(),
  frequency: TaskFrequencySchema,
  requires_photo: z.boolean(),
  photo_url: z.string().nullable(),
  completed_by: TaskUserSchema.nullable(),
  completed_at: z.string().nullable(),
  approved_by: TaskUserSchema.nullable(),
  approved_at: z.string().nullable(),
  rejected_by: TaskUserSchema.nullable(),
  rejected_at: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  is_fired: z.boolean(),
  can_fire: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ─── Approve / Reject Action Response ────────────────────────────────────────

export const TaskActionResponseSchema = z.object({
  message: z.string(),
  task: TaskDetailSchema,
});

// ─── List Endpoint — Task Item (slim shape) ───────────────────────────────────

export const VerificationTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  requires_photo: z.boolean(),
  photo_url: z.string().nullable(),
  status: VerificationTaskStatusSchema,
  due_date: z.string(),
  location_name: z.string(),
  created_by: VerificationCreatedBySchema,
  assigned_to: VerificationAssignedToSchema,
  submitted_at: z.string().nullable(),
  created_at: z.string(),
  approved_by: z.string().nullable(),
  approved_at: z.string().nullable(),
  rejected_by: z.string().nullable(),
  rejected_at: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  can_edit: z.boolean(),
  can_delete: z.boolean(),
});

// ─── Stats ────────────────────────────────────────────────────────────────────

export const VerificationStatsSchema = z.object({
  awaiting_review: z.number(),
  approved: z.number(),
  pending: z.number(),
  overdue: z.number(),
  rejected: z.number(),
});

// ─── Paginated Task List ──────────────────────────────────────────────────────

export const VerificationTasksMetaSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(VerificationTaskSchema),
});

// ─── Full List Response ───────────────────────────────────────────────────────

export const VerificationResponseSchema = z.object({
  stats: VerificationStatsSchema,
  tab: VerificationTabSchema,
  tasks: VerificationTasksMetaSchema,
});
