"use client";

import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TaskItem from "./TaskItem";
import { useState } from "react";
import { TaskActionModal } from "../admin/TaskActionModal";
import { BranchManagerTaskCreationModel } from "./BranchManagerTaskCreationModel";
import { useCreateTaskByBranchManagerMutation, useDeleteTaskByBranchManagerMutation, useGetManagerTasksQuery, useUpdateTaskByBranchManagerMutation } from "@/redux/services/branchManager/task/theBranchManagerTaskApi";

export default function BranchManagerView() {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetManagerTasksQuery({
    page: 1,
    search,
  });

  const [createTask, { isLoading: isCreating }] =
    useCreateTaskByBranchManagerMutation();
  const [updateTask, { isLoading: isUpdating }] =
    useUpdateTaskByBranchManagerMutation();
  const [deleteTask] = useDeleteTaskByBranchManagerMutation();

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsActionModalOpen(true);
  };

  const handleSaveTask = async (formData: any) => {
    try {
      if (taskToEdit) {
        await updateTask({
          id: taskToEdit.id,
          data: formData,
        }).unwrap();
      } else {
        await createTask(formData).unwrap();
      }

      setIsActionModalOpen(false);
    } catch (err) {
      console.error("Task operation failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="min-h-screen bg-black p-8 font-sans text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className="text-gray-500 text-sm">
              Create and assign tasks across your branch
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 flex items-center gap-2"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-75">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#968B79]/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="border border-[#1A1A1A] rounded-2xl overflow-hidden bg-black">
          {isLoading ? (
            <p className="p-6 text-gray-400">Loading tasks...</p>
          ) : data?.tasks.results.length ? (
            data.tasks.results.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                description={task.description}
                assignee={task.assigned_to_name}
                dueDate={task.due_date}
                submittedDate={task.submitted_at}
                status={task.status}
                onEdit={() => {
                  setTaskToEdit(task);
                  setIsActionModalOpen(true);
                }}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          ) : (
            <p className="p-6 text-gray-500">No tasks found</p>
          )}
        </div>

        {/* Pagination (static for now) */}
        <div className="flex items-center justify-between pt-6 border-t border-[#1A1A1A]">
          <p className="text-gray-500 text-sm">
            Showing {data?.tasks.results.length || 0} results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#262626] rounded-lg text-gray-500">
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 rounded-lg border border-[#403E39] bg-[#1C1C1A] text-white">
              1
            </button>
            <button className="p-2 border border-[#262626] rounded-lg text-gray-500">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BranchManagerTaskCreationModel
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        initialData={taskToEdit}
        onSave={handleSaveTask}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}