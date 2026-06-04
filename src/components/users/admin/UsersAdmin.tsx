"use client";

import React, { useState, useCallback, useMemo } from "react";
import { UserManagementHeader } from "./UserManagementHeader";
import { UserTable } from "./UserTable";
import { UserActionModal } from "./UserActionModal";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/services/admin/users/userService";

// ... (AVATAR_COLORS, formatDate, convertTo24Hour, transformScheduleToAPI, getInitials, mapApiUserToUIUser stay exactly the same)

const AVATAR_COLORS = [
  "bg-purple-600",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-red-600",
  "bg-indigo-600",
  "bg-blue-600",
];

const getAvatarColor = (index: number) =>
  AVATAR_COLORS[index % AVATAR_COLORS.length];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const convertTo24Hour = (time12: string): string => {
  if (!time12 || time12.includes(":00")) return time12;
  const [time, period] = time12.split(" ");
  let [hours] = time.split(":").map(Number);
  const minutes = time.split(":")[1] ? Number(time.split(":")[1]) : 0;
  if (period === "PM" && hours !== 12) hours += 12;
  else if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const transformScheduleToAPI = (schedule: any[]) => {
  return schedule.map((item) => ({
    day: item.day.slice(0, 3).toLowerCase(),
    is_active: item.enabled,
    start_time: item.enabled ? convertTo24Hour(item.start) : null,
    end_time: item.enabled ? convertTo24Hour(item.end) : null,
  }));
};

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last;
};

const mapApiUserToUIUser = (user: any, index: number) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  handle: `@${user.username}`,
  role: user.role_display || user.role,
  location: user.location_name,
  joined: formatDate(user.date_joined),
  status: user.is_active ? "Active" : "Inactive",
  initials: getInitials(user.first_name, user.last_name),
  avatarColor: getAvatarColor(index),
  apiData: user,
});

export default function UsersAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const token = useAppSelector(selectCurrentToken);

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetUsersQuery(
    { search: searchQuery, page: currentPage },
    { skip: !token },
  );

  console.log("the user data:",apiResponse)

  React.useEffect(() => {
    if (token && !isLoading) refetch();
  }, [token, refetch, isLoading]);

  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = useMemo(() => {
    if (!apiResponse?.users?.results) return [];
    return apiResponse.users.results.map((user, index) =>
      mapApiUserToUIUser(user, index),
    );
  }, [apiResponse]);

  const totalPages = useMemo(() => {
    if (!apiResponse?.users?.count) return 1;
    return Math.ceil(apiResponse.users.count / 5);
  }, [apiResponse]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // --- UPDATED SAVE LOGIC ---
  const handleSave = useCallback(
    async (formData: any) => {
      try {
        // 1. Build the base payload with common fields
        const payload: any = {
          first_name: formData.fullName.split(" ")[0],
          last_name: formData.fullName.split(" ").slice(1).join(" "),
          email: formData.email,
          role: formData.role,
          location: parseInt(formData.location),
          status: formData.status,
        };

        // 2. Add work_schedules for all roles except clock_in_user
        if (formData.role !== "clock_in_user") {
          payload.work_schedules = transformScheduleToAPI(formData.schedule);
        }

        // 3. Handle password (optional for edit)
        if (formData.password) {
          payload.password = formData.password;
        }

        if (selectedUser) {
          // UPDATE USER
          await updateUser({
            id: selectedUser.apiData.id,
            ...payload, // Payload will NOT contain work_schedules for managers
          }).unwrap();
        } else {
          // CREATE USER
          payload.username = formData.email.split("@")[0];
          await addUser(payload as any).unwrap();
        }

        setIsModalOpen(false);
      } catch (err: any) {
        // Avoid noisy raw object logging that can trigger Next.js overlays in dev.
        const data = err?.data || err?.response?.data || (typeof err === "string" ? err : undefined) || err;
        if (data) console.warn("Save failed:", data);
        else console.warn("Save failed");
        if (data && typeof data === "object") {
          const fieldErrors: Record<string, string> = {};
          Object.keys(data).forEach((k) => {
            const v = (data as any)[k];
            if (Array.isArray(v) && v.length) fieldErrors[k] = String(v[0]);
            else if (typeof v === "string") fieldErrors[k] = v;
          });
          return fieldErrors;
        }
        return { non_field_errors: "An unexpected error occurred" };
      }
    },
    [selectedUser, addUser, updateUser],
  );

  if (isLoading)
    return (
      <div className="p-10 bg-black min-h-screen text-white">Loading...</div>
    );

  return (
    <div className="space-y-6 p-4 bg-black min-h-screen">
      <UserManagementHeader
        onOpenModal={handleCreate}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        stats={apiResponse?.stats}
      />

      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center">
          <h3 className="text-white font-bold">
            All Users ({apiResponse?.users?.count || 0})
          </h3>
        </div>

        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={(u) => deleteUser(u.id)}
        />

        <div className="p-6 flex justify-center gap-2 border-t border-[#1A1A1A]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-8 h-8 rounded-lg border text-xs font-bold transition-all",
                currentPage === page
                  ? "bg-white text-black border-white"
                  : "border-[#1A1A1A] text-gray-500 hover:border-[#404040]",
              )}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <UserActionModal
          key={selectedUser?.id || "new-user"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedUser}
          onSave={handleSave}
          isLoading={isAddingUser || isUpdatingUser}
        />
      )}
    </div>
  );
}
