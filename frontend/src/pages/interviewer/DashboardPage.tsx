import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { apiClient, ApiError, AssignedInterview } from '@/lib/api'
import { interviewStatusConfig, formatInterviewDate } from '@/pages/hr/interviewStatus'

const isOngoing = (i: AssignedInterview) => i.status === 'in_progress'
const isCompleted = (i: AssignedInterview) => i.status === 'completed'
const isUpcoming = (i: AssignedInterview) => !isOngoing(i) && !isCompleted(i)

export function InterviewerDashboardPage() {
  const { user } = useAuth()

  const [interviews, setInterviews] = useState<AssignedInterview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    apiClient
      .listAssignedInterviews()
      .then((response) => {
        if (!cancelled) setInterviews(response.interviews)
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiError ? error.message : 'Failed to load assigned interviews')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(
    () => ({
      total: interviews.length,
      upcoming: interviews.filter(isUpcoming).length,
      ongoing: interviews.filter(isOngoing).length,
      completed: interviews.filter(isCompleted).length,
    }),
    [interviews]
  )

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter(isUpcoming)
        .sort((a, b) => {
          const aTime = a.scheduled_start_at ? new Date(a.scheduled_start_at).getTime() : Number.MAX_SAFE_INTEGER
          const bTime = b.scheduled_start_at ? new Date(b.scheduled_start_at).getTime() : Number.MAX_SAFE_INTEGER
          return aTime - bTime
        })
        .slice(0, 5),
    [interviews]
  )

  const statCards = [
    { label: 'Assigned Interviews', value: stats.total, icon: Calendar, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
    { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Ongoing', value: stats.ongoing, icon: Video, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/30' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Interviewer Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''} — interviews assigned to you
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link to="/interviewer/interviews">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>My Interviews</span>
          </Link>
        </Button>
      </div>

      {loadError && (
        <Card className="border-danger-300 dark:border-danger-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Could not load assigned interviews</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{loadError}</p>
            </div>
            <Button variant="neutral" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">{stat.label}</p>
                    {isLoading ? (
                      <div className="h-9 w-16 bg-surface-200 dark:bg-surface-800 rounded animate-pulse" aria-hidden="true" />
                    ) : (
                      <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">{stat.value}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Interviews assigned to you, earliest first</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/interviewer/interviews" className="flex items-center gap-1">
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 bg-surface-100 dark:bg-surface-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : upcomingInterviews.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <Calendar className="h-8 w-8 text-surface-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-surface-500 dark:text-surface-400">
                No interviews are assigned to you yet. Once HR assigns you to an interview, it will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-surface-100 dark:divide-surface-800">
              {upcomingInterviews.map((interview) => {
                const status = interviewStatusConfig(interview.status)
                const StatusIcon = status.icon
                return (
                  <li key={interview.id}>
                    <Link
                      to={`/interviewer/interviews/${interview.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.title}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400 truncate flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" aria-hidden="true" />
                          {interview.candidate?.name ?? 'Candidate'} · {formatInterviewDate(interview.scheduled_start_at)}
                        </p>
                      </div>
                      <Badge variant="neutral" className={`${status.className} ml-3 flex-shrink-0`}>
                        <StatusIcon className="h-3 w-3" aria-hidden="true" />
                        {status.label}
                      </Badge>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
