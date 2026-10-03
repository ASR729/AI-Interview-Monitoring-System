import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface TableColumn<T> {
  key: string
  header: string
  render?: (row: T, index: number) => ReactNode
  className?: string
  sortable?: boolean
  width?: string
}

interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor?: (row: T) => string
  onRowClick?: (row: T) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  loading?: boolean
  emptyMessage?: string
  rowClassName?: (row: T) => string
  striped?: boolean
  hoverable?: boolean
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor = (row: T) => String((row as Record<string, unknown>).id || Math.random()),
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  rowClassName,
  striped = false,
  hoverable = true,
  className,
  children,
  ...props
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  const renderSortIcon = (key: string) => {
    if (sortBy !== key) return null
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className={cn('table-container', className)} {...props}>
        <table className="table w-full" role="grid" aria-busy="true">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn(column.className)} style={{ width: column.width }}>
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && <ChevronUp className="h-4 w-4 text-surface-300 dark:text-surface-600" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((column) => (
                  <td key={column.key} className={cn(column.className)}>
                    <div className="skeleton skeleton-text" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('table-container', className)} {...props}>
        <table className="table w-full" role="grid">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn(column.className)} style={{ width: column.width }}>
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && <ChevronUp className="h-4 w-4 text-surface-300 dark:text-surface-600" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-surface-500 dark:text-surface-400">
                  <div className="p-3 rounded-full bg-surface-100 dark:bg-surface-800">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-body">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={cn('table-container', className)} {...props}>
      <table className="table w-full" role="grid">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(column.className)}
                style={{ width: column.width }}
                scope="col"
              >
                <div className="flex items-center gap-2">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                      aria-label={`Sort by ${column.header}`}
                      aria-sort={sortBy === column.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      {renderSortIcon(column.key)}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row)}
              className={cn(
                rowClassName?.(row),
                hoverable && 'hover:bg-surface-50 dark:hover:bg-surface-800/50',
                striped && rowIndex % 2 === 1 && 'bg-surface-50 dark:bg-surface-800/30',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onRowClick(row)
                }
              }}
              role={onRowClick ? 'button' : undefined}
              aria-pressed={false}
            >
              {columns.map((column) => (
                <td key={column.key} className={cn(column.className)}>
                  {column.render ? column.render(row, rowIndex) : String((row as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

DataTable.displayName = 'DataTable'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageSize?: boolean
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  totalItems?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageSize = false,
  pageSize,
  onPageSizeChange,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  )

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-surface-200 dark:border-surface-800">
      <div className="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
        {totalItems !== undefined && (
          <span>
            Showing {Math.min((currentPage - 1) * (pageSize || 10) + 1, totalItems)} to{' '}
            {Math.min(currentPage * (pageSize || 10), totalItems)} of {totalItems} results
          </span>
        )}
        {showPageSize && pageSize && onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="input w-auto py-1.5 pl-3 pr-8 text-sm"
            aria-label="Items per page"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        )}
      </div>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 disabled:opacity-50 disabled:pointer-events-none dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
          aria-label="First page"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 disabled:opacity-50 disabled:pointer-events-none dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {visiblePages.map((page, index) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-brand-600 text-white'
                : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-50 dark:hover:bg-surface-800'
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 disabled:opacity-50 disabled:pointer-events-none dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 disabled:opacity-50 disabled:pointer-events-none dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
          aria-label="Last page"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  )
}

function ChevronLeft({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-container">
      <table className={cn('table w-full', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props}>{children}</thead>
}

export function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props}>{children}</tbody>
}

export function TableFooter({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={className} {...props}>{children}</tfoot>
}

export function TableRow({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className} {...props}>{children}</tr>
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th scope="col" className={cn('px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-surface-500 dark:text-surface-400', className)} {...props}>
      {children}
    </th>
  )
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 text-sm text-surface-900 dark:text-surface-50', className)} {...props}>
      {children}
    </td>
  )
}

export function TableCaption({ className, children, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={className} {...props}>{children}</caption>
}
