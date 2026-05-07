/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete?: (user: any) => void;
  isLoading?: boolean;
}

export const UserTable = ({
  users,
  onEdit,
  onDelete,
  isLoading = false,
}: UserTableProps) => {
  return (
    <div className="mt-8 w-full">
      {/* --- Desktop View (Table) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-[#968B79]/60">
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Location</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-all group opacity-100"
                >
                  <td className="px-4 py-5 flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                        user.avatarColor,
                      )}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">
                        {user.name}
                      </p>
                      <p className="text-gray-600 text-xs italic">
                        {user.handle}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="bg-[#1A1A1A] text-gray-400 text-[10px] px-3 py-1 rounded-full border border-[#262626]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-gray-500 text-xs">
                    {user.location}
                  </td>
                  <td className="px-4 py-5 text-gray-500 text-xs">
                    {user.joined}
                  </td>
                  <td className="px-4 py-5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-5 text-right space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete?.(user)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Mobile View (Stacked Cards) --- */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white",
                      user.avatarColor,
                    )}
                  >
                    {user.initials}
                  </div>
                  <div>
                    <p className="text-white text-base font-bold">
                      {user.name}
                    </p>
                    <p className="text-gray-600 text-xs italic">
                      {user.handle}
                    </p>
                  </div>
                </div>
                <StatusBadge status={user.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-[#1A1A1A] py-3">
                <div>
                  <p className="text-[10px] uppercase text-gray-600 font-bold tracking-widest mb-1">
                    Role
                  </p>
                  <p className="text-gray-300 text-xs">{user.role}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-600 font-bold tracking-widest mb-1">
                    Joined
                  </p>
                  <p className="text-gray-300 text-xs">{user.joined}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase text-gray-600 font-bold tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-gray-300 text-xs">{user.location}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  onClick={() => onEdit(user)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-gray-300 rounded-lg text-sm font-medium hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => onDelete?.(user)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Reusable Status Badge to keep code clean
const StatusBadge = ({ status }: { status: string }) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "Active"
          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          : "bg-gray-600",
      )}
    />
    <span
      className={cn(
        "text-xs font-medium",
        status === "Active" ? "text-emerald-500" : "text-gray-600",
      )}
    >
      {status}
    </span>
  </div>
);
