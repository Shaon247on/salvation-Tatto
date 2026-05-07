// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useRef } from "react";
// import {
//   X,
//   Upload,
//   Users,
//   Briefcase,
//   FileText,
//   AlertCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   useCreateInstructionMutation,
//   CreateInstructionRequest,
// } from "@/redux/services/instructions/instructionApi";

// export const AddInstructionModal = ({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [createInstruction, { isLoading, error }] =
//     useCreateInstructionMutation();

//   // State for the entire form
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     selectedRole: "tattoo_artist", // Match backend values: "tattoo_artist", "body_piercer", "staff"
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   if (!isOpen) return null;

//   const handleBrowseClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     setSubmitError(null);

//     // Validation
//     if (!formData.title.trim()) {
//       setSubmitError("Title is required");
//       return;
//     }
//     if (!formData.description.trim()) {
//       setSubmitError("Description is required");
//       return;
//     }
//     if (!formData.selectedRole) {
//       setSubmitError("Please select a role");
//       return;
//     }

//     try {
//       // Create instruction request payload
//       const instructionData: CreateInstructionRequest = {
//         title: formData.title,
//         description: formData.description,
//         role_visibility: formData.selectedRole,
//         pdf_file: selectedFile || undefined,
//       };

//       // Call mutation - it automatically handles FormData vs JSON
//       await createInstruction(instructionData).unwrap();

//       // Reset form on success
//       setFormData({
//         title: "",
//         description: "",
//         selectedRole: "tattoo_artist",
//       });
//       setSelectedFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       // Close modal
//       onClose();
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to create instruction";
//       setSubmitError(errorMessage);
//       console.error("Failed to create instruction:", err);
//     }
//   };

//   const roles = [
//     {
//       id: "tattoo_artist",
//       label: "Tattoo Artists",
//       icon: Users,
//       color: "text-blue-400",
//       bg: "bg-blue-500/10",
//     },
//     {
//       id: "body_piercer",
//       label: "Body Piercers",
//       icon: Users,
//       color: "text-purple-400",
//       bg: "bg-purple-500/10",
//     },
//     {
//       id: "staff",
//       label: "Staff",
//       icon: Briefcase,
//       color: "text-amber-400",
//       bg: "bg-amber-500/10",
//     },
//   ];

//   return (
//     <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/90 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl">
//         {/* Header */}
//         <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D]">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/5 rounded-lg border border-white/10">
//               <FileText size={18} className="text-gray-400" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-white">Add Instruction</h2>
//               <p className="text-gray-500 text-xs font-medium">
//                 Upload a new operational document
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-500 hover:text-white transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-8 space-y-6">
//           {/* ERROR MESSAGE ALERT */}
//           {(submitError || error) && (
//             <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex gap-3">
//               <AlertCircle
//                 size={18}
//                 className="text-red-500 flex-shrink-0 mt-0.5"
//               />
//               <div>
//                 <p className="text-sm font-medium text-red-400">
//                   {submitError || "Failed to create instruction"}
//                 </p>
//                 {error && typeof error === "object" && "data" in error && (
//                   <p className="text-xs text-red-300/70 mt-1">
//                     {(error.data as any)?.message || "Please try again"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* TITLE FIELD */}
//           <div className="space-y-1.5">
//             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
//               Title
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               placeholder="e.g., Health & Safety Protocol"
//               disabled={isLoading}
//               className="w-full bg-black border border-[#262626] rounded-xl p-4 text-sm text-white outline-none focus:border-[#404040] disabled:opacity-50"
//             />
//           </div>

//           {/* DESCRIPTION FIELD */}
//           <div className="space-y-1.5">
//             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
//               Short Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               placeholder="Brief description of the instruction..."
//               disabled={isLoading}
//               className="w-full bg-black border border-[#262626] rounded-xl p-4 text-sm text-white min-h-25 resize-none outline-none focus:border-[#404040] disabled:opacity-50"
//             />
//           </div>

//           {/* FILE UPLOAD SECTION (OPTIONAL) */}
//           <div className="space-y-1.5">
//             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
//               Upload PDF File <span className="text-gray-600">(Optional)</span>
//             </label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept=".pdf"
//               disabled={isLoading}
//               className="hidden"
//             />
//             <div className="flex gap-2">
//               <div className="flex-1 bg-black border border-[#262626] rounded-xl p-4 text-sm text-gray-400 italic truncate">
//                 {selectedFile ? selectedFile.name : "No file selected"}
//               </div>
//               <button
//                 type="button"
//                 onClick={handleBrowseClick}
//                 disabled={isLoading}
//                 className="bg-[#111] border border-[#262626] px-6 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
//               >
//                 <Upload size={14} /> Browse
//               </button>
//             </div>
//           </div>

