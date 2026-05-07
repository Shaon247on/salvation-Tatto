"use client";

import React, { useState } from "react";
import { Pencil, Trash2, CheckSquare } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface TaskProps {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  submittedDate?: string;
  status: "pending" | "awaiting_review" | "approved" | "rejected" | "overdue";
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskItem = ({
  title,
  description,
  assignee,
  dueDate,
  submittedDate,
  status,
  onEdit,
  onDelete,
}: TaskProps) => {
  const [open, setOpen] = useState(false);

  // Keep existing UI mapping (no structural change)
  const statusStyles: Record<string, string> = {
    Completed: "border-emerald-500/50 text-emerald-500",
    "In Progress": "border-blue-500/50 text-blue-500",
    Pending: "border-indigo-500/50 text-indigo-500",
    Overdue: "border-red-500/50 text-red-500",
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-black border-b border-[#1A1A1A] hover:bg-[#050505] transition-colors group">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="mt-1 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
            <CheckSquare size={20} />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h3 className="text-gray-200 font-bold text-sm underline decoration-gray-600 underline-offset-4 cursor-pointer hover:text-white">
                {title}
              </h3>
              <span
                className={`px-3 py-0.5 rounded border text-[10px] font-medium bg-transparent ${
                  statusStyles[status] || statusStyles["Pending"]
                }`}
              >
                {status}
              </span>
            </div>

            <p className="text-gray-500 text-xs mt-1">{description}</p>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400 font-medium">
              <span className="underline cursor-pointer hover:text-white">
                {assignee}
              </span>
              <span className="text-gray-700">:</span>
              <span>Due {dueDate}</span>
              {submittedDate && (
                <>
                  <span className="text-gray-700">:</span>
                  <span>Submitted {submittedDate}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-white border border-[#262626] rounded-lg transition-all"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => setOpen(true)}
            className="p-2 text-red-500/80 hover:text-red-500 border border-red-900/30 rounded-lg transition-all hover:bg-red-500/5"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ShadCN Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-[#0D0D0D] border border-[#262626] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="border border-[#262626] bg-transparent text-white hover:bg-[#1A1A1A]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskItem;