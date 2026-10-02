import { forwardRef, LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-surface-700 dark:text-surface-300',
        'block mb-2',
        props.htmlFor ? 'cursor-pointer' : '',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-danger-500 ml-1">*</span>}
    </label>
  )
)

Label.displayName = 'Label'
