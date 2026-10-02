import React, { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const statusSizeClasses = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
}

const statusPositionClasses = {
  xs: 'bottom-0 right-0',
  sm: 'bottom-0 right-0',
  md: 'bottom-0.5 right-0.5',
  lg: 'bottom-1 right-1',
  xl: 'bottom-1 right-1',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-brand-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-orange-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      ...props
    },
    ref
  ) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'
    const showStatus = status && status !== 'offline'

    return (
      <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
        <div className={cn('relative overflow-hidden bg-surface-200 dark:bg-surface-800', sizeClasses[size], shapeClass)}>
          {src ? (
            <img
              src={src}
              alt={alt || name || 'Avatar'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : name ? (
            <div
              className={cn(
                'flex h-full w-full items-center justify-center font-medium text-white',
                getColorFromName(name)
              )}
              aria-label={name}
            >
              {getInitials(name)}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-surface-400 dark:text-surface-500">
              <svg className="h-1/2 w-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        {showStatus && (
          <span
            className={cn(
              'absolute border-2 border-white dark:border-surface-950 rounded-full',
              statusSizeClasses[size],
              statusPositionClasses[size],
              status === 'online' && 'bg-success-500',
              status === 'busy' && 'bg-danger-500',
              status === 'away' && 'bg-warning-500',
              status === 'offline' && 'bg-surface-400'
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 5, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const visibleChildren = childArray.slice(0, max)
    const remainingCount = childArray.length - max

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {visibleChildren.map((child, index) => {
          if (!React.isValidElement(child)) return null
          return React.cloneElement(child, {
            key: child.key || index,
            className: cn(child.props.className, 'ring-2 ring-white dark:ring-surface-950'),
          })
        })}
        {remainingCount > 0 && (
          <div
            className={cn(
              'flex shrink-0 items-center justify-center font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 border-2 border-white dark:border-surface-950',
              sizeClasses.md,
              'rounded-full'
            )}
            aria-label={`${remainingCount} more people`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'