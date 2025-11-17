// Pagination.tsx
import React from "react";
import { Button } from "../../components/ui/button"; // Shadcn UI Button

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
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(event.target.value));
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-4">
      {/* Show items per page */}
      <div className="flex items-center">
        <span className="text-gray-700 hidden sm:block">Show:</span>
        <select
          className="border rounded-[10px] px-3 py-2 ml-2 bg-[#B749DB] text-white"
          onChange={handleItemsPerPageChange}
          value={itemsPerPage}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2"
        >
          &lt;
        </Button>

        {/* Mobile view: Only show a few pages */}
        <div className="hidden sm:flex items-center">
          {pages.map((page) => (
            <Button
              key={page}
              variant="ghost"
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 mx-1 ${
                currentPage === page
                  ? "bg-[#B749DB] text-white"
                  : "bg-white text-[#B749DB]"
              }`}
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Mobile view: Show ellipsis and navigate to next pages */}
        <div className="sm:hidden flex items-center">
          <Button
            variant="ghost"
            onClick={() => handlePageClick(currentPage + 1)}
            className="px-4 py-2"
            disabled={currentPage >= totalPages}
          >
            {currentPage + 1} &gt;
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
