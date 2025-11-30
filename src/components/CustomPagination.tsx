import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface CustomPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const baseClass =
        "h-9 w-9 flex justify-center items-center rounded-md text-sm transition-colors duration-200 font-medium";
    const linkClass =
        "hover:bg-[#B749DB]/10 text-gray-700 hover:text-[#B749DB] cursor-pointer";
    const activeClass = "bg-[#B749DB] text-white pointer-events-none";
    const disabledClass = "text-gray-400 pointer-events-none opacity-50";

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center mt-10" aria-label="Pagination">
            <ul className="flex items-center space-x-2">
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${baseClass} px-3 ${currentPage === 1 ? disabledClass : linkClass
                            }`}
                    >
                        <FaArrowLeft className="w-3 h-3 mr-1" />
                        Prev
                    </button>
                </li>
                {pages.map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`${baseClass} ${page === currentPage ? activeClass : linkClass
                                }`}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${baseClass} px-3 ${currentPage === totalPages ? disabledClass : linkClass
                            }`}
                    >
                        Next
                        <FaArrowRight className="w-3 h-3 ml-1" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default CustomPagination;
