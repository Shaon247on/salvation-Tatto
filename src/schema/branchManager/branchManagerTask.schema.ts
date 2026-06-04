import { z } from "zod";

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  assigned_to: z.number(),
  assigned_to_name: z.string(),
  assigned_to_role: z.string(),
  due_date: z.string(),
  status: z.string(),
  submitted_at: z.string(),
  is_recurring: z.boolean(),
  frequency: z.enum(["daily", "weekly", "monthly", "none"]),
  requires_photo: z.boolean(),
  can_edit: z.boolean(),
});

export const taskListSchema = z.object({
  location: z.string(),
  tasks: z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(taskSchema),
  }),
});

export const employeeSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role: z.string(),
  role_display: z.string(),
});

export const employeeResponseSchema = z.object({
  location: z.string(),
  location_id: z.number(),
  employees: z.array(employeeSchema),
});