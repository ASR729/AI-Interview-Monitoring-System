import { forwardRef, useState, ReactNode, SelectHTMLAttributes, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

const useSelectContext = () => {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('Select subcomponents must be used within a Select component')
  }
  return context
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  options?: Array<{ value: string | number; label: string }>
  onValueChange?: (value: string) => void
  children?: ReactNode
  value?: string
}

// Main Select component with compound pattern support
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, label, error, helperText, options = [], id, disabled, required, onValueChange, children, value, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value || '')
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`

    const finalValue = value !== undefined ? value : internalValue
    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    // If children provided, use compound pattern
    if (children) {
      return (
        <SelectContext.Provider value={{ value: finalValue, onValueChange: handleValueChange }}>
          <div ref={ref} className={cn('w-full', className)}>
            {children}
          </div>
        </SelectContext.Provider>
      )
    }

    // Otherwise use native select pattern
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
            {required && <span className="text-danger-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref as any}
            id={selectId}
            className={cn(
              'select appearance-none pl-4 pr-10 py-2 bg-white border border-surface-300 rounded-lg',
              error && 'border-danger-500',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            disabled={disabled}
            required={required}
            value={finalValue}
            onChange={(e) => handleValueChange(e.target.value)}
            {...(props as any)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-danger-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-surface-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

// Subcomponents for compound select pattern
export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  { children: ReactNode; className?: string }
>(({ children, className }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg',
      'hover:bg-surface-50 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500',
      'text-surface-900 dark:text-surface-50 text-left',
      className
    )}
  >
    {children}
    <ChevronDown className="w-4 h-4 opacity-50 flex-shrink-0" />
  </button>
))
SelectTrigger.displayName = 'SelectTrigger'

export const SelectValue = forwardRef<
  HTMLDivElement,
  { children?: ReactNode; placeholder?: string; className?: string }
>(({ children, placeholder = 'Select...', className }, ref) => (
  <div ref={ref} className={cn('text-surface-900 dark:text-surface-50', !children && 'text-surface-400 dark:text-surface-600', className)}>
    {children || placeholder}
  </div>
))
SelectValue.displayName = 'SelectValue'

export const SelectContent = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg shadow-lg z-50',
      className
    )}
  >
    {children}
  </div>
))
SelectContent.displayName = 'SelectContent'

export const SelectItem = forwardRef<
  HTMLDivElement,
  { value: string; children: ReactNode; className?: string }
>(({ value, children, className }, ref) => {
  const { value: selectedValue, onValueChange } = useSelectContext()

  return (
    <div
      ref={ref}
      onClick={() => onValueChange(value)}
      className={cn(
        'px-4 py-2 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/30 text-surface-900 dark:text-surface-50',
        'border-b border-surface-100 dark:border-surface-800 last:border-b-0',
        selectedValue === value && 'bg-brand-50 dark:bg-brand-900/20 font-medium',
        className
      )}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = 'SelectItem'


