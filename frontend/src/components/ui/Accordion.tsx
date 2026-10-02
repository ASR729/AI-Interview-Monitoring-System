import { forwardRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  id: string
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

interface AccordionProps {
  items: AccordionItemProps[]
  className?: string
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, className }, ref) => {
    const [openId, setOpenId] = useState<string | null>(
      items.find(item => item.defaultOpen)?.id || null
    )

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {items.map(item => (
          <div key={item.id} className="border border-surface-200 dark:border-surface-700 rounded-lg">
            <button
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <span className="font-medium text-surface-900 dark:text-surface-50">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-surface-500 transition-transform',
                  openId === item.id && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            {openId === item.id && (
              <div className="px-4 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/30">
                {item.children}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'
