import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-surface-200 bg-white dark:bg-surface-950 px-4 py-2 text-body-md text-surface-900 dark:text-surface-50',
        'placeholder:text-surface-400 dark:placeholder:text-surface-600',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all',
        error && 'border-danger-500 focus:ring-danger-500',
        className
      )}
      {...props}
    />
  )
)

Textarea.displayName = 'Textarea'
