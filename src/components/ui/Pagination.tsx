import React from "react";
import { Button } from "../../components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number) => onPageChange(page);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onItemsPerPageChange(Number(e.target.value));

  // Generate limited desktop range
  const pageNumbers = [];
  let start = Math.max(1, currentPage - 1);
  let end = Math.min(totalPages, currentPage + 1);

  if (start > 1) pageNumbers.push(1);
  if (start > 2) pageNumbers.push("...");

  for (let i = start; i <= end; i++) pageNumbers.push(i);

  if (end < totalPages - 1) pageNumbers.push("...");
  if (end < totalPages) pageNumbers.push(totalPages);

  return (
    <div className="flex justify-between items-center mt-4 w-full">

      {/* Show items per page */}
      <div className="flex items-center">
        <span className="text-gray-700 hidden sm:block">Show:</span>
        <select
          className="border rounded-[10px] px-3 py-2 ml-2 bg-[#B749DB] text-white cursor-pointer"
          onChange={handleItemsPerPageChange}
          value={itemsPerPage}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">

        {/* Previous */}
        <Button
          variant="ghost"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="border border-[#B749DB] rounded-lg px-3 py-2 text-[#B749DB]"
        >
          &lt;
        </Button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-2">
          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="text-[#B749DB] px-2">
                ...
              </span>
            ) : (
              <Button
                key={idx}
                onClick={() => handlePageClick(Number(p))}
                className={`rounded-lg px-4 py-2 border ${currentPage === p
                    ? "bg-[#B749DB] text-white"
                    : "bg-white text-[#B749DB] border-[#B749DB]"
                  }`}
              >
                {p}
              </Button>
            )
          )}
        </div>

        {/* Mobile Pagination */}
        <div className="sm:hidden flex items-center gap-2">

          {/* Current Page (ACTIVE STYLE) */}
          <Button
            className="rounded-lg px-4 py-2 border bg-[#B749DB] text-white border-[#B749DB]"
            disabled
          >
            {currentPage}
          </Button>

          {/* Next Page (INACTIVE STYLE) */}
          {currentPage < totalPages && (
            <Button
              onClick={() => handlePageClick(currentPage + 1)}
              className="rounded-lg px-4 py-2 border bg-white text-[#B749DB] border-[#B749DB]"
            >
              {currentPage + 1}
            </Button>
          )}
        </div>

        {/* Next */}
        <Button
          variant="ghost"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="border border-[#B749DB] rounded-lg px-3 py-2 text-[#B749DB] bg-white"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
