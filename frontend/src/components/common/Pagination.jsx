import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export const Pagination = ({
  currentPage,
  count,
  pageSize = 10,
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // number of pages to show before and after current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <nav className={`flex items-center justify-between border-t border-slate-200 px-4 py-4 sm:px-6 mt-8 ${className}`}>
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Affichage de <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> à{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, count)}
            </span>{' '}
            sur <span className="font-semibold text-slate-700">{count}</span> résultats
          </p>
        </div>
        <div>
          <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Précédent</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                disabled={page === '...'}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                  page === currentPage
                    ? 'z-10 bg-indigo-900 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900'
                    : page === '...'
                    ? 'text-slate-400 bg-white'
                    : 'text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Suivant</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
