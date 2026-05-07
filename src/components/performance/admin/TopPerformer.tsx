/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star, Award } from "lucide-react";

export const TopPerformer = ({ data }: { data: any }) => (
  <div className="bg-[#0A0A0A] border border-amber-500/30 rounded-3xl p-8 relative overflow-hidden group">
    {/* Decorative background glow */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32" />

    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
      <div className="relative">
        <div className="w-24 h-24 bg-[#141414] border-2 border-amber-500 rounded-2xl flex items-center justify-center text-amber-500 font-bold text-2xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          {data.initials}
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
          <Award size={18} className="text-black" />
        </div>
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Top Performer of the Week
            </h3>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-amber-500 text-amber-500"
                />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-amber-500">{data.name}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-2">
          {[
            { label: "Performance Score", val: `${data.score}%` },
            { label: "Tasks Completed", val: data.tasks },
            { label: "Attendance", val: `${data.attendance}%` },
            { label: "Completion Rate", val: `${data.completion}%` },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-white font-bold text-lg">{stat.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
