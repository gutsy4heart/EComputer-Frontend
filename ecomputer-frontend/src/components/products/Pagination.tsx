 
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  
  if (totalPages <= 1) {
    return null;
  }
 
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
    
      pageNumbers.push(1);
      
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
     
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
    
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
     
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
 
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 text-white rounded-xl transition-all duration-300 hover:bg-black/60 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/40 disabled:hover:border-white/10 group"
      >
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </span>
      </button>
      
      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-white/70">...</span>
          ) : (
            <button
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg transform scale-105'
                  : 'bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 hover:border-white/20 hover:scale-105'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 text-white rounded-xl transition-all duration-300 hover:bg-black/60 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/40 disabled:hover:border-white/10 group"
      >
        <span className="flex items-center space-x-2">
          <span>Next</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  );
};
