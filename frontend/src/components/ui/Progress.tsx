import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, variant = 'default', showLabel = false, className, ...props }, ref) => {
    const percentage = Math.min((value / max) * 100, 100)

    const variantClasses = {
      default: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    }

    return (
      <div className="space-y-2">
        <div ref={ref} className={cn('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className)} {...props}>
          <div
            className={cn('h-full transition-all duration-300', variantClasses[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="text-xs font-medium text-surface-600 dark:text-surface-400">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)

Progress.displayName = 'Progress'

