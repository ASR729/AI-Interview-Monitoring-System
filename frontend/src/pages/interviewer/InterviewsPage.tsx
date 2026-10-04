import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { apiClient, ApiError, AssignedInterview } from '@/lib/api'
import { interviewStatusConfig, formatInterviewDate } from '@/pages/hr/interviewStatus'

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'invited', label: 'Invited' },
  { value: 'ready', label: 'Ready' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export function InterviewerInterviewsPage() {
  const [interviews, setInterviews] = useState<AssignedInterview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortAsc, setSortAsc] = useState(true)

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

  const filteredInterviews = useMemo(() => {
    let result = [...interviews]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          (i.candidate?.name ?? '').toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((i) => i.status === statusFilter)
    }

    result.sort((a, b) => {
      const aTime = a.scheduled_start_at ? new Date(a.scheduled_start_at).getTime() : Number.MAX_SAFE_INTEGER
      const bTime = b.scheduled_start_at ? new Date(b.scheduled_start_at).getTime() : Number.MAX_SAFE_INTEGER
      return sortAsc ? aTime - bTime : bTime - aTime
    })

    return result
  }, [interviews, searchQuery, statusFilter, sortAsc])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">My Interviews</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Interviews assigned to you — upcoming, ongoing and completed
          </p>
        </div>
        <Button
          variant="neutral"
          size="sm"
          className="gap-2"
          onClick={() => setSortAsc(!sortAsc)}
          aria-label={`Sort by scheduled time ${sortAsc ? 'ascending' : 'descending'}`}
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>Scheduled: {sortAsc ? 'earliest first' : 'latest first'}</span>
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

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
              <Input
                placeholder="Search by title or candidate name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search assigned interviews"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-40"
              aria-label="Filter by status"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-surface-100 dark:bg-surface-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="py-14 px-4 text-center">
              <Calendar className="h-10 w-10 text-surface-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-surface-900 dark:text-surface-50 font-medium">
                {interviews.length === 0 ? 'No interviews are assigned to you yet' : 'No interviews match your search or filter'}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {interviews.length === 0
                  ? 'Interviews appear here once HR assigns you as the interviewer'
                  : 'Try a different search term or status filter'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800 text-left text-surface-500 dark:text-surface-400">
                    <th scope="col" className="px-4 py-3 font-medium">Interview</th>
                    <th scope="col" className="px-4 py-3 font-medium">Candidate</th>
                    <th scope="col" className="px-4 py-3 font-medium">Schedule</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {filteredInterviews.map((interview) => {
                    const status = interviewStatusConfig(interview.status)
                    const StatusIcon = status.icon
                    return (
                      <tr key={interview.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            to={`/interviewer/interviews/${interview.id}`}
                            className="font-medium text-surface-900 dark:text-surface-50 hover:text-brand-600 dark:hover:text-brand-400"
                          >
                            {interview.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                          {interview.candidate?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                          <p className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatInterviewDate(interview.scheduled_start_at)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="neutral" className={`gap-1 ${status.className}`}>
                            <StatusIcon className="h-3 w-3" aria-hidden="true" />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="neutral" size="sm" asChild>
                            <Link to={`/interviewer/interviews/${interview.id}`}>Open</Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
