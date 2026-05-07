/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { LocationTable } from "./LocationTable";
import { LocationActionModal } from "./LocationActionModal";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  Location,
} from "@/redux/services/admin/location/locationApi";

// Map API location to UI format
const mapApiLocationToUI = (loc: Location) => ({
  id: loc.id,
  name: loc.name,
  address: loc.street_address,
  city: loc.city_state,
  staffCount: loc.staff_count,
  status: loc.status === "active" ? "Active" : "Inactive",
  apiData: loc,
});

export default function LocationManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  // Get token from Redux
  const token = useAppSelector(selectCurrentToken);

  // API Queries & Mutations - skip if no token
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useGetLocationsQuery(undefined, {
    skip: !token,
  });

  // Automatically refetch when token becomes available (after rehydration)
  React.useEffect(() => {
    if (token && !isLoading) {
      refetch();
    }
  }, [token, refetch, isLoading]);
  const [addLocation, { isLoading: isAddingLocation }] =
    useAddLocationMutation();
  const [updateLocation, { isLoading: isUpdatingLocation }] =
    useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

  // Map API locations to UI format
  const locations = (apiResponse?.locations || []).map((loc) =>
    mapApiLocationToUI(loc),
  );

  const handleEdit = (loc: any) => {
    setSelectedLocation(loc);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(
    async (loc: any) => {
      if (
        window.confirm(
          `Are you sure you want to delete "${loc.name}"? This action cannot be undone.`,
        )
      ) {
        try {
          await deleteLocation(loc.id).unwrap();
        } catch (err) {
          console.error("Delete failed:", err);
        }
      }
    },
    [deleteLocation],
  );

  const handleSave = useCallback(
    async (formData: any) => {
      try {
        if (selectedLocation) {
          // Update existing location
          await updateLocation({
            id: selectedLocation.apiData.id,
            data: {
              name: formData.studioName,
              street_address: formData.streetAddress,
              city_state: formData.cityState,
              status: formData.status === "Active" ? "active" : "inactive",
            },
          }).unwrap();
        } else {
          // Create new location
          await addLocation({
            name: formData.studioName,
            street_address: formData.streetAddress,
            city_state: formData.cityState,
            status: formData.status === "Active" ? "active" : "inactive",
          }).unwrap();
        }
        setIsModalOpen(false);
      } catch (err) {
        console.error("Save failed:", err);
      }
    },
    [selectedLocation, addLocation, updateLocation],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 p-4 bg-black min-h-screen text-white">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-[#1A1A1A] rounded-[32px]" />
          <div className="h-80 bg-[#1A1A1A] rounded-[32px]" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 p-4 bg-black min-h-screen text-white">
        <div className="bg-red-500/10 border border-red-500/20 rounded-[32px] p-6 text-red-500">
          Failed to load locations. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Location Management
          </h1>
          <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest">
            SALVATION TATTOO LOUNGE · Super Admin Panel
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          <Plus size={18} /> Add Location
        </button>
      </div>

      {/* 2. Horizontal Stat Bar */}
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 flex items-center justify-around text-center">
        <div>
          <h2 className="text-4xl font-bold mb-1">
            {apiResponse?.stats?.total_locations || 0}
          </h2>
          <p className="text-gray-500 text-xs font-medium">Total Locations</p>
        </div>
        <div className="w-px h-12 bg-[#1A1A1A]" />
        <div>
          <h2 className="text-4xl font-bold mb-1">
            {apiResponse?.stats?.total_staff || 0}
          </h2>
          <p className="text-gray-500 text-xs font-medium">Total Staff</p>
        </div>
        <div className="w-px h-12 bg-[#1A1A1A]" />
        <div>
          <h2 className="text-4xl font-bold mb-1">
            {apiResponse?.stats?.active_locations || 0}
          </h2>
          <p className="text-gray-500 text-xs font-medium">Active Locations</p>
        </div>
      </div>

      {/* 3. Locations Table Container */}
      <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl overflow-hidden">
        <LocationTable
          locations={locations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <div className="p-6 border-t border-[#1A1A1A] text-gray-600 text-[10px] uppercase font-bold tracking-widest">
          {locations.length} locations total
        </div>
      </div>

      {/* 4. Modal */}
      <LocationActionModal
        key={selectedLocation?.id || "new-loc"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedLocation}
        onSave={handleSave}
        isLoading={isAddingLocation || isUpdatingLocation}
      />
    </div>
  );
}
