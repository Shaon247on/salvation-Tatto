import { z } from "zod";
import {
  verificationResponseSchema,
  verificationTaskSchema,
} from "@/schema/districtManager/districtManagerVerification.schhema";

export type VerificationTask = z.infer<typeof verificationTaskSchema>;
export type VerificationResponse = z.infer<typeof verificationResponseSchema>;

/* ----------------------------- Mutations ----------------------------- */
export type ApproveTaskResponse = {
  message: string;
};

export type RejectTaskRequest = {
  id: string;
  rejection_reason: string;
};

export type RejectTaskResponse = {
  message: string;
};
