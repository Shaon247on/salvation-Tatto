// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Mail, MapPin, Calendar } from "lucide-react";

// export const NotificationFeed = ({ history }: { history: any[] }) => (
//   <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-[2rem] p-5 md:p-8 h-full">
//     {/* Header */}
//     <div className="mb-6 md:mb-8">
//       <h3 className="text-white font-bold text-lg md:text-base">
//         Recent Notifications
//       </h3>
//       <p className="text-gray-500 text-[10px] md:text-xs">
//         Sent notifications history
//       </p>
//     </div>

//     {/* Feed Items */}
//     <div className="space-y-4">
//       {history.map((item, i) => (
//         <div
//           key={i}
//           className="bg-[#111] border border-[#968B79]/60 rounded-2xl p-4 md:p-5 hover:border-[#404040] transition-all group"
//         >
//           {/* Recipient & Status */}
//           <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
//             <div className="flex items-center gap-3 min-w-0">
//               <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
//                 <Mail size={14} className="text-blue-400" />
//               </div>
//               <span className="text-white font-medium text-sm truncate">
//                 {item.recipient}
//               </span>
//             </div>
//             <span className="bg-emerald-500/10 text-emerald-500 text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter border border-emerald-500/20 shrink-0">
//               {item.status}
//             </span>
//           </div>

//           {/* Message Content */}
//           <p className="text-gray-500 text-[11px] md:text-xs mb-4 line-clamp-3 md:line-clamp-2 italic leading-relaxed">
//             {item.message}
//           </p>

//           {/* Metadata Footer */}
//           <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
//             <span className="flex items-center gap-1.5">
//               <MapPin size={12} className="shrink-0" /> {item.branch}
//             </span>
//             <span className="flex items-center gap-1.5">
//               <Calendar size={12} className="shrink-0" /> {item.date}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, MapPin, Calendar } from "lucide-react";

export const NotificationFeed = ({ history }: { history: any[] }) => (
  <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-[2rem] p-5 md:p-8 flex flex-col h-full overflow-hidden">
    {/* Header - Fixed */}
    <div className="mb-6 md:mb-8 shrink-0">
      <h3 className="text-white font-bold text-lg md:text-base">
        Recent Notifications
      </h3>
      <p className="text-gray-500 text-[10px] md:text-xs">
        Sent notifications history
      </p>
    </div>

    {/* Scrollable Area - Hidden Scrollbar */}
    <div
      className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth no-scrollbar"
      style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {history.map((item, i) => (
        <div
          key={i}
          className="bg-[#111] border border-[#968B79]/60 rounded-2xl p-4 md:p-5 hover:border-[#404040] transition-all group"
        >
          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                <Mail size={14} className="text-blue-400" />
              </div>
              <span className="text-white font-medium text-sm truncate">
                {item.recipient}
              </span>
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter border border-emerald-500/20 shrink-0">
              {item.status}
            </span>
          </div>

          <p className="text-gray-500 text-[11px] md:text-xs mb-4 italic leading-relaxed">
            {item.message}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0" /> {item.branch}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0" /> {item.date}
            </span>
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <div className="text-center text-gray-600 py-10">
          No notifications found.
        </div>
      )}
    </div>
  </div>
);
