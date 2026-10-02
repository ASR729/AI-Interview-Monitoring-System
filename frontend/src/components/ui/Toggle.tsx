import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed: controlledPressed, onPressedChange, defaultChecked, onChange, variant = 'default', size = 'md', children, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = useState(defaultChecked || false)
    const isControlled = controlledPressed !== undefined
    const pressed = isControlled ? controlledPressed : internalPressed

    const sizeClasses = {
      sm: 'h-8 px-2.5',
      md: 'h-10 px-3',
      lg: 'h-12 px-4',
    }

    const variantClasses = {
      default: pressed ? 'bg-brand-500 text-white' : 'bg-surface-100 text-surface-900 hover:bg-surface-200',
      outline: pressed ? 'border-2 border-brand-500 bg-brand-50' : 'border border-surface-300',
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !pressed
      if (!isControlled) {
        setInternalPressed(newPressed)
      }
      onPressedChange?.(newPressed)
      onChange?.(newPressed)
      props.onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onClick={handleClick}
        aria-pressed={pressed}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'

