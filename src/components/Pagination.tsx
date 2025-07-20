import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap px-4">
      {/* Previous Button */}
      <button
        title="Previous page"
        className="p-2 rounded hover:opacity-80 disabled:opacity-50 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Number Buttons */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        const isActive = currentPage === page;

        return (
          <button
            key={i}
            className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
              isActive
                ? "bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white"
                : "bg-white text-black hover:bg-gradient-to-br hover:from-indigo-700 hover:via-purple-600 hover:to-pink-500 hover:text-white"
            }`}
            onClick={() => onPageChange(page)}
            title={`Go to page ${page}`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        title="Next page"
        className="p-2 rounded hover:opacity-80 disabled:opacity-50 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
