// types/verification.ts
import { z } from "zod";

export const verificationTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  requires_photo: z.boolean(),
  photo_url: z.string().nullable(),
  status: z.enum(["pending", "approved", "rejected", "overdue"]),
  due_date: z.string(),
  location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  created_by: z.object({
    id: z.number(),
    name: z.string(),
    role: z.string(),
  }),
  assigned_to: z.object({
    id: z.number(),
    name: z.string(),
    role: z.string(),
    email: z.string(),
  }),
  submitted_at: z.string().nullable(),
  created_at: z.string(),
});

export const verificationResponseSchema = z.object({
  stats: z.object({
    awaiting_review: z.number(),
    approved: z.number(),
    pending: z.number(),
    overdue: z.number(),
    rejected: z.number(),
  }),
  tab: z.string(),
  tasks: z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(verificationTaskSchema),
  }),
});