//           {/* ROLE VISIBILITY SELECTORS */}
//           <div className="space-y-3">
//             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
//               Role Visibility
//             </label>
//             <div className="grid grid-cols-3 gap-3">
//               {roles.map((role) => (
//                 <button
//                   key={role.id}
//                   type="button"
//                   onClick={() =>
//                     setFormData({ ...formData, selectedRole: role.id })
//                   }
//                   disabled={isLoading}
//                   className={cn(
//                     "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all disabled:opacity-50",
//                     formData.selectedRole === role.id
//                       ? "bg-white/5 border-white/20"
//                       : "bg-black border-[#262626] hover:border-white/10",
//                   )}
//                 >
//                   <role.icon size={18} className={role.color} />
//                   <span className="text-[10px] font-bold text-gray-400">
//                     {role.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t border-[#1A1A1A] flex gap-3 bg-[#0D0D0D]">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 py-4 border border-[#262626] text-white rounded-2xl font-bold hover:bg-[#1A1A1A] transition-all disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               "Add Instruction"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Users,
  Briefcase,
  FileText,
  AlertCircle,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CreateInstructionRequest,
  useCreateInstructionMutation,
} from "@/redux/services/admin/instructions/instructionApi";

export const AddInstructionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createInstruction, { isLoading, error }] =
    useCreateInstructionMutation();

  // State for the entire form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    selectedRole: "tattoo_artist",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!formData.title.trim()) {
      setSubmitError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setSubmitError("Description is required");
      return;
    }
    if (!formData.selectedRole) {
      setSubmitError("Please select a role");
      return;
    }

    try {
      const instructionData: CreateInstructionRequest = {
        title: formData.title,
        description: formData.description,
        role_visibility: formData.selectedRole,
        pdf_file: selectedFile || undefined,
      };

      await createInstruction(instructionData).unwrap();

      // Reset form
      setFormData({
        title: "",
        description: "",
        selectedRole: "tattoo_artist",
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create instruction";
      setSubmitError(errorMessage);
    }
  };

  const roles = [
    {
      id: "tattoo_artist",
      label: "Tattoo Artists",
      icon: Users,
      color: "text-blue-400",
    },
    {
      id: "body_piercer",
      label: "Body Piercers",
      icon: Users,
      color: "text-purple-400",
    },
    {
      id: "staff",
      label: "Staff",
      icon: Briefcase,
      color: "text-amber-400",
    },
    {
      id: "branch_manager",
      label: "Store Manager",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      id: "district_manager",
      label: "District Manager",
      icon: MapPin,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-[#262626] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <FileText size={18} className="text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Instruction</h2>
              <p className="text-gray-500 text-xs font-medium">
                Upload a new operational document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          {(submitError || error) && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  {submitError || "Failed to create instruction"}
                </p>
                {error && typeof error === "object" && "data" in error && (
                  <p className="text-xs text-red-300/70 mt-1">
                    {(error.data as any)?.message || "Please try again"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TITLE FIELD */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Health & Safety Protocol"
              disabled={isLoading}
              className="w-full bg-black border border-[#262626] rounded-xl p-4 text-sm text-white outline-none focus:border-[#404040] disabled:opacity-50 transition-all"
            />
          </div>

          {/* DESCRIPTION FIELD */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Short Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the instruction..."
              disabled={isLoading}
              className="w-full bg-black border border-[#262626] rounded-xl p-4 text-sm text-white min-h-24 resize-none outline-none focus:border-[#404040] disabled:opacity-50 transition-all"
            />
          </div>

          {/* FILE UPLOAD SECTION */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Upload PDF File <span className="text-gray-600">(Optional)</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              disabled={isLoading}
              className="hidden"
            />
            <div className="flex gap-2">
              <div className="flex-1 bg-black border border-[#262626] rounded-xl p-4 text-sm text-gray-400 italic truncate">
                {selectedFile ? selectedFile.name : "No file selected"}
              </div>
              <button
                type="button"
                onClick={handleBrowseClick}
                disabled={isLoading}
                className="bg-[#111] border border-[#262626] px-6 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                <Upload size={14} /> Browse
              </button>
            </div>
          </div>

          {/* ROLE VISIBILITY SELECTORS */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
              Role Visibility
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, selectedRole: role.id })
                  }
                  disabled={isLoading}
                  className={cn(
                    "p-4 rounded-2xl border flex flex-row items-center gap-3 transition-all disabled:opacity-50",
                    formData.selectedRole === role.id
                      ? "bg-white/5 border-white/20"
                      : "bg-black border-[#262626] hover:border-white/10",
                  )}
                >
                  <role.icon size={18} className={role.color} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1A1A1A] flex gap-3 bg-[#0D0D0D] shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-4 border border-[#262626] text-white rounded-2xl font-bold hover:bg-[#1A1A1A] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Add Instruction"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
