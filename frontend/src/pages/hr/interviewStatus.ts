import { Calendar, CheckCircle, Send, Clock, CircleCheck, FileEdit } from 'lucide-react'

export interface InterviewStatusConfig {
  label: string
  className: string
  icon: typeof Calendar
}

export const INTERVIEW_STATUS_CONFIG: Record<string, InterviewStatusConfig> = {
  draft: {
    label: 'Draft',
    className: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
    icon: FileEdit,
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    icon: Calendar,
  },
  invited: {
    label: 'Invited',
    className: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    icon: Send,
  },
  ready: {
    label: 'Ready',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    icon: CircleCheck,
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    icon: CheckCircle,
  },
}

export function interviewStatusConfig(status: string): InterviewStatusConfig {
  return (
    INTERVIEW_STATUS_CONFIG[status] ?? {
      label: status,
      className: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
      icon: Calendar,
    }
  )
}

export function formatInterviewDate(value: string | null): string {
  if (!value) return 'Not scheduled'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not scheduled'
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
