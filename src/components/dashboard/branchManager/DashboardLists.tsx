/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { CheckSquare } from "lucide-react";
import Link from "next/link";

export function StaffList({ staff }: { staff: any[] }) {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold">Today&apos;s Staff</h3>
        <span className="text-gray-500 text-xs uppercase font-bold tracking-tighter">
          Feb 25
        </span>
      </div>
      <div className="space-y-6">
        {staff.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold border border-indigo-500/10">
                {s.initials}
              </div>
              <div>
                <p className="text-white text-sm font-bold">{s.name}</p>
                <p className="text-gray-500 text-[10px]">{s.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  s.status === "Present"
                    ? "bg-emerald-500"
                    : s.status === "Absent"
                      ? "bg-red-500"
                      : "bg-amber-500",
                )}
              />
              <span className="text-gray-400 text-[10px]">
                {s.status} {s.time && `(${s.time})`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskActivity({ tasks }: { tasks: any[] }) {
  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 flex-[1.5]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold">Recent Task Activity</h3>
        <Link href={"/tasks"}>
          <button className="text-indigo-400 text-xs font-bold hover:underline">
          All tasks →
        </button>
        </Link>
      </div>
      <div className="space-y-4">
        {tasks.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-2 rounded-lg bg-white/5",
                  t.status === "Overdue" ? "text-red-500" : "text-gray-400",
                )}
              >
                <CheckSquare size={16} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{t.title}</p>
                <p className="text-gray-500 text-[10px]">
                  Assigned to {t.assignee} · Due {t.due}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                t.status === "Awaiting Review"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : t.status === "Pending"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20",
              )}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
