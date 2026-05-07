import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/Providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Explicitly defining weights for tattoo lounge branding
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Salvation Tattoo Lounge",
  description: "Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
