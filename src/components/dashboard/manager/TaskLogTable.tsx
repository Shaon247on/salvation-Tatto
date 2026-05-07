"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TaskLogItem } from "@/types/districtManager/districtManagerDashboard.type";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  awaiting_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  overdue: "bg-red-500/10 text-red-500 border-red-500/20",
};

interface Props {
  data: TaskLogItem[];
}

const TaskLogTable = ({ data }: Props) => {
  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[#1A1A1A]">
        <h3 className="text-white font-bold text-xl">Task Log</h3>
        <p className="text-gray-500 text-xs">
          {data?.length || 0} tasks found
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-[#0D0D0D]/50">
            <TableHead className="text-sm uppercase text-gray-400">
              Task
            </TableHead>
            <TableHead className="text-sm uppercase text-gray-400">
              Assigned To
            </TableHead>
            <TableHead className="text-sm uppercase text-gray-400">
              Location
            </TableHead>
            <TableHead className="text-sm uppercase text-gray-400">
              Assigned By
            </TableHead>
            <TableHead className="text-sm uppercase text-gray-400">
              Due Date
            </TableHead>
            <TableHead className="text-sm uppercase text-gray-400">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((task) => (
            <TableRow
              key={task.id}
              className="hover:bg-[#111111] transition-colors"
            >
              <TableCell className="text-white text-xs font-semibold">
                {task.title}
              </TableCell>

              <TableCell className="text-gray-400 text-xs">
                {task.assigned_to || "—"}
              </TableCell>

              <TableCell className="text-gray-500 text-xs">
                {task.location}
              </TableCell>

              <TableCell className="text-gray-400 text-xs">
                {task.assigned_by
                  ? `${task.assigned_by} (${task.assigned_by_role})`
                  : task.assigned_by_role}
              </TableCell>

              <TableCell className="text-gray-500 text-xs">
                {task.due_date}
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[0.6rem] font-bold uppercase tracking-wider border",
                    statusStyles[task.status]
                  )}
                >
                  {task.status.replace("_", " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskLogTable;