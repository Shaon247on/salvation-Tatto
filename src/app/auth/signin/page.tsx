/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { useDemoLogin } from "@/hooks/useAuth";

// export default function SignInPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { loginAsAdmin, loginAsManager, loginAsBranchManager } = useDemoLogin();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Demo: Use admin login for any credentials
//     // In production, this would call the actual API
//     loginAsAdmin();
//   };

//   return (
//     <div className="glass rounded-2xl p-8 shadow-2xl">
//       {/* Logo */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">
//           Salvation<span className="text-primary">Tattoo</span>
//         </h1>
//         <p className="text-muted-foreground mt-2">Management System</p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-2">
//           <label
//             htmlFor="email"
//             className="text-sm font-medium text-foreground"
//           >
//             Email Address
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="admin@salvationlounge.com"
//             className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <label
//               htmlFor="password"
//               className="text-sm font-medium text-foreground"
//             >
//               Password
//             </label>
//             <Link
//               href="/auth/forgot-password"
//               className="text-sm text-primary hover:text-primary/80 transition-colors"
//             >
//               Forgot password?
//             </Link>
//           </div>
//           <div className="relative">
//             <input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 size={20} className="animate-spin" />
//               Signing in...
//             </>
//           ) : (
//             "Sign In"
//           )}
//         </button>
//       </form>

//       {/* Demo Login Buttons */}
//       <div className="mt-8 pt-6 border-t border-border">
//         <p className="text-sm text-muted-foreground text-center mb-4">
//           Demo Login (Click to sign in)
//         </p>
//         <div className="grid grid-cols-3 gap-2">
//           <button
//             onClick={loginAsAdmin}
//             className="py-2 px-3 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
//           >
//             Admin
//           </button>
//           <button
//             onClick={loginAsManager}
//             className="py-2 px-3 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
//           >
//             Manager
//           </button>
//           <button
//             onClick={loginAsBranchManager}
//             className="py-2 px-3 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
//           >
//             Branch
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useDemoLogin } from "@/hooks/useAuth";
import { useLoginMutation } from "@/redux/services/admin/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const {
    loginAsAdmin,
    loginAsManager,
    loginAsBranchManager,
    loginAsQRAttendee,
  } = useDemoLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      console.log("Login Success:", response);

      dispatch(
        setCredentials({
          user: response?.user,
          token: response.access,
        }),
      );

      document.cookie = `accessToken=${response.access}; path=/; max-age=86400`;
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      alert(err?.data?.detail || "Login failed. Please check credentials.");
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Sign in</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-transparent"
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

          {/* Moved to Bottom Right using flex justify-end */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
