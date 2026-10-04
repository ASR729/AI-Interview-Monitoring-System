import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Camera,
  ClipboardCheck,
  Clock,
  Info,
  Mic,
  Monitor,
  ShieldCheck,
  User,
  Video,
  Wifi,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { apiClient, ApiError, CandidateInterview } from '@/lib/api'
import { interviewStatusConfig, formatInterviewDate } from '@/pages/hr/interviewStatus'

const PREPARATION_ITEMS = [
  { icon: Camera, label: 'Camera', detail: 'A working camera is required for the interview session' },
  { icon: Mic, label: 'Microphone', detail: 'Check that your microphone is available' },
  { icon: Wifi, label: 'Connection', detail: 'Use a stable internet connection' },
  { icon: Monitor, label: 'Browser', detail: 'A browser with the required media capabilities' },
]

export function IntervieweeInterviewDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [interview, setInterview] = useState<CandidateInterview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setLoadError(null)
    try {
      const response = await apiClient.getMyInterview(id)
      setInterview(response.interview)
    } catch (error) {
      if (error instanceof ApiError) {
        setLoadError(
          error.statusCode === 403
            ? 'You are not authorized to view this interview'
            : error.statusCode === 404
              ? 'Interview not found'
              : error.message
        )
      } else {
        setLoadError('Failed to load the interview')
      }
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl" aria-busy="true">
        <div className="h-8 w-64 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-64 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (loadError || !interview) {
    return (
      <div className="max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-4">
          <Link to="/interviewee/interviews">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to my interviews
          </Link>
        </Button>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="py-12 text-center">
            <ShieldCheck className="h-8 w-8 text-surface-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-surface-900 dark:text-surface-50 font-medium">{loadError ?? 'Interview not found'}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              This interview could not be loaded. It may not exist or may not be assigned to you.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = interviewStatusConfig(interview.status)
  const StatusIcon = status.icon
  const isCompleted = interview.status === 'completed'

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-2">
          <Link to="/interviewee/interviews">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to my interviews
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 truncate">{interview.title}</h1>
            <Badge variant="neutral" className={status.className}>
              <StatusIcon className="h-3 w-3" aria-hidden="true" />
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Interviewer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-surface-900 dark:text-surface-50">
              {interview.interviewer?.name ?? 'To be assigned'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-surface-600 dark:text-surface-400">
              <span className="font-medium text-surface-900 dark:text-surface-50">Scheduled start:</span>{' '}
              {formatInterviewDate(interview.scheduled_start_at)}
            </p>
            {interview.ended_at && (
              <p className="text-surface-600 dark:text-surface-400">
                <span className="font-medium text-surface-900 dark:text-surface-50">Ended:</span>{' '}
                {formatInterviewDate(interview.ended_at)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="h-5 w-5 text-brand-600" aria-hidden="true" />
            Interview Session
          </CardTitle>
          <CardDescription>Next step for this interview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 p-4">
            <Clock className="h-5 w-5 text-surface-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-surface-900 dark:text-surface-50">
                {isCompleted
                  ? 'This interview has been completed.'
                  : interview.status === 'in_progress'
                    ? 'This interview is currently in progress.'
                    : 'Before the interview, complete the pre-interview system check to verify your device and browser.'}
              </p>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                The interview room will be available in the next stage of the platform. You will join the session
                from here when it is ready.
              </p>
            </div>
          </div>
          {!isCompleted && (
            <div className="mt-4">
              <Button asChild>
                <Link to="/interviewee/system-check">Start System Check</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
            Preparation
          </CardTitle>
          <CardDescription>What to prepare before your interview</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
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
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-brand-600" aria-hidden="true" />
            Monitoring Disclosure
          </CardTitle>
          <CardDescription>Please read before your interview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-surface-600 dark:text-surface-400">
          <p>
            This platform supports interview integrity. During your interview session, the system may observe
            selected interview signals — such as camera presence — to provide the interview panel with
            context about the session.
          </p>
          <p>
            To participate, your browser will request access to your camera and (for the system check) your
            microphone. These permissions are requested only so the interview session and readiness checks can
            function. You can allow or deny them in your browser; if a permission is denied, the system check
            will explain what to do next.
          </p>
          <p>
            Your readiness checks run locally in your browser. If you have questions about how interview data is
            handled, please contact your recruiter.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
