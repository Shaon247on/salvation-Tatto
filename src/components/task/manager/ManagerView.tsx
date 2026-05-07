/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ChevronDown,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TaskItem from "./TaskItem";
import { useState } from "react";
import { TaskActionModal } from "../admin/TaskActionModal";
import { useGetTasksByDistrictManagerQuery, useGetLocationsByDistrictManagerQuery, useDeleteTaskByDistrictManagerMutation, useCreateTaskByDistrictManagerMutation, useUpdateTaskByDistrictManagerMutation } from "@/redux/services/districtManager/distictManagerTaskApi";
import { DistrictManagerTaskActionModel } from "./DistrictManagerTaskActionModel";

export default function ManagerView() {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any | null>(null);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  // API Queries
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksByDistrictManagerQuery({
    location: selectedLocation,
    search: search || undefined,
    page
  });

  const { data: locationsData } = useGetLocationsByDistrictManagerQuery();
  const [deleteTask] = useDeleteTaskByDistrictManagerMutation();
const [createTask, { isLoading: isCreating }] = useCreateTaskByDistrictManagerMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskByDistrictManagerMutation();

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsActionModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setTaskToEdit(task);
    setIsActionModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  const handleSaveTask = async (formData: any) => {
    // Map the Modal State back to the API Request format
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.locationId,
      assigned_to: formData.assignToId,
      due_date: formData.dueDate,
      is_recurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : "today",
      requires_photo: formData.requirePhoto,
    };

    try {
      if (taskToEdit) {
        // UPDATE Logic
        await updateTask({ 
          id: taskToEdit.id, 
          body: payload 
        }).unwrap();
        console.log("Task updated successfully");
      } else {
        // CREATE Logic
        await createTask(payload).unwrap();
        console.log("Task created successfully");
      }
      
      setIsActionModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("An error occurred while saving the task.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="min-h-screen bg-black p-8 font-sans text-white">
        {/* 1. Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className="text-gray-500 text-sm">
              Create and assign tasks across all locations
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 flex items-center gap-2"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>

        {/* 2. Controls Section */}
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
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#968B79]/60 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <select 
              className="appearance-none bg-[#0A0A0A] border border-[#968B79]/60 rounded-xl px-4 py-2.5 text-sm cursor-pointer min-w-35 outline-none text-white"
              value={selectedLocation ?? ""}
              onChange={(e) => setSelectedLocation(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Locations</option>
              {locationsData?.locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Tasks List */}
        <div className="space-y-3 mb-10">
          {tasksLoading ? (
            <p className="text-center py-10 text-gray-500">Loading tasks...</p>
          ) : tasksData?.tasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              description={task.description}
              assignee={task.assigned_to_name}
              role={task.assigned_to_role}
              dueDate={task.due_date}
              location={task.location_name}
              status={task.status as any}
              onEdit={() => handleEdit(task)}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>

        {/* 4. Pagination Section */}
        <div className="flex items-center justify-between pt-6 border-t border-[#1A1A1A]">
          <p className="text-gray-500 text-sm">
            Showing {tasksData?.tasks.length ?? 0} of {tasksData?.tasks_meta.count ?? 0} results
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 border border-[#262626] rounded-lg text-gray-500 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 rounded-lg border border-[#403E39] bg-[#1C1C1A] text-white text-sm">
              {page}
            </button>
            <button 
              disabled={!tasksData?.tasks_meta.next}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-[#262626] rounded-lg text-gray-500 hover:text-white disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <DistrictManagerTaskActionModel
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        initialData={taskToEdit}
        onSave={handleSaveTask}
      />
    </div>
  );
}