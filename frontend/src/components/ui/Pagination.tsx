import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, showPageNumbers = true, className, ...props }, ref) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    return (
      <div ref={ref} className={cn('flex items-center justify-center gap-2', className)} {...props}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {showPageNumbers && (
          <>
            {startPage > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-1 rounded hover:bg-surface-100"
                >
                  1
                </button>
                {startPage > 2 && <span className="px-2">...</span>}
              </>
            )}

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'px-3 py-1 rounded',
                  currentPage === page
                    ? 'bg-brand-500 text-white'
                    : 'hover:bg-surface-100'
                )}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2">...</span>}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-1 rounded hover:bg-surface-100"
                >
                  {totalPages}
                </button>
              </>
            )}
          </>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'
