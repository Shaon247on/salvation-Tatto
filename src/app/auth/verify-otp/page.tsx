/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
// import { useVerifyOTPMutation } from "@/services/auth";

// export default function VerifyOTPPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const tempToken = searchParams.get("temp_token") || "";
//   const email = searchParams.get("email") || "";

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const [verifyOTP, { isLoading }] = useVerifyOTPMutation();

//   useEffect(() => {
//     // Focus first input on mount
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setError("");

//     // Move to next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     // Auto-submit when all digits are filled
//     if (value && index === 5 && newOtp.every((digit) => digit)) {
//       handleSubmit(newOtp.join(""));
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text").slice(0, 6);
//     if (!/^\d+$/.test(pastedData)) return;

//     const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
//     setOtp(newOtp);

//     // Focus last filled input
//     const lastFilledIndex = pastedData.length - 1;
//     if (lastFilledIndex < 6) {
//       inputRefs.current[lastFilledIndex]?.focus();
//     }

//     // Auto-submit when complete
//     if (pastedData.length === 6) {
//       handleSubmit(pastedData);
//     }
//   };

//   const handleSubmit = async (otpCode?: string) => {
//     const code = otpCode || otp.join("");
//     if (code.length !== 6) {
//       setError("Please enter the complete 6-digit code");
//       return;
//     }

//     setError("");

//     try {
//       await verifyOTP({
//         temp_token: tempToken || "",
//         otp: code,
//       }).unwrap();
//       setIsVerified(true);
//       // Redirect to reset password after successful verification
//       setTimeout(() => {
//         router.push(`/auth/reset-password`);
//       }, 1500);
//     } catch (err) {
//       setError("Invalid or expired OTP. Please try again.");
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     }
//   };

//   if (isVerified) {
//     return (
//       <div
//         className="
//        p-8 "
//       >
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-foreground">
//             Salvation<span className="text-primary">Tattoo</span>
//           </h1>
//           <p className="text-muted-foreground mt-2">Management System</p>
//         </div>

//         {/* Success Message */}
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
//             <CheckCircle className="w-8 h-8 text-green-500" />
//           </div>
//           <h2 className="text-xl font-semibold text-foreground mb-2">
//             OTP Verified!
//           </h2>
//           <p className="text-muted-foreground">
//             Redirecting to reset password...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className=" p-8 ">
//       {/* Logo */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">
//           Salvation<span className="text-primary">Tattoo</span>
//         </h1>
//         <p className="text-muted-foreground mt-2">Management System</p>
//       </div>

//       {/* Header */}
//       <div className="mb-6">
//         <Link
//           href="/auth/forgot-password"
//           className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
//         >
//           <ArrowLeft size={14} />
//           Back
//         </Link>
//         <h2 className="text-2xl font-bold text-foreground">Verify OTP</h2>
//         <p className="text-muted-foreground mt-2">
//           Enter the 6-digit code sent to <br />
//           <span className="text-foreground font-medium">{email}</span>
//         </p>
//       </div>

//       {/* Form */}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}
//         className="space-y-6"
//       >
//         {error && (
//           <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
//             {error}
//           </div>
//         )}

//         {/* OTP Input */}
//         <div className="flex justify-center gap-2" onPaste={handlePaste}>
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               ref={(el) => {
//                 inputRefs.current[index] = el;
//               }}
//               type="text"
//               inputMode="numeric"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
//             />
//           ))}
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading || otp.join("").length !== 6}
//           className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 size={20} className="animate-spin" />
//               Verifying...
//             </>
//           ) : (
//             "Verify OTP"
//           )}
//         </button>

//         <p className="text-center text-sm text-muted-foreground">
//           Didn&apos;t receive the code?{" "}
//           <button
//             type="button"
//             className="text-primary hover:text-primary/80 font-medium"
//           >
//             Resend
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import {
  useVerifyOTPMutation,
  useForgotPasswordMutation,
} from "@/redux/services/admin/auth";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tempToken = searchParams.get("temp_token") || "";

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // For resend feedback
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(60); // 60 second countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useForgotPasswordMutation();

  // Handle Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setError("");
    setSuccessMsg("");

    try {
      await resendOTP({ email }).unwrap();
      setSuccessMsg("A new code has been sent to your email.");
      setTimer(200); // Reset timer
      setOtp(["", "", "", "", ""]); // Clear old OTP
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to resend OTP. Please try again later.",
      );
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    setSuccessMsg(""); // Clear resend message on type

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every((digit) => digit)) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 5);
    setOtp(newOtp);
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex < 6) inputRefs.current[lastFilledIndex]?.focus();
    if (pastedData.length === 6) handleSubmit(pastedData);
  };

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 5) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setError("");
    try {
      await verifyOTP({
        temp_token: tempToken || "",
        otp: code,
      }).unwrap();
      setIsVerified(true);
      setTimeout(() => {
        router.push(`/auth/reset-password?temp_token=${tempToken}`);
      }, 1500);
    } catch (err: any) {
      setError(err?.data?.message || "Invalid or expired OTP.");
      setOtp(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  if (isVerified) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {/* Salvation<span className="text-primary">Tattoo</span> */}
            Verify OTP
          </h1>
          {/* <p className="text-muted-foreground mt-2">Management System</p> */}
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            OTP Verified!
          </h2>
          <p className="text-muted-foreground">
            Redirecting to reset password...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {/* Salvation<span className="text-primary">Tattoo</span> */}
          Verify OTP
        </h1>
        {/* <p className="text-muted-foreground mt-2">Management System</p> */}
      </div>

      <div className="mb-6">
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Verify OTP</h2>
        <p className="text-muted-foreground mt-2">
          Enter the 5-digit code sent to <br />
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
            {successMsg}
          </div>
        )}

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-transparent"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join("").length !== 5}
          className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className="text-primary hover:text-primary/80 font-medium disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {isResending
              ? "Sending..."
              : timer > 0
                ? `Resend in ${timer}s`
                : "Resend Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
