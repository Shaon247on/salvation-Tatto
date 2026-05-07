// "use client";

// import React, { useState } from "react";
// import { cn } from "@/lib/utils";
// import { SplashScreenManager } from "./SplashScreenManager";
// import { FAQManager } from "./FAQManager";
// import { useAppSelector } from "@/redux/store";
// import { selectCurrentToken } from "@/redux/features/auth/authSlice";
// import {
//   useGetFAQsQuery,
//   useCreateFAQMutation,
//   useUpdateFAQMutation,
//   useDeleteFAQMutation,
//   useGetSplashScreenQuery,
// } from "@/redux/services/admin/appContent/appContentApi";
// import { Loader2 } from "lucide-react";

// export default function AppContentAdmin() {
//   const [activeTab, setActiveTab] = useState("splash");

//   // Get token from Redux
//   const token = useAppSelector(selectCurrentToken);

//   // Splash Screen Query
//   const {
//     data: splashData,
//     isLoading: splashLoading,
//     refetch: refetchSplash,
//   } = useGetSplashScreenQuery(undefined, { skip: !token });

//   // FAQ Queries & Mutations
//   const {
//     data: faqData,
//     isLoading: faqLoading,
//     refetch: refetchFAQs,
//   } = useGetFAQsQuery({ page: 1 }, { skip: !token });
//   const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
//   const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
//   const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

//   // Automatically refetch when token becomes available
//   React.useEffect(() => {
//     if (token) {
//       refetchSplash();
//       refetchFAQs();
//     }
//   }, [token, refetchSplash, refetchFAQs]);

//   // Extract FAQs from response
//   const faqs = faqData?.results || [];

//   return (
//     <div className="space-y-8 p-4 bg-black min-h-screen text-white">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">
//           App Content Management
//         </h1>
//         <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest italic">
//           Manage mobile app splash screen image and FAQ content.
//         </p>
//       </div>

//       {/* Main Container */}
//       <div className="bg-[#968B79]/10 border border-[#1A1A1A] rounded-[40px] p-2">
//         {/* Tabs Bar */}
//         <div className="flex gap-2 p-4 border-b border-[#1A1A1A]">
//           <button
//             onClick={() => setActiveTab("splash")}
//             className={cn(
//               "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
//               activeTab === "splash"
//                 ? "bg-[#111] text-white border border-[#262626]"
//                 : "text-gray-500 hover:text-gray-300",
//             )}
//           >
//             Splash Screen
//             {activeTab === "splash" && splashLoading && (
//               <Loader2 size={14} className="animate-spin" />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("faq")}
//             className={cn(
//               "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
//               activeTab === "faq"
//                 ? "bg-[#111] text-white border border-[#262626]"
//                 : "text-gray-500 hover:text-gray-300",
//             )}
//           >
//             FAQ
//             {activeTab === "faq" && faqLoading && (
//               <Loader2 size={14} className="animate-spin" />
//             )}
//           </button>
//         </div>

//         {/* Dynamic Content */}
//         <div className="p-8">
//           {activeTab === "splash" ? (
//             // <SplashScreenManager
//             //   currentImage={splashData?.image_url}
//             //   onRefresh={refetchSplash}
//             // />

//             <SplashScreenManager
//               currentWebsiteImage={splashData?.image_url}
//               currentMobileImage={splashData?.image_url}
//               onRefresh={refetchSplash}
//             />
//           ) : (
//             <FAQManager
//               faqs={faqs}
//               onCreateFAQ={createFAQ}
//               onUpdateFAQ={updateFAQ}
//               onDeleteFAQ={deleteFAQ}
//               isCreating={isCreating}
//               isUpdating={isUpdating}
//               isDeleting={isDeleting}
//               onRefresh={() => refetchFAQs()}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SplashScreenManager } from "./SplashScreenManager";
import { FAQManager } from "./FAQManager";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useGetSplashScreenQuery,
} from "@/redux/services/admin/appContent/appContentApi";
import { Loader2 } from "lucide-react";

export default function AppContentAdmin() {
  const [activeTab, setActiveTab] = useState("splash");
  const token = useAppSelector(selectCurrentToken);

  // Fetch Web Splash Screen
  const {
    data: webSplashData,
    isLoading: webLoading,
    refetch: refetchWeb,
  } = useGetSplashScreenQuery("web", { skip: !token });

  // Fetch App Splash Screen
  const {
    data: appSplashData,
    isLoading: appLoading,
    refetch: refetchApp,
  } = useGetSplashScreenQuery("app", { skip: !token });

  // FAQ Queries & Mutations
  const {
    data: faqData,
    isLoading: faqLoading,
    refetch: refetchFAQs,
  } = useGetFAQsQuery({ page: 1 }, { skip: !token });

  const [createFAQ, { isLoading: isCreating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const handleRefreshSplash = () => {
    refetchWeb();
    refetchApp();
  };

  const faqs = faqData?.results || [];

  return (
    <div className="space-y-8 p-4 bg-black min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          App Content Management
        </h1>
        <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest italic">
          Manage mobile app splash screen image and FAQ content.
        </p>
      </div>

      <div className="bg-[#968B79]/10 border border-[#1A1A1A] rounded-[40px] p-2">
        <div className="flex gap-2 p-4 border-b border-[#1A1A1A]">
          <button
            onClick={() => setActiveTab("splash")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeTab === "splash"
                ? "bg-[#111] text-white border border-[#262626]"
                : "text-gray-500 hover:text-gray-300",
            )}
          >
            Splash Screen
            {activeTab === "splash" && (webLoading || appLoading) && (
              <Loader2 size={14} className="animate-spin" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
              activeTab === "faq"
                ? "bg-[#111] text-white border border-[#262626]"
                : "text-gray-500 hover:text-gray-300",
            )}
          >
            FAQ
            {activeTab === "faq" && faqLoading && (
              <Loader2 size={14} className="animate-spin" />
            )}
          </button>
        </div>

        <div className="p-8">
          {activeTab === "splash" ? (
            <SplashScreenManager
              currentWebsiteImage={webSplashData?.web_image_url}
              currentMobileImage={appSplashData?.app_image_url}
              onRefresh={handleRefreshSplash}
            />
          ) : (
            <FAQManager
              faqs={faqs}
              onCreateFAQ={createFAQ}
              onUpdateFAQ={updateFAQ}
              onDeleteFAQ={deleteFAQ}
              isCreating={isCreating}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              onRefresh={() => refetchFAQs()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
