import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { apiClient, ApiError, CandidateInterview } from '@/lib/api'
import { formatInterviewDate } from '@/pages/hr/interviewStatus'

// Interview history (Phase 9, UX-CAN-001): the candidate's own completed
// sessions only — authorized via interview_sessions.candidate_id on the
// backend. No integrity information, monitoring events or reports are exposed
// here (candidate-facing analytics belong to later phases / product TBD).
export function IntervieweeHistoryPage() {
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
          setLoadError(error instanceof ApiError ? error.message : 'Failed to load your interview history')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const completed = useMemo(() => interviews.filter((i) => i.status === 'completed'), [interviews])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">History</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">Your completed interview sessions</p>
      </div>

      {loadError && (
        <Card className="border-danger-300 dark:border-danger-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Could not load your history</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{loadError}</p>
            </div>
            <Button variant="neutral" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 bg-surface-100 dark:bg-surface-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : completed.length === 0 ? (
            <div className="py-14 px-4 text-center">
              <Calendar className="h-10 w-10 text-surface-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-surface-900 dark:text-surface-50 font-medium">No completed interviews yet</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                Your completed interview sessions will appear here
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-surface-100 dark:divide-surface-800">
              {completed.map((interview) => (
                <li key={interview.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <Link
                      to={`/interviewee/interviews/${interview.id}`}
                      className="font-medium text-surface-900 dark:text-surface-50 hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      {interview.title}
                    </Link>
                    <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                      {interview.interviewer?.name ? `Interviewer: ${interview.interviewer.name}` : 'Interviewer to be assigned'}
                      {interview.ended_at ? ` · Ended ${formatInterviewDate(interview.ended_at)}` : ''}
                    </p>
                  </div>
                  <Badge variant="neutral" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 flex-shrink-0 ml-3">
                    <CheckCircle className="h-3 w-3" aria-hidden="true" />
                    Completed
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
