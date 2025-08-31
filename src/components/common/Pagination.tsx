import React from 'react';
import CaretLeft from '@/assets/caret-left.svg?react';
import CaretRight from '@/assets/caret-right.svg?react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1) {
      return [1, 2, 3];
    } else if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="hover:text-primary text-text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="sr-only">Previous</span>

          <CaretLeft className="h-5 w-5" />
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`text-body-5 lg:text-body-1 h-10 w-10 cursor-pointer rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              currentPage === page
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-primary hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="text-text-primary hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="sr-only">Next</span>
          <CaretRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
