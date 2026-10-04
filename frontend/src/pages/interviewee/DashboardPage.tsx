import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Camera,
  CheckCircle,
  ClipboardCheck,
  Clock,
  FileText,
  Mic,
  Monitor,
  User,
  Wifi,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { apiClient, ApiError, CandidateInterview } from '@/lib/api'
import { interviewStatusConfig, formatInterviewDate } from '@/pages/hr/interviewStatus'

const PREPARATION_ITEMS = [
  { icon: Camera, label: 'Camera ready', detail: 'A working camera is required — test it in the system check' },
  { icon: Mic, label: 'Microphone ready', detail: 'Check microphone access in the system check' },
  { icon: Wifi, label: 'Stable connection', detail: 'Use a reliable internet connection' },
  { icon: Monitor, label: 'Supported browser', detail: 'A browser with the required media capabilities' },
  { icon: ClipboardCheck, label: 'Monitoring disclosure', detail: 'Review the monitoring information before your interview' },
]

export function IntervieweeDashboardPage() {
  const { user } = useAuth()

  const [interviews, setInterviews] = useState<CandidateInterview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    apiClient
      .listMyInterviews()
      .then((response) => {
        if (!cancelled) setInterviews(response.interviews)
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiError ? error.message : 'Failed to load your interviews')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const nextInterview = useMemo(() => {
    const notCompleted = interviews.filter((i) => i.status !== 'completed')
    return (
      notCompleted
        .slice()
        .sort((a, b) => {
          const aTime = a.scheduled_start_at ? new Date(a.scheduled_start_at).getTime() : Number.MAX_SAFE_INTEGER
          const bTime = b.scheduled_start_at ? new Date(b.scheduled_start_at).getTime() : Number.MAX_SAFE_INTEGER
          return aTime - bTime
        })[0] ?? null
    )
  }, [interviews])

  const completedInterviews = useMemo(
    () => interviews.filter((i) => i.status === 'completed').slice(0, 5),
    [interviews]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">My Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Welcome back{user?.name ? `, ${user.name}` : ''} — your assigned interviews and preparation
        </p>
      </div>

      {loadError && (
        <Card className="border-danger-300 dark:border-danger-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Could not load your interviews</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{loadError}</p>
            </div>
            <Button variant="neutral" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-6" aria-busy="true">
          <div className="h-40 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
          {nextInterview ? (
            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-brand-600" aria-hidden="true" />
                    Next Interview
                  </CardTitle>
                  <CardDescription>Your upcoming assigned session</CardDescription>
                </div>
                {(() => {
                  const status = interviewStatusConfig(nextInterview.status)
                  const StatusIcon = status.icon
                  return (
                    <Badge variant="neutral" className={`${status.className} flex-shrink-0`}>
                      <StatusIcon className="h-3 w-3" aria-hidden="true" />
                      {status.label}
                    </Badge>
                  )
                })()}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold text-surface-900 dark:text-surface-50">{nextInterview.title}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {formatInterviewDate(nextInterview.scheduled_start_at)}
                  </p>
                  {nextInterview.interviewer?.name && (
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
                      <User className="h-4 w-4" aria-hidden="true" />
                      Interviewer: {nextInterview.interviewer.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to={`/interviewee/interviews/${nextInterview.id}`}>Open Interview</Link>
                  </Button>
                  <Button variant="neutral" asChild>
                    <Link to="/interviewee/system-check">Run System Check</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="py-14 text-center max-w-md mx-auto">
                <Calendar className="h-10 w-10 text-surface-400 mx-auto mb-3" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">No interview is currently available</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
                  You will see your interview here once a recruiter assigns and invites you. You can complete the
                  system check in advance to be ready.
                </p>
                <Button variant="neutral" className="mt-4" asChild>
                  <Link to="/interviewee/system-check">Run System Check</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader>
                <CardTitle>Preparation Checklist</CardTitle>
                <CardDescription>Get ready before your interview — complete the system check to verify your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {PREPARATION_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-lg border border-surface-200 dark:border-surface-700 p-3">
                      <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex-shrink-0">
                        <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{item.detail}</p>
                      </div>
                    </div>
                  )
                })}
                <Button variant="neutral" className="w-full" asChild>
                  <Link to="/interviewee/system-check">Start System Check</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent History</CardTitle>
                  <CardDescription>Your completed interview sessions</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/interviewee/history" className="flex items-center gap-1">
                    View all
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {completedInterviews.length === 0 ? (
                  <div className="py-10 px-4 text-center">
                    <FileText className="h-8 w-8 text-surface-400 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">No completed interviews yet</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-surface-100 dark:divide-surface-800">
                    {completedInterviews.map((interview) => (
                      <li key={interview.id}>
                        <Link
                          to={`/interviewee/interviews/${interview.id}`}
                          className="flex items-center justify-between px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.title}</p>
                            <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                              {interview.ended_at ? `Ended ${formatInterviewDate(interview.ended_at)}` : 'Completed'}
                            </p>
                          </div>
                          <Badge variant="neutral" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 flex-shrink-0">
                            <CheckCircle className="h-3 w-3" aria-hidden="true" />
                            Completed
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
