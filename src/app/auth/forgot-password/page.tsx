/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/services/admin/auth";
import { redirect, useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const params = new URLSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await forgotPassword({ email }).unwrap();
      params.set("email", email);
      params.set("temp_token", res.temp_token);
      router.push(`/auth/verify-otp?${params.toString()}`);
    } catch (err) {
      setError("Failed to send reset email. Please check your email address.");
    }
  };

  return (
    <div className=" p-8 ">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {/* Salvation<span className="text-primary">Tattoo</span> */}
          Forgot Password!
        </h1>
        {/* <p className="text-muted-foreground mt-2">Management System</p> */}
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/auth/signin"
          className="inline-flex  items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
        <p className="text-muted-foreground mt-2">
          Enter your email address and we&apos;ll send you otp to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@salvationlounge.com"
            className="w-full px-4 py-3 rounded-lg border border-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Send otp "
          )}
        </button>
      </form>
    </div>
  );
}
