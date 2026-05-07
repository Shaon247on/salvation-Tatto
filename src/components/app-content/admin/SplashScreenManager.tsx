// "use client";

// import React, { useState, useRef } from "react";
// import Image from "next/image"; // Import Next.js Image component
// import { Upload, AlertCircle } from "lucide-react";
// import { useUpdateSplashScreenMutation } from "@/redux/services/admin/appContent/appContentApi";

// export const SplashScreenManager = ({
//   currentImage,
//   onRefresh,
// }: {
//   currentImage: string;
//   onRefresh?: () => void;
// }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Mutation hook
//   const [updateSplashScreen, { isLoading: isSaving }] =
//     useUpdateSplashScreenMutation();

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError("File size must be less than 5MB");
//         return;
//       }
//       setError(null);
//       setSelectedFile(file);
//       // Create a local URL to preview the image before saving
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedFile) {
//       setError("Please select an image to save");
//       return;
//     }

//     try {
//       setError(null);
//       // Create FormData for multipart upload
//       const formData = new FormData();
//       formData.append("image", selectedFile);

//       // Call the mutation
//       await updateSplashScreen(formData).unwrap();

//       setSuccess("Splash screen updated successfully!");
//       setPreviewUrl(null);
//       setSelectedFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       // Refresh parent data
//       if (onRefresh) {
//         setTimeout(onRefresh, 500);
//       }

//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(
//         err?.data?.detail ||
//           err?.data?.error ||
//           "Failed to update splash screen",
//       );
//     }
//   };

//   const handleCancel = () => {
//     setPreviewUrl(null);
//     setSelectedFile(null);
//     setError(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* Error Alert */}
//       {error && (
//         <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 items-start">
//           <AlertCircle
//             size={18}
//             className="text-red-500 mt-0.5 flex-shrink-0"
//           />
//           <div>
//             <p className="text-red-400 text-sm font-medium">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Success Alert */}
//       {success && (
//         <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex gap-3 items-start">
//           <div className="w-4 h-4 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
//           <p className="text-emerald-400 text-sm font-medium">{success}</p>
//         </div>
//       )}

//       <div className="space-y-1">
//         <h3 className="text-white font-bold text-lg">Splash Screen Image</h3>
//         <p className="text-gray-500 text-xs">
//           Upload a splash screen image that will appear when the mobile app
//           launches.
//           <br />
//           Recommended portrait image format for mobile screens.
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8 items-start">
//         {/* Hidden Input */}
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept="image/*"
//           className="hidden"
//         />

//         <div className="relative group">
//           <div className="w-70 h-112.5 rounded-[32px] overflow-hidden border border-[#262626] bg-[#0A0A0A] shadow-2xl relative flex items-center justify-center">
//             {previewUrl || currentImage ? (
//               <Image
//                 src={previewUrl || currentImage}
//                 alt="Splash Preview"
//                 fill
//                 className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
//                 priority
//               />
//             ) : (
//               <div className="text-center space-y-2">
//                 <p className="text-gray-500 text-xs">No image uploaded yet</p>
//                 <p className="text-gray-600 text-[10px]">
//                   Upload an image to get started
//                 </p>
//               </div>
//             )}
//             {previewUrl && (
//               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                 <p className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10">
//                   Preview Mode
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <button
//             onClick={handleUploadClick}
//             className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all shadow-lg active:scale-95"
//           >
//             <Upload size={18} /> Upload Image
//           </button>

//           {previewUrl && (
//             <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
//               New image ready to save
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-3 pt-8 border-t border-[#1A1A1A]">
//         <button
//           onClick={handleSave}
//           disabled={!selectedFile || isSaving}
//           className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//         >
//           {isSaving ? (
//             <>
//               <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
//               Saving...
//             </>
//           ) : (
//             "Save Changes"
//           )}
//         </button>
//         <button
//           onClick={handleCancel}
//           disabled={isSaving}
//           className="bg-black border border-[#262626] text-gray-500 px-8 py-3 rounded-xl font-bold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateSplashScreenMutation } from "@/redux/services/admin/appContent/appContentApi";

interface SectionProps {
  title: string;
  desc: string;
  current: string | undefined;
  type: "web" | "app"; // Aligned with API types
  onRefresh?: () => void;
}

const UploadSection = ({
  title,
  desc,
  current,
  type,
  onRefresh,
}: SectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Single mutation used for both, passing 'type' in FormData
  const [updateSplash, { isLoading }] = useUpdateSplashScreenMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setSuccess(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type); // KEY: Send "web" or "app" to backend

      await updateSplash(formData).unwrap();

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleCancel();
        if (onRefresh) onRefresh();
      }, 2000);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-gray-500 text-[11px] leading-relaxed max-w-70">
            {desc}
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
        >
          <Upload size={14} /> Upload Image
        </button>
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="relative w-full aspect-square rounded-[24px] overflow-hidden border border-[#262626] bg-[#0A0A0A] shadow-2xl flex items-center justify-center">
        {preview || current ? (
          <Image
            src={preview || current || ""}
            alt={title}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              preview ? "opacity-100" : "opacity-60",
            )}
            priority
          />
        ) : (
          <p className="text-gray-600 text-xs italic">No image uploaded</p>
        )}

        {preview && !success && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase">
            New Preview
          </div>
        )}

        {success && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
            <CheckCircle2 size={40} className="text-emerald-500 mb-2" />
            <p className="text-emerald-500 font-bold text-sm">
              Saved Successfully
            </p>
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex gap-3 transition-all duration-300",
          file
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 bg-[#111] border border-[#262626] text-gray-500 py-3 rounded-xl text-sm font-bold hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const SplashScreenManager = ({
  currentWebsiteImage,
  currentMobileImage,
  onRefresh,
}: {
  currentWebsiteImage?: string;
  currentMobileImage?: string;
  onRefresh?: () => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-700">
      <UploadSection
        title="Splash Screen (Website)"
        desc="Upload a splash screen image for the web version."
        current={currentWebsiteImage}
        type="web"
        onRefresh={onRefresh}
      />
      <UploadSection
        title="Splash Screen (Mobile App)"
        desc="Upload a splash screen image for the mobile app version."
        current={currentMobileImage}
        type="app"
        onRefresh={onRefresh}
      />
    </div>
  );
};
