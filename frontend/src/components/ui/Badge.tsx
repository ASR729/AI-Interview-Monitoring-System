import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', dot = false, children, ...props }, ref) => {
    const variantClasses = {
      success: 'badge-success',
      warning: 'badge-warning',
      danger: 'badge-danger',
      info: 'badge-info',
      neutral: 'badge-neutral',
    }

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[10px] gap-1',
      md: 'px-2.5 py-0.5 text-xs gap-1.5',
    }

    return (
      <span ref={ref} className={cn('badge', variantClasses[variant], sizeClasses[size], className)} {...props}>
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'success' && 'bg-success-500',
              variant === 'warning' && 'bg-warning-500',
              variant === 'danger' && 'bg-danger-500',
              variant === 'info' && 'bg-brand-500',
              variant === 'neutral' && 'bg-surface-500'
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'