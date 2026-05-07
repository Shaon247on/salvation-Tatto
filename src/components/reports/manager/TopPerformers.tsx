import { TopPerformer } from "@/types/districtManager/districtManagerReport.type";
import React from "react";



const TopPerformers = ({ performers }: { performers: TopPerformer[] }) => {
  const rankColors = ["text-yellow-500", "text-gray-400", "text-orange-600"];

  return (
    <div className="bg-[#0A0A0A] border  border-[#968B79]/60 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-yellow-500">🏆</span>
        <h3 className="text-white font-bold">Top Performers</h3>
      </div>
      <div className="space-y-6">
        {performers.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`font-bold text-sm ${rankColors[i]}`}>
                {p.rank}
              </span>
              {/* <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {p.initials}
              </div> */}
              <div>
                <p className="text-white text-sm font-bold">{p.name}</p>
                <p className="text-gray-500 text-[10px]">{p.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-indigo-500 font-bold text-sm">{p.score}</p>
              <p className="text-gray-600 text-[8px] uppercase font-bold">
                score
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
