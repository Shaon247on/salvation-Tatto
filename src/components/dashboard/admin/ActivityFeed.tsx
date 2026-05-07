/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle2, UserPlus, PlusCircle } from "lucide-react";

// const icons = {
//   completed: <CheckCircle2 size={14} className="text-emerald-500" />,
//   assigned: <PlusCircle size={14} className="text-gray-500" />,
//   due: <Clock size={14} className="text-amber-500" />,
//   new: <UserPlus size={14} className="text-blue-500" />,
//   overdue: <AlertCircle size={14} className="text-red-500" />,
// };

// export const ActivityFeed = ({ activities }: { activities: any[] }) => (
//   <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-8">
//     <div className="flex justify-between items-center mb-8">
//       <h3 className="text-white font-bold text-lg">Recent Activity</h3>
//       <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
//         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
//         Live
//       </span>
//     </div>
//     <div className="space-y-8">
//       {activities.map((item, i) => (
//         <div key={i} className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center">
//               {icons[item.type as keyof typeof icons]}
//             </div>
//             <p className="text-gray-300 text-sm">
//               <span className="text-white font-medium">{item.user}</span>{" "}
//               {item.action} <span className="text-white">{item.target}</span>
//             </p>
//           </div>
//           <span className="text-gray-600 text-xs">{item.time}</span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

const icons: Record<string, React.ReactNode> = {
  task_assigned: <PlusCircle size={14} className="text-amber-500" />,
  user_added: <UserPlus size={14} className="text-blue-500" />,
  default: <CheckCircle2 size={14} className="text-emerald-500" />,
};

export const ActivityFeed = ({ activities }: { activities: any[] }) => (
  <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-2xl p-8">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-white font-bold text-lg">Recent Activity</h3>
      <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
        Live
      </span>
    </div>
    <div className="space-y-6">
      {activities.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center shrink-0">
              {icons[item.action] || icons.default}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {item.message}
            </p>
          </div>
          <span className="text-gray-600 text-[10px] whitespace-nowrap uppercase font-bold">
            {item.time_ago}
          </span>
        </div>
      ))}
    </div>
  </div>
);
