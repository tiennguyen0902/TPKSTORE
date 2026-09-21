import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 18, 24],
  itemLabel = "sản phẩm",
  className = ""
}) => {
  if (totalItems <= 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Thuật toán hiển thị số trang thông minh có dấu '...' (Ellipsis)
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-[#12192e] border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 select-none ${className}`}>
      {/* Thông tin số lượng & Trang hiện tại */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <div>
          Hiển thị <span className="font-bold text-white">{startItem}</span> -{" "}
          <span className="font-bold text-white">{endItem}</span> trong tổng số{" "}
          <span className="font-bold text-violet-400">{totalItems}</span> {itemLabel}
        </div>
        <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600" />
        <div className="text-slate-400">
          Trang <span className="font-semibold text-white">{currentPage}</span> /{" "}
          <span className="font-semibold text-white">{totalPages}</span>
        </div>
      </div>

      {/* Cụm nút điều hướng trang */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Về trang đầu */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage <= 1}
          title="Về trang đầu tiên"
          className="p-2 rounded-xl bg-[#18233a] border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-[#18233a] disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Trang trước */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Trang trước"
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#18233a] border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-[#18233a] disabled:hover:text-slate-300 disabled:cursor-not-allowed text-xs font-semibold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {/* Các nút số trang */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 text-xs select-none"
                >
                  •••
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => handlePageClick(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 scale-105"
                    : "bg-[#18233a] border border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Trang sau */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Trang sau"
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#18233a] border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-[#18233a] disabled:hover:text-slate-300 disabled:cursor-not-allowed text-xs font-semibold transition-all"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Đến trang cuối */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage >= totalPages}
          title="Đến trang cuối"
          className="p-2 rounded-xl bg-[#18233a] border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-[#18233a] disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lựa chọn số lượng hiển thị mỗi trang (nếu được hỗ trợ) */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Mỗi trang:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[#18233a] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer font-medium"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-[#12192e] text-slate-200">
                {opt} mục
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
