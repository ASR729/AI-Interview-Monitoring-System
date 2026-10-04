import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { apiClient, ApiError, AssignedInterview } from '@/lib/api'
import { formatInterviewDate } from '@/pages/hr/interviewStatus'

// Permitted report access (Phase 8, PRD-FR-010): reports are accessed per
// interview from the interview detail page. This screen only lists completed
// assigned interviews where a report may exist. Report generation belongs to
// Phase 19; no fabricated report data is shown here.
export function InterviewerReportsPage() {
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

  const completed = useMemo(() => interviews.filter((i) => i.status === 'completed'), [interviews])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Reports</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Post-interview reports for your completed assigned interviews
        </p>
      </div>

      {loadError && (
        <Card className="border-danger-300 dark:border-danger-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Could not load interviews</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{loadError}</p>
            </div>
            <Button variant="neutral" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle>Completed Interviews</CardTitle>
          <CardDescription>
            Reports are generated after interviews are completed and reviewed; open a completed interview to view
            its report when available
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3" aria-busy="true">
              {[0, 1].map((i) => (
                <div key={i} className="h-12 bg-surface-100 dark:bg-surface-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : completed.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <FileText className="h-8 w-8 text-surface-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-surface-500 dark:text-surface-400">
                No completed interviews yet — reports will appear here once your assigned interviews are completed.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-surface-100 dark:divide-surface-800">
              {completed.map((interview) => (
                <li key={interview.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.title}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                      {interview.candidate?.name ?? 'Candidate'}
                      {interview.ended_at ? ` · Ended ${formatInterviewDate(interview.ended_at)}` : ''}
                    </p>
                  </div>
                  <Button variant="neutral" size="sm" asChild className="ml-3 flex-shrink-0">
                    <Link to={`/interviewer/interviews/${interview.id}`}>
                      View Report
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
