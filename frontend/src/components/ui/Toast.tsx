import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

interface ToastProps {
  id: string
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  message?: string
  onClose: (id: string) => void
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
}

const iconColors = {
  success: 'text-success-500',
  warning: 'text-warning-500',
  danger: 'text-danger-500',
  info: 'text-brand-500',
}

const borderColors = {
  success: 'border-l-success-500',
  warning: 'border-l-warning-500',
  danger: 'border-l-danger-500',
  info: 'border-l-brand-500',
}

export function Toast({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000,
  action,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const Icon = iconMap[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(id), 200)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose, type])

  return (
    <div
      className={cn(
        'toast',
        borderColors[type],
        isExiting && 'animate-fade-out scale-95'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn('flex-shrink-0 h-5 w-5', iconColors[type])}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 dark:text-surface-50">{title}</p>
        {message && (
          <p className="mt-0.5 text-sm text-surface-500 dark:text-surface-400">{message}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex-shrink-0 text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onClose(id), 200)
        }}
        className="flex-shrink-0 p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:text-surface-500 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

let toastId = 0
const toastListeners = new Set<(toasts: ToastProps[]) => void>()
let toasts: ToastProps[] = []

function notify() {
  toastListeners.forEach((listener) => listener([...toasts]))
}

export function useToast() {
  const [, setToasts] = useState(toasts)

  useEffect(() => {
    toastListeners.add(setToasts)
    return () => toastListeners.delete(setToasts)
  }, [])

  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = `toast-${++toastId}`
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: dismiss,
    }
    toasts = [...toasts, newToast]
    notify()
    return id
  }

  const dismiss = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  }

  const success = (title: string, message?: string, options?: Partial<ToastProps>) =>
    showToast({ type: 'success', title, message, ...options })

  const warning = (title: string, message?: string, options?: Partial<ToastProps>) =>
    showToast({ type: 'warning', title, message, ...options })

  const danger = (title: string, message?: string, options?: Partial<ToastProps>) =>
    showToast({ type: 'danger', title, message, ...options })

  const info = (title: string, message?: string, options?: Partial<ToastProps>) =>
    showToast({ type: 'info', title, message, ...options })

  return { showToast, success, warning, danger, info, dismiss, toasts }
}