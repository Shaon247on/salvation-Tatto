/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  Lock,
} from "lucide-react";
import { useResetPasswordMutation } from "@/redux/services/admin/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const temp_token = searchParams.get("temp_token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        temp_token: temp_token,
        confirm_password: confirmPassword,
        new_password: password,
      }).unwrap();
      setIsSuccess(true);
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. The link may have expired.");
    }
  };

  if (isSuccess) {
    return (
      <div className=" p-8 ">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {/* Salvation<span className="text-primary">Tattoo</span> */}
            Password Reset!
          </h1>
          {/* <p className="text-muted-foreground mt-2">Management System</p> */}
        </div>

        {/* Success Message */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Password Reset!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your password has been successfully reset.
            <br />
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-8 ">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {/* Salvation<span className="text-primary">Tattoo</span> */}
          Reset Password
        </h1>
        {/* <p className="text-muted-foreground mt-2">Management System</p> */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-lg border border-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-transparent pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-lg border border-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Match indicator */}
        {confirmPassword && (
          <div
            className={`flex items-center gap-2 text-sm ${
              passwordsMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            <CheckCircle size={14} />
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !passwordsMatch}
          className="w-full py-3 px-4 rounded-lg bg-primary text-white  font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <Lock size={20} />
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}
