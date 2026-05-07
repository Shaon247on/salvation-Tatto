import { VerificationTask } from "@/types/districtManager/districtManagerVerification.type";

export const mapVerificationTask = (task: VerificationTask) => ({
  id: task.id,
  taskName: task.title,
  description: task.description,
  employeeName: task.assigned_to.name,
  role: task.assigned_to.role,
  location: task.location.name,
  submittedTime: task.submitted_at
    ? new Date(task.submitted_at).toLocaleString()
    : "Not submitted",
  dueDate: task.due_date,
  status:
    task.status === "pending" ? "awaiting_review" : task.status,
  assignBy: task.created_by.role,
  imageUrl: task.photo_url,
});