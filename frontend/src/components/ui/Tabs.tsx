import { forwardRef, useState, createContext, useContext, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs subcomponents must be used within a Tabs component')
  }
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue = '', value, onValueChange, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue)
    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex border-b border-surface-200 dark:border-surface-800', className)} {...props}>
      {children}
    </div>
  )
)

TabsList.displayName = 'TabsList'

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue, onValueChange } = useTabsContext()
    const isActive = activeValue === value

    return (
      <button
        ref={ref}
        onClick={() => onValueChange(value)}
        className={cn(
          'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
          isActive
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-700',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue } = useTabsContext()

    if (activeValue !== value) return null

    return (
      <div ref={ref} className={cn('mt-4', className)} {...props}>
        {children}
      </div>
    )
  }
)

TabsContent.displayName = 'TabsContent'

