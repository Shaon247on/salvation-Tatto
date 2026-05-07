/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Send, ChevronDown, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSendBulkNotificationMutation } from "@/redux/services/admin/notification/notificationsApi";
import { useGetEmployeesForDropdownQuery } from "@/redux/services/admin/tasks/taskApi";
import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";

interface Location {
  id: number;
  name: string;
}

export const SendNotificationForm = () => {
  const { isAuthenticated } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState<
    number | undefined
  >();
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch active locations from API - skip if no token
  const { data: locationsResponse, isLoading: isLoadingLocations } =
    useGetLocationsQuery(undefined, {
      skip: !isAuthenticated,
    });
  const activeLocations =
    locationsResponse?.locations?.filter((loc) => loc.status === "active") ||
    [];

  // Fetch employees for selected location
  const { data: employeesResponse, isLoading: isLoadingEmployees } =
    useGetEmployeesForDropdownQuery(selectedLocation as number, {
      skip: !selectedLocation, // Skip query if no location ID selected
    });

  const [sendBulkNotification, { isLoading: isSending }] =
    useSendBulkNotificationMutation();

  const employees = employeesResponse?.employees || [];

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedLocation(value);
    setSelectedEmails([]); // Clear selected emails when location changes
  };

  const handleEmailToggle = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === employees.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(employees.map((emp) => emp.email) || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatusMessage("Please enter a message");
      setFormStatus("error");
      return;
    }

    // Allow sending if:
    // 1. User selected specific employees (location selected)
    // 2. No location selected (send to all employees)
    const hasRecipients = selectedEmails.length > 0 || !selectedLocation;

    if (!hasRecipients) {
      setStatusMessage("Please select employees to send notification");
      setFormStatus("error");
      return;
    }

    try {
      await sendBulkNotification({
        emails: selectedEmails,
        location: selectedLocation,
        message,
      }).unwrap();

      setFormStatus("success");
      setStatusMessage("Notification sent successfully!");
      setMessage("");
      setSelectedEmails([]);

      setTimeout(() => setFormStatus("idle"), 3000);
    } catch (error) {
      setFormStatus("error");
      setStatusMessage("Failed to send notification. Please try again.");
    }
  };

  const allEmployeesSelected =
    selectedEmails.length === employees.length && employees.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
          <Send size={18} className="text-gray-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Send Notification</h3>
          <p className="text-gray-500 text-xs">
            Notify employees about important updates
          </p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {/* Status Message */}
        {formStatus !== "idle" && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              formStatus === "success"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            {formStatus === "success" ? (
              <CheckCircle size={18} className="text-emerald-500" />
            ) : (
              <AlertCircle size={18} className="text-red-500" />
            )}
            <p
              className={`text-sm ${
                formStatus === "success" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {statusMessage}
            </p>
          </div>
        )}

        {/* Location Selection */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
            Branch
          </label>
          <div className="relative">
            <select
              value={selectedLocation || ""}
              onChange={handleLocationChange}
              disabled={isLoadingLocations}
              className="w-full bg-black border border-[#968B79]/60 rounded-xl p-4 text-sm text-white appearance-none outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {isLoadingLocations ? "Loading branches..." : "Select Branch"}
              </option>
              {activeLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            />
          </div>
        </div>

        {/* Employee Selection */}
        {isLoadingEmployees && selectedLocation && (
          <div className="text-center text-gray-500 text-sm py-4">
            Loading employees...
          </div>
        )}

        {!isLoadingEmployees && selectedLocation && employees.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-gray-500">
                Select Recipients ({selectedEmails.length}/{employees.length})
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] text-blue-400 hover:text-blue-300 underline"
              >
                {allEmployeesSelected ? "Clear All" : "Select All"}
              </button>
            </div>

            <div className="bg-black border border-[#968B79]/60 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto">
              {employees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(employee.email)}
                    onChange={() => handleEmailToggle(employee.email)}
                    className="w-4 h-4 rounded border-gray-600 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white truncate">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 whitespace-nowrap">
                        {employee.role_display || employee.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {employee.email}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {!isLoadingEmployees && selectedLocation && employees.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            No employees found at this location
          </div>
        )}

        {!selectedLocation && (
          <div className="text-center text-gray-400 text-sm py-4 px-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-blue-400 font-semibold">No location selected</p>
            <p className="text-xs mt-1">
              Message will be sent to all employees
            </p>
          </div>
        )}

        {/* Message Input */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="w-full bg-black border border-[#968B79]/60 rounded-2xl p-4 text-sm text-white min-h-24 outline-none resize-none focus:border-white/40"
          />
          <p className="text-[10px] text-gray-500">
            {message.length} characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          Boolean(isSending) ||
          Boolean(isLoadingEmployees) ||
          Boolean(selectedLocation && selectedEmails.length === 0)
        }
        className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={18} /> {isSending ? "Sending..." : "Send Notification"}
      </button>
    </form>
  );
};
