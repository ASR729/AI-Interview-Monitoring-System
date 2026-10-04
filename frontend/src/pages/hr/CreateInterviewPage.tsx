import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import {
  apiClient,
  ApiError,
  CandidateProfileSummary,
  InterviewerUserSummary,
} from '@/lib/api'

export function HRCreateInterviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { success, danger } = useToast()

  const [candidates, setCandidates] = useState<CandidateProfileSummary[]>([])
  const [candidatesLoading, setCandidatesLoading] = useState(true)
  const [candidatesError, setCandidatesError] = useState<string | null>(null)

  const [interviewers, setInterviewers] = useState<InterviewerUserSummary[]>([])
  const [interviewersLoading, setInterviewersLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [candidateId, setCandidateId] = useState(
    (location.state as { candidateId?: string } | null)?.candidateId ?? ''
  )
  const [interviewerId, setInterviewerId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    apiClient
      .listCandidates()
      .then((response) => {
        if (!cancelled) setCandidates(response.candidates)
      })
      .catch((error) => {
        if (!cancelled) {
          setCandidatesError(error instanceof ApiError ? error.message : 'Failed to load candidates')
        }
      })
      .finally(() => {
        if (!cancelled) setCandidatesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    apiClient
      .listInterviewers()
      .then((response) => {
        if (!cancelled) setInterviewers(response.interviewers)
      })
      .catch(() => {
        if (!cancelled) setInterviewers([])
      })
      .finally(() => {
        if (!cancelled) setInterviewersLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!title.trim()) {
      next.title = 'Interview title is required'
    }
    if (!candidateId) {
      next.candidateId = 'Please select a candidate'
    }
    if (scheduledAt) {
      const parsed = new Date(scheduledAt)
      if (Number.isNaN(parsed.getTime())) {
        next.scheduledAt = 'Please provide a valid date and time'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await apiClient.createInterview({
        title: title.trim(),
        candidateId,
        scheduledStartAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        interviewerId: interviewerId || null,
      })
      success('Interview created', 'The interview session was created successfully')
      navigate(`/hr/interviews/${response.interview.id}`, { replace: true })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to create the interview'
      danger('Create interview failed', message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-2">
          <Link to="/hr/interviews">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to interviews
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Create Interview</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Configure a new interview session and associate a candidate
        </p>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg">Interview details</CardTitle>
          <CardDescription>
            Provide the interview information required by the current workflow. Monitoring and
            AI configuration is applied by the system in later stages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="title" className="label">Interview title</label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                }}
                placeholder="Senior Frontend Engineer — Technical Screen"
                error={errors.title}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Select
                id="candidate"
                label="Candidate"
                value={candidateId}
                onValueChange={(value) => {
                  setCandidateId(value)
                  if (errors.candidateId) setErrors((prev) => ({ ...prev, candidateId: '' }))
                }}
                options={[
                  { value: '', label: 'Select a candidate' },
                  ...candidates.map((c) => ({
                    value: c.id,
                    label: `${c.name ?? 'Candidate'} — ${c.email ?? 'no email'}`,
                  })),
                ]}
                error={errors.candidateId}
                disabled={isSubmitting || candidatesLoading || candidates.length === 0}
                required
              />
              {candidatesLoading && (
                <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full" aria-hidden="true" />
                  Loading candidates…
                </p>
              )}
              {candidatesError && (
                <p className="text-sm text-danger-600 dark:text-danger-400">{candidatesError}</p>
              )}
              {!candidatesLoading && !candidatesError && candidates.length === 0 && (
                <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  No registered candidates are available yet. A candidate must have an interviewee account to be associated.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Select
                id="interviewer"
                label="Interviewer"
                value={interviewerId}
                onValueChange={setInterviewerId}
                options={[
                  { value: '', label: 'Assign later' },
                  ...interviewers.map((i) => ({
                    value: i.id,
                    label: `${i.name ?? 'Interviewer'} — ${i.email ?? 'no email'}`,
                  })),
                ]}
                disabled={isSubmitting || interviewersLoading}
                helperText="Optional — you can assign an interviewer later from the interview details page."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="scheduledAt" className="label flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Scheduled date &amp; time <span className="text-surface-400 font-normal">(optional)</span>
              </label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => {
                  setScheduledAt(e.target.value)
                  if (errors.scheduledAt) setErrors((prev) => ({ ...prev, scheduledAt: '' }))
                }}
                error={errors.scheduledAt}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <Button variant="neutral" type="button" asChild disabled={isSubmitting}>
                <Link to="/hr/interviews">Cancel</Link>
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Create Interview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
