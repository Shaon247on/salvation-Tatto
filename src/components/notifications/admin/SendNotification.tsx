"use client";

import {
  Send,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  useGetRecipientsQuery,
  useSendBulkNotificationMutation,
} from "@/redux/services/admin/notification/notificationsApi";

import { useGetLocationsQuery } from "@/redux/services/admin/location/locationApi";
import Image from "next/image";

export const SendNotificationForm = () => {
  const { isAuthenticated, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  // -----------------------------
  // Role-based access control
  // -----------------------------
  const userRole = user?.role;
  const isSuperAdmin = userRole === "super_admin";
  const isBranchManager = userRole === "branch_manager";

  // -----------------------------
  // Locations
  // -----------------------------
  const { data: locationsResponse, isLoading: isLoadingLocations } =
    useGetLocationsQuery(undefined, { skip: !isAuthenticated });

  const activeLocations =
    locationsResponse?.locations?.filter((l) => l.status === "active") || [];

  const userLocationId = user?.location?.id;

  // Auto-select location for branch manager
  useEffect(() => {
    if (isBranchManager && userLocationId) {
      setSelectedLocation(userLocationId);
    }
  }, [isBranchManager, userLocationId]);

  // -----------------------------
  // Fetch control
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
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
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
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => setFormStatus("idle"), 3000);
    } catch (err) {
      setFormStatus("error");
      setStatusMessage("Failed to send notification");
    }
  };

  const allSelected =
    recipients.length > 0 && selectedRecipients.length === recipients.length;

  // -----------------------------
  // Role-based role options
  // -----------------------------
  const getRoleOptions = () => {
    const roles = [
      { value: "super_admin", label: "Super Admin" },
      { value: "staff", label: "Staff" },
      { value: "branch_manager", label: "Branch Manager" },
      { value: "district_manager", label: "District Manager" },
      { value: "tattoo_artist", label: "Tattoo Artist" },
      { value: "body_piercer", label: "Body Piercer" },
    ];

    // Remove "super_admin" only if the current user is a super admin
    if (isSuperAdmin) {
      return roles.filter((role) => role.value !== "super_admin");
    }

    // For branch managers, remove "branch_manager" but keep "super_admin"
    if (isBranchManager) {
      return roles.filter((role) => role.value !== "branch_manager");
    }

    // For all other users (district managers, etc.), show all roles including super_admin
    return roles;
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <form 
      className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 flex flex-col h-full"
      onSubmit={handleSubmit}
    >
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

        {/* Location - Hide for branch managers */}
        {!isBranchManager && (
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
        )}

        {/* Role */}
        <select
          value={selectedRole || ""}
          onChange={handleRoleChange}
          className="w-full bg-black border border-[#968B79]/60 rounded-xl p-4 text-white"
        >
          <option value="">Select Role</option>
          {getRoleOptions().map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
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

        {/* Image Attachment */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase text-gray-500 tracking-wider">
            Attach Image
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative group rounded-xl overflow-hidden border border-[#968B79]/60 bg-black/30">
              <div className="relative h-48 w-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                <p className="text-[10px] text-gray-300 truncate max-w-[150px]">
                  {selectedImage?.name}
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleTriggerFileInput}
              className="w-full border border-dashed border-[#968B79]/60 rounded-xl p-6 hover:border-[#968B79] transition-colors flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center border border-white/10">
                <Upload size={16} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Click to upload an image</p>
              <p className="text-[10px] text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </button>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSending}
        className="w-full mt-6 bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? "Sending..." : "Send Notification"}
      </button>
    </form>
  );
};