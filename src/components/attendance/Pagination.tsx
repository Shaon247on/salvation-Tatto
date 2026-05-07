import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const Pagination = ({ count, currentPage, onPageChange }: any) => {
  const limit = 5; // items per page
  const totalPages = Math.ceil(count / limit) || 1;

  if (totalPages <= 1) return null;

  const visiblePages = 5; // how many page numbers to show

  let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  let endPage = startPage + visiblePages - 1;

  // যদি endPage বেশি হয়ে যায়
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - visiblePages + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <p className="text-xs text-gray-500 italic">
        Showing page {currentPage} of {totalPages} results
      </p>

      <div className="flex gap-2">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 border border-[#262626] rounded-lg disabled:opacity-20 hover:bg-white/5"
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 border rounded-lg text-sm font-bold transition-all",
              currentPage === page
                ? "bg-white text-black border-white"
                : "border-[#262626] text-gray-500",
            )}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 border border-[#262626] rounded-lg disabled:opacity-20 hover:bg-white/5"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
