import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
  Plus,
  Eye,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { apiClient, ApiError, InterviewSession } from '@/lib/api'
import { interviewStatusConfig, formatInterviewDate } from './interviewStatus'

export function HRDashboardPage() {
  const { user } = useAuth()

  const [interviews, setInterviews] = useState<InterviewSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    apiClient
      .listInterviews()
      .then((response) => {
        if (!cancelled) setInterviews(response.interviews)
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiError ? error.message : 'Failed to load interviews')
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
      draft: interviews.filter((i) => i.status === 'draft').length,
      upcoming: interviews.filter((i) => {
        if (!i.scheduled_start_at) return false
        const start = new Date(i.scheduled_start_at)
        return !Number.isNaN(start.getTime()) && start.getTime() > Date.now()
      }).length,
      inProgress: interviews.filter((i) => i.status === 'in_progress').length,
      completed: interviews.filter((i) => i.status === 'completed').length,
      pendingInvites: interviews.filter((i) => i.status === 'draft' && !i.invite_reference).length,
    }),
    [interviews]
  )

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter((i) => {
          if (!i.scheduled_start_at) return false
          const start = new Date(i.scheduled_start_at)
          return !Number.isNaN(start.getTime()) && start.getTime() > Date.now()
        })
        .sort(
          (a, b) =>
            new Date(a.scheduled_start_at ?? 0).getTime() - new Date(b.scheduled_start_at ?? 0).getTime()
        )
        .slice(0, 5),
    [interviews]
  )

  const recentInterviews = useMemo(() => interviews.slice(0, 5), [interviews])

  const statCards = [
    { label: 'Total Interviews', value: stats.total, icon: Calendar, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
    { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'In Progress', value: stats.inProgress, icon: CheckCircle, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/30' },
    { label: 'Pending Invitations', value: stats.pendingInvites, icon: Send, color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">HR Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''} — overview of your interview sessions
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link to="/hr/interviews/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Interview</span>
          </Link>
        </Button>
      </div>

      {loadError && (
        <Card className="border-danger-300 dark:border-danger-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Could not load dashboard data</p>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your latest interview sessions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/hr/interviews" className="flex items-center gap-1">
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
            ) : recentInterviews.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <Calendar className="h-8 w-8 text-surface-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-surface-500 dark:text-surface-400">No interviews yet</p>
                <Button variant="neutral" size="sm" className="mt-3 gap-2" asChild>
                  <Link to="/hr/interviews/new">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create your first interview
                  </Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-surface-100 dark:divide-surface-800">
                {recentInterviews.map((interview) => {
                  const status = interviewStatusConfig(interview.status)
                  const StatusIcon = status.icon
                  return (
                    <li key={interview.id}>
                      <Link
                        to={`/hr/interviews/${interview.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-surface-900 dark:text-surface-50 truncate">
                            {interview.title}
                          </p>
                          <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                            {interview.candidate?.name ?? 'No candidate'} · {formatInterviewDate(interview.scheduled_start_at)}
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

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <div>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Scheduled interview sessions ahead of today</CardDescription>
            </div>
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
                <Clock className="h-8 w-8 text-surface-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-surface-500 dark:text-surface-400">No upcoming interviews scheduled</p>
              </div>
            ) : (
              <ul className="divide-y divide-surface-100 dark:divide-surface-800">
                {upcomingInterviews.map((interview) => {
                  const status = interviewStatusConfig(interview.status)
                  const StatusIcon = status.icon
                  return (
                    <li key={interview.id}>
                      <Link
                        to={`/hr/interviews/${interview.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-surface-900 dark:text-surface-50 truncate">
                            {interview.title}
                          </p>
                          <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                            {interview.candidate?.name ?? 'No candidate'} · {formatInterviewDate(interview.scheduled_start_at)}
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

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/30">
              <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg">Interview Management</CardTitle>
          </div>
          <CardDescription>
            Live monitoring, integrity indicators and reports become available in later stages
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          <Button variant="neutral" className="w-full justify-start gap-3" asChild>
            <Link to="/hr/interviews/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Create Interview</span>
            </Link>
          </Button>
          <Button variant="neutral" className="w-full justify-start gap-3" asChild>
            <Link to="/hr/interviews">
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>View Interviews</span>
            </Link>
          </Button>
          <Button variant="neutral" className="w-full justify-start gap-3" asChild>
            <Link to="/hr/candidates">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Candidate List</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
