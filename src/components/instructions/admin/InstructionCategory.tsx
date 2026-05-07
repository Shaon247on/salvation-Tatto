// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FileText, Download, Edit2, Trash2 } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Instruction {
//   id: string;
//   title: string;
//   description: string;
//   fileName: string;
// }

// interface CategoryProps {
//   title: string;
//   icon: any;
//   iconColor: string;
//   count: number;
//   instructions: Instruction[];
// }

// export const InstructionCategory = ({
//   title,
//   icon: Icon,
//   iconColor,
//   count,
//   instructions,
// }: CategoryProps) => (
//   <div className="bg-[#0A0A0A] border border-[#262626] rounded-[32px] p-8 space-y-6">
//     <div className="flex items-center gap-4">
//       <div
//         className={cn(
//           "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5",
//           iconColor,
//         )}
//       >
//         <Icon size={22} />
//       </div>
//       <div>
//         <h3 className="text-white font-bold text-lg">{title}</h3>
//         <p className="text-gray-500 text-xs">{count} documents available</p>
//       </div>
//     </div>

//     <div className="space-y-4">
//       {instructions.map((item) => (
//         <div
//           key={item.id}
//           className="bg-[#111] border border-[#262626] rounded-2xl p-6 group hover:border-[#404040] transition-all"
//         >
//           <div className="flex justify-between items-start mb-4">
//             <div className="flex gap-4">
//               <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
//                 <FileText size={18} className="text-red-500" />
//               </div>
//               <div>
//                 <h4 className="text-white font-bold text-sm">{item.title}</h4>
//                 <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-md">
//                   {item.description}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//               <button className="p-2 text-gray-500 hover:text-white">
//                 <Edit2 size={16} />
//               </button>
//               <button className="p-2 text-gray-500 hover:text-red-500">
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-black/40 w-fit px-3 py-1.5 rounded-lg border border-white/5">
//             <Download size={12} /> {item.fileName}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FileText, Download, Edit2, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface Instruction {
  id: string;
  title: string;
  description: string;
  fileName: string;
}

interface CategoryProps {
  title: string;
  icon: any;
  iconColor: string;
  count: number;
  instructions: Instruction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  itemsPerPage?: number;
}

const ITEMS_PER_PAGE = 3;

export const InstructionCategory = ({
  title,
  icon: Icon,
  iconColor,
  count,
  instructions,
  onEdit,
  onDelete,
  itemsPerPage = ITEMS_PER_PAGE,
}: CategoryProps) => {
  const [expandedCount, setExpandedCount] = useState(itemsPerPage);
  const listRef = useRef<HTMLDivElement>(null);

  // Smooth scroll when expanding
  useEffect(() => {
    if (expandedCount > itemsPerPage && listRef.current) {
      setTimeout(() => {
        const lastItem = listRef.current?.lastElementChild as HTMLElement;
        if (lastItem) {
          lastItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  }, [expandedCount, itemsPerPage]);

  const visibleInstructions = instructions.slice(0, expandedCount);
  const hasMore = instructions.length > expandedCount;
  const remainingCount = instructions.length - expandedCount;

  const handleShowMore = () => {
    setExpandedCount((prev) =>
      Math.min(prev + itemsPerPage, instructions.length),
    );
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-[2rem] p-5 md:p-8 space-y-6">
      {/* Category Header */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5 shrink-0",
            iconColor,
          )}
        >
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">
            {title}
          </h3>
          <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-medium">
            {count} documents available
          </p>
        </div>
      </div>

      {/* Instructions List with Smooth Expand */}
      <div className="space-y-4">
        <div ref={listRef} className="space-y-4">
          {visibleInstructions.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "bg-[#111] border border-[#968B79]/40 rounded-2xl p-5 md:p-6 group hover:border-[#968B79]/60 transition-all",
                "animate-fadeIn",
              )}
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s backwards`,
              }}
            >
              {/* Top Section: Icon, Text and Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 shrink-0">
                    <FileText size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions: Visible on mobile, group-hover subtle on desktop */}
                <div className="flex gap-1 self-end sm:self-start">
                  <button
                    onClick={() => onDelete?.(item.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Footer: Filename / Download Link */}
              <div className="flex flex-wrap items-center gap-2 text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-black/40 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                <Download size={12} className="shrink-0" />
                <span className="truncate max-w-45 sm:max-w-none">
                  {item.fileName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button - Appears when there are more items */}
        {hasMore && (
          <button
            onClick={handleShowMore}
            className={cn(
              "w-full mt-4 py-3 px-4 rounded-2xl border border-[#968B79]/60 text-sm font-bold",
              "text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10",
              "transition-all duration-200 flex items-center justify-center gap-2 group",
            )}
          >
            <span>
              Show {Math.min(itemsPerPage, remainingCount)} more
              {remainingCount > itemsPerPage &&
                ` (${remainingCount} more available)`}
            </span>
            <ChevronDown
              size={16}
              className="group-hover:translate-y-1 transition-transform duration-200"
            />
          </button>
        )}
      </div>
    </div>
  );
};
