// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Edit2, Trash2, MapPin, Users } from "lucide-react";
// import { cn } from "@/lib/utils";

// export const LocationTable = ({
//   locations,
//   onEdit,
// }: {
//   locations: any[];
//   onEdit: (loc: any) => void;
// }) => (
//   <div className="overflow-x-auto">
//     <table className="w-full text-left border-collapse">
//       <thead>
//         <tr className="text-gray-600 text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
//           <th className="px-6 py-5">Location</th>
//           <th className="px-6 py-5">Address</th>
//           <th className="px-6 py-5">City</th>
//           <th className="px-6 py-5">Staff</th>
//           <th className="px-6 py-5">Status</th>
//           <th className="px-6 py-5 text-right">Action</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-[#1A1A1A]">
//         {locations.map((loc) => (
//           <tr key={loc.id} className="hover:bg-white/2 transition-all group">
//             <td className="px-6 py-6 flex items-center gap-4">
//               <div className="w-10 h-10 rounded-full border border-[#262626] flex items-center justify-center bg-[#0D0D0D]">
//                 <MapPin size={16} className="text-gray-500" />
//               </div>
//               <span className="text-white text-sm font-bold">{loc.name}</span>
//             </td>
//             <td className="px-6 py-6 text-gray-500 text-sm">{loc.address}</td>
//             <td className="px-6 py-6 text-gray-500 text-sm">{loc.city}</td>
//             <td className="px-6 py-6">
//               <div className="flex items-center gap-2 text-gray-400 text-sm">
//                 <Users size={14} /> {loc.staffCount}
//               </div>
//             </td>
//             <td className="px-6 py-6">
//               <div className="flex items-center gap-2">
//                 <div
//                   className={cn(
//                     "w-1.5 h-1.5 rounded-full",
//                     loc.status === "Active"
//                       ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
//                       : "bg-red-500",
//                   )}
//                 />
//                 <span
//                   className={cn(
//                     "text-xs font-medium",
//                     loc.status === "Active"
//                       ? "text-emerald-500"
//                       : "text-red-500",
//                   )}
//                 >
//                   {loc.status}
//                 </span>
//               </div>
//             </td>
//             <td className="px-6 py-6 text-right">
//               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button
//                   onClick={() => onEdit(loc)}
//                   className="p-2 text-gray-500 hover:text-white transition-colors"
//                 >
//                   <Edit2 size={16} />
//                 </button>
//                 <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit2, Trash2, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const LocationTable = ({
  locations,
  onEdit,
  onDelete,
}: {
  locations: any[];
  onEdit: (loc: any) => void;
  onDelete?: (loc: any) => void;
}) => (
  <div className="w-full">
    {/* --- Desktop View --- */}
    <div className="hidden md:block overflow-x-auto bg-[#0A0A0A] border border-[#262626] rounded-[32px] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-[#1A1A1A]">
            <th className="px-6 py-5">Location</th>
            <th className="px-6 py-5">Address</th>
            <th className="px-6 py-5">City</th>
            <th className="px-6 py-5">Staff</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A1A1A]">
          {locations.map((loc) => (
            <tr key={loc.id} className="hover:bg-white/2 transition-all group">
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#262626] flex items-center justify-center bg-[#0D0D0D] shrink-0">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <span className="text-white text-sm font-bold">
                    {loc.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 text-gray-500 text-sm">{loc.address}</td>
              <td className="px-6 py-6 text-gray-500 text-sm">{loc.city}</td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users size={14} /> {loc.staffCount}
                </div>
              </td>
              <td className="px-6 py-6">
                <StatusBadge status={loc.status} />
              </td>
              <td className="px-6 py-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(loc)}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(loc)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* --- Mobile View --- */}
    <div className="md:hidden space-y-4">
      {locations.map((loc) => (
        <div
          key={loc.id}
          className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#262626] flex items-center justify-center bg-[#0D0D0D]">
                <MapPin size={16} className="text-gray-500" />
              </div>
              <span className="text-white text-base font-bold">{loc.name}</span>
            </div>
            <StatusBadge status={loc.status} />
          </div>

          <div className="space-y-2 border-y border-[#1A1A1A] py-3">
            <div className="flex flex-col">
              <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">
                Address
              </span>
              <span className="text-gray-400 text-sm">
                {loc.address}, {loc.city}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users size={14} className="text-gray-600" />
              <span>{loc.staffCount} Staff Members</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(loc)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold border border-[#262626] active:bg-[#262626] transition-colors"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete?.(loc)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold active:bg-red-500/20 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Reusable Status Badge Component
const StatusBadge = ({ status }: { status: string }) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "Active"
          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
      )}
    />
    <span
      className={cn(
        "text-xs font-medium",
        status === "Active" ? "text-emerald-500" : "text-red-500",
      )}
    >
      {status}
    </span>
  </div>
);
