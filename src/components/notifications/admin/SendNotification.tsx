"use client";

import {
  Send,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  useGetRecipientsQuery,
  useSendBulkNotificationMutation,
} from "@/redux/services/admin/notification/notificationsApi";

import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";
import Image from "next/image";

export const SendNotificationForm = () => {
  const { isAuthenticated } = useAuth();

  // -----------------------------
  // State
  // -----------------------------
  const [selectedLocation, setSelectedLocation] = useState<
    number | undefined
  >();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  // -----------------------------
  // Locations
  // -----------------------------
  const { data: locationsResponse, isLoading: isLoadingLocations } =
    useGetLocationsQuery(undefined, { skip: !isAuthenticated });

  const activeLocations =
    locationsResponse?.locations?.filter((l) => l.status === "active") || [];

  // -----------------------------
  // Fetch control (CRITICAL FIX)
  // -----------------------------
  const shouldFetchRecipients = Boolean(selectedLocation || selectedRole);

  // -----------------------------
  // Recipients API
  // -----------------------------
  const { data: recipientsResponse, isLoading: isLoadingRecipients } =
    useGetRecipientsQuery(
      {
        location: selectedLocation,
        role: selectedRole,
        search: "",
      },
      {
        skip: !shouldFetchRecipients,
      },
    );

  const recipients = recipientsResponse?.recipients || [];

  // -----------------------------
  // Mutation
  // -----------------------------
  const [sendBulkNotification, { isLoading: isSending }] =
    useSendBulkNotificationMutation();

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedLocation(value);
    setSelectedRecipients([]);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelectedRole(value);
    setSelectedRecipients([]);
  };

  const handleToggleRecipient = (id: number) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === recipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(recipients.map((r) => r.id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setFormStatus("error");
      setStatusMessage("Message is required");
      return;
    }

    const targetRecipients =
      selectedRecipients.length > 0
        ? selectedRecipients
        : recipients.map((r) => r.id);

    try {
      const formData = new FormData();

      targetRecipients.forEach((id) => {
        formData.append("recipients", String(id));
      });

      formData.append("message", message);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      if (selectedLocation) {
        formData.append("location", String(selectedLocation));
      }

      await sendBulkNotification(formData).unwrap();

      setFormStatus("success");
      setStatusMessage("Notification sent successfully");

      setMessage("");
      setSelectedRecipients([]);
      setSelectedImage(null);

      setTimeout(() => setFormStatus("idle"), 3000);
    } catch (err) {
      setFormStatus("error");
      setStatusMessage("Failed to send notification");
    }
  };

  const allSelected =
    recipients.length > 0 && selectedRecipients.length === recipients.length;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <form className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
          <Send size={18} className="text-gray-400" />
        </div>
        <div>
          <h3 className="text-white font-bold">Send Notification</h3>
          <p className="text-gray-500 text-xs">Broadcast updates</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {/* Status */}
        {formStatus !== "idle" && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl border ${
              formStatus === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}
          >
            {formStatus === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="text-sm">{statusMessage}</span>
          </div>
        )}

        {/* Location */}
        <select
          value={selectedLocation || ""}
          onChange={handleLocationChange}
          className="w-full bg-black border border-[#968B79]/60 rounded-xl p-4 text-white"
        >
          <option value="">Select Branch</option>
          {activeLocations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        {/* Role */}
        <select
          value={selectedRole || ""}
          onChange={handleRoleChange}
          className="w-full bg-black border border-[#968B79]/60 rounded-xl p-4 text-white"
        >
          <option value="">Select Role</option>
          <option value="staff">Staff</option>
          <option value="branch_manager">Branch Manager</option>
          <option value="district_manager">District Manager</option>
          <option value="tattoo_artist">Tattoo Artist</option>
          <option value="body_piercer">Body Piercer</option>
        </select>

        {/* Recipients */}
        {shouldFetchRecipients && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase text-gray-500">
                Recipients ({selectedRecipients.length}/{recipients.length})
              </label>

              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] text-blue-400"
              >
                {allSelected ? "Clear All" : "Select All"}
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto border border-[#968B79]/60 rounded-xl p-3 space-y-2">
              {isLoadingRecipients ? (
                <p className="text-xs text-gray-400">Loading...</p>
              ) : recipients.length === 0 ? (
                <p className="text-xs text-gray-500">No recipients found</p>
              ) : (
                recipients.map((r) => (
                  <label key={r.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(r.id)}
                      onChange={() => handleToggleRecipient(r.id)}
                    />
                    <div>
                      <p className="text-white text-sm">
                        {r.first_name} {r.last_name}
                      </p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                      <p className="text-[10px] text-blue-400">{r.role}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Message */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-black border border-[#968B79]/60 rounded-2xl p-4 text-white min-h-24"
          placeholder="Message..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSending}
        className="w-full mt-6 bg-white text-black py-4 rounded-2xl font-bold"
      >
        {isSending ? "Sending..." : "Send Notification"}
      </button>
    </form>
  );
};
