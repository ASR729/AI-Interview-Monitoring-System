import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'

export type DropdownItem =
  | {
      label: string
      value: string
      icon?: ReactNode
      disabled?: boolean
      danger?: boolean
      divider?: false
    }
  | {
      divider: true
      label?: never
      value?: never
      icon?: never
      disabled?: never
      danger?: never
    }

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect?: (value: string) => void
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, onSelect, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && !item.divider) {
      onSelect?.(item.value)
      setIsOpen(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const enabledItems = items.filter((item) => !item.disabled && !item.divider)
    const currentEnabledIndex = enabledItems.findIndex((_, i) => i === index)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = enabledItems.findIndex((_, i) => i > currentEnabledIndex)
        if (nextIndex !== -1) {
          ;(document.querySelectorAll('[role="menuitem"]')[nextIndex] as HTMLElement)?.focus()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = enabledItems.findIndex((_, i) => i < currentEnabledIndex)
        if (prevIndex !== -1) {
          ;(document.querySelectorAll('[role="menuitem"]')[prevIndex] as HTMLElement)?.focus()
        }
        break
      case 'Escape':
        setIsOpen(false)
        triggerRef.current?.focus()
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleItemClick(items[index])
        break
    }
  }

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className={cn('dropdown', align === 'right' ? 'right-0' : 'left-0')}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="dropdown-divider" role="separator" />
            }

            return (
              <button
                key={item.value}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'dropdown-item w-full text-left',
                  item.danger && 'text-danger-600 dark:text-danger-400',
                  item.disabled && 'opacity-50 pointer-events-none'
                )}
              >
                {item.icon && <span className="flex-shrink-0 h-4 w-4">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface SelectProps {
  value: string
  options: { value: string; label: string; disabled?: boolean }[]
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: boolean
  label?: string
}

export function Select({
  value,
  options,
  onChange,
  placeholder,
  className,
  disabled,
  error,
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={cn('w-full', className)} ref={selectRef}>
      {label && <label className="label">{label}</label>}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'input w-full text-left justify-between',
          !value && 'text-surface-400 dark:text-surface-500',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'input-error'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        <span>{value ? selectedOption?.label : placeholder || 'Select...'}</span>
        <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-surface-400', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="dropdown right-0 left-0 w-full max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'dropdown-item w-full text-left',
                option.value === value && 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300',
                option.disabled && 'opacity-50 pointer-events-none'
              )}
              disabled={option.disabled}
              aria-selected={option.value === value}
            >
              {option.label}
              {option.value === value && <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}