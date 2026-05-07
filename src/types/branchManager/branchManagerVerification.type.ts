import {
    TaskActionResponseSchema,
    TaskDetailSchema,
    TaskFrequencySchema,
  TaskUserSchema,
  VerificationResponseSchema,
  VerificationStatsSchema,
  VerificationTabSchema,
  VerificationTaskSchema,
  VerificationTasksMetaSchema,
  VerificationTaskStatusSchema,
} from "@/schema/branchManager/branchManagerVerification.schema";
import { z } from "zod";

export type VerificationTab = z.infer<typeof VerificationTabSchema>;
export type VerificationTaskStatus = z.infer<typeof VerificationTaskStatusSchema>;
export type TaskFrequency = z.infer<typeof TaskFrequencySchema>;
export type TaskUser = z.infer<typeof TaskUserSchema>;
export type TaskDetail = z.infer<typeof TaskDetailSchema>;
export type TaskActionResponse = z.infer<typeof TaskActionResponseSchema>;
export type VerificationTask = z.infer<typeof VerificationTaskSchema>;
export type VerificationStats = z.infer<typeof VerificationStatsSchema>;
export type VerificationTasksMeta = z.infer<typeof VerificationTasksMetaSchema>;
export type VerificationResponse = z.infer<typeof VerificationResponseSchema>;