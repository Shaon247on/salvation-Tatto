import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export const ChangePassword = () => {
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const inputClass =
    "w-full bg-black border border-[#262626] rounded-xl p-4 pr-12 text-sm text-white focus:border-[#404040] outline-none transition-colors";

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-[32px] p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-center">
          <Lock size={20} className="text-gray-500" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Change Password</h3>
          <p className="text-gray-500 text-xs">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPass.current ? "text" : "password"}
              placeholder="Enter current password"
              className={inputClass}
            />
            <button
              onClick={() =>
                setShowPass({ ...showPass, current: !showPass.current })
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPass.new ? "text" : "password"}
              placeholder="Enter new password"
              className={inputClass}
            />
            <button
              onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-gray-600 font-medium ml-1">
            Must be at least 8 characters long
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPass.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              className={inputClass}
            />
            <button
              onClick={() =>
                setShowPass({ ...showPass, confirm: !showPass.confirm })
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95">
          Update Password
        </button>
      </div>
    </div>
  );
};
