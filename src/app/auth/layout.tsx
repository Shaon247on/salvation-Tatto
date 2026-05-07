// import bg_image from "../../../public/auth/auth_image.png";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: `url(${bg_image.src})`,
//         }}
//       />

//       {/* Optional dark overlay (important for readability) */}
//       <div className="absolute inset-0 bg-black/5" />

//       {/* Gradient */}
//       {/* <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-purple-500/20" /> */}

//       {/* Pattern */}
//       <div
//         className="absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg ... %3E")`,
//         }}
//       />

//       {/* Content */}
//       <div className="relative z-10 w-full max-w-md px-4 bg-white/15 backdrop-blur-sm rounded-2xl">
//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import bg_image from "../../../public/auth/auth_image.png";
import { useGetSplashScreenQuery } from "@/redux/services/admin/appContent/appContentApi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useGetSplashScreenQuery("web");

  // Logic: Use API image if available, otherwise fallback to local bg_image
  const backgroundUrl = data?.web_image_url || bg_image;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image using Next.js Image Component */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundUrl}
          alt="Background Splash Screen"
          fill
          priority // Tells Next.js to load this immediately (good for LCP)
          quality={100}
          className="object-cover object-center"
        />
      </div>

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg ... %3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 bg-white/15 backdrop-blur-sm rounded-2xl">
        {children}
      </div>
    </div>
  );
}
