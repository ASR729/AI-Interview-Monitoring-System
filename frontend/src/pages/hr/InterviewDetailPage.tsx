import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Mail, Pencil, Send, User, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { apiClient, ApiError, InterviewerUserSummary, InterviewSession } from '@/lib/api'
import { interviewStatusConfig, formatInterviewDate } from './interviewStatus'

export function HRInterviewDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { success, danger } = useToast()

  const [interview, setInterview] = useState<InterviewSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editScheduledAt, setEditScheduledAt] = useState('')
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const [showAssignModal, setShowAssignModal] = useState(false)
  const [interviewers, setInterviewers] = useState<InterviewerUserSummary[]>([])
  const [interviewersLoading, setInterviewersLoading] = useState(false)
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)

  const loadInterview = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setLoadError(null)
    try {
      const response = await apiClient.getInterview(id)
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
    loadInterview()
  }, [loadInterview])

  const startEditing = () => {
    if (!interview) return
    setEditTitle(interview.title)
    setEditScheduledAt(
      interview.scheduled_start_at
        ? new Date(interview.scheduled_start_at).toISOString().slice(0, 16)
        : ''
    )
    setEditErrors({})
    setIsEditing(true)
  }

  const validateEdit = () => {
    const next: Record<string, string> = {}
    if (!editTitle.trim()) {
      next.title = 'Interview title is required'
    }
    if (editScheduledAt) {
      const parsed = new Date(editScheduledAt)
      if (Number.isNaN(parsed.getTime())) {
        next.scheduledAt = 'Please provide a valid date and time'
      }
    }
    setEditErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = async () => {
    if (!interview || !validateEdit()) return
    setIsSaving(true)
    try {
      const response = await apiClient.updateInterview(interview.id, {
        title: editTitle.trim(),
        scheduledStartAt: editScheduledAt ? new Date(editScheduledAt).toISOString() : null,
      })
      setInterview(response.interview)
      setIsEditing(false)
      success('Interview updated', 'The interview details were saved successfully')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to update the interview'
      danger('Update failed', message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInvite = async () => {
    if (!interview) return
    setIsInviting(true)
    try {
      const response = await apiClient.inviteInterview(interview.id)
      setInterview(response.interview)
      setShowInviteModal(false)
      success('Invitation sent', 'The candidate invitation was initiated for this interview')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to initiate the invitation'
      danger('Invitation failed', message)
    } finally {
      setIsInviting(false)
    }
  }

  const openAssignModal = async () => {
    if (!interview) return
    setSelectedInterviewerId(interview.interviewer?.id ?? '')
    setAssignError(null)
    setShowAssignModal(true)
    setInterviewersLoading(true)
    try {
      const response = await apiClient.listInterviewers()
      setInterviewers(response.interviewers)
    } catch {
      setInterviewers([])
    } finally {
      setInterviewersLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!interview || !selectedInterviewerId) return
    setIsAssigning(true)
    try {
      const response = await apiClient.assignInterview(interview.id, selectedInterviewerId)
      setInterview(response.interview)
      setShowAssignModal(false)
      success('Interviewer assigned', 'The interviewer was assigned to this interview')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to assign the interviewer'
      setAssignError(message)
      danger('Assignment failed', message)
    } finally {
      setIsAssigning(false)
    }
  }

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
          <Link to="/hr/interviews">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to interviews
          </Link>
        </Button>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="py-12 text-center">
            <p className="text-surface-900 dark:text-surface-50 font-medium">{loadError ?? 'Interview not found'}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              The interview could not be loaded. It may not exist or you may not have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = interviewStatusConfig(interview.status)
  const StatusIcon = status.icon
  const canInvite = interview.status === 'draft'
  const canAssign = ['draft', 'scheduled', 'invited'].includes(interview.status)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-2">
          <Link to="/hr/interviews">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to interviews
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 truncate">
              {interview.title}
            </h1>
            <Badge variant="neutral" className={status.className}>
              <StatusIcon className="h-3 w-3" aria-hidden="true" />
              {status.label}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            {canAssign && (
              <Button variant="neutral" size="sm" className="gap-2" onClick={openAssignModal} disabled={isEditing}>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                {interview.interviewer ? 'Reassign Interviewer' : 'Assign Interviewer'}
              </Button>
            )}
            <Button variant="neutral" size="sm" className="gap-2" onClick={startEditing} disabled={isEditing}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit Details
            </Button>
            {canInvite && (
              <Button size="sm" className="gap-2" onClick={() => setShowInviteModal(true)}>
                <Send className="h-4 w-4" aria-hidden="true" />
                Send Invitation
              </Button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <Card className="border-brand-300 dark:border-brand-800">
          <CardHeader>
            <CardTitle className="text-lg">Edit interview details</CardTitle>
            <CardDescription>Update the interview title and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-2">
                <label htmlFor="edit-title" className="label">Interview title</label>
                <Input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value)
                    if (editErrors.title) setEditErrors((prev) => ({ ...prev, title: '' }))
                  }}
                  error={editErrors.title}
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-scheduled" className="label">Scheduled date & time</label>
                <Input
                  id="edit-scheduled"
                  type="datetime-local"
                  value={editScheduledAt}
                  onChange={(e) => {
                    setEditScheduledAt(e.target.value)
                    if (editErrors.scheduledAt) setEditErrors((prev) => ({ ...prev, scheduledAt: '' }))
                  }}
                  error={editErrors.scheduledAt}
                  disabled={isSaving}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                <Button variant="neutral" type="button" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" loading={isSaving}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Candidate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {interview.candidate ? (
              <>
                <p className="font-medium text-surface-900 dark:text-surface-50">{interview.candidate.name ?? 'Candidate'}</p>
                <p className="text-surface-600 dark:text-surface-400 flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {interview.candidate.email ?? 'No email on record'}
                </p>
              </>
            ) : (
              <p className="text-surface-500 dark:text-surface-400">No candidate associated with this interview</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Interviewer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {interview.interviewer ? (
              <p className="font-medium text-surface-900 dark:text-surface-50">{interview.interviewer.name ?? 'Interviewer'}</p>
            ) : (
              <p className="text-surface-500 dark:text-surface-400">
                No interviewer assigned yet.
                {canAssign && ' Use “Assign Interviewer” to choose who conducts this interview.'}
              </p>
            )}
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
            <p className="text-surface-600 dark:text-surface-400">
              <span className="font-medium text-surface-900 dark:text-surface-50">Created:</span>{' '}
              {formatInterviewDate(interview.created_at)}
            </p>
            <p className="text-surface-600 dark:text-surface-400">
              <span className="font-medium text-surface-900 dark:text-surface-50">Last updated:</span>{' '}
              {formatInterviewDate(interview.updated_at)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg">Invitation</CardTitle>
          <CardDescription>Candidate invitation state for this interview</CardDescription>
        </CardHeader>
        <CardContent>
          {interview.invite_reference ? (
            <div className="space-y-2">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                An invitation has been initiated for this interview.
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <span className="font-medium text-surface-900 dark:text-surface-50">Reference:</span>{' '}
                <code className="text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
                  {interview.invite_reference}
                </code>
              </p>
            </div>
          ) : (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              No invitation has been sent yet.
              {canInvite && ' Use “Send Invitation” to initiate the candidate invitation workflow.'}
            </p>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Send Invitation"
        size="md"
      >
        <div className="space-y-5">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            This will initiate the candidate invitation workflow for{' '}
            <span className="font-medium text-surface-900 dark:text-surface-50">{interview.title}</span>
            {interview.candidate?.name ? <> and invite {interview.candidate.name}</> : null}. The interview
            status will change from Draft to Invited.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" type="button" onClick={() => setShowInviteModal(false)} disabled={isInviting}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
            <Button type="button" loading={isInviting} onClick={handleInvite}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={interview.interviewer ? 'Reassign Interviewer' : 'Assign Interviewer'}
        size="md"
      >
        <div className="space-y-5">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Select the interviewer who will conduct this interview. You can change the assignment while the
            interview has not started.
          </p>
          <Select
            id="assign-interviewer"
            label="Interviewer"
            value={selectedInterviewerId}
            onValueChange={(value) => {
              setSelectedInterviewerId(value)
              setAssignError(null)
            }}
            options={[
              { value: '', label: 'Select an interviewer' },
              ...interviewers.map((i) => ({
                value: i.id,
                label: `${i.name ?? 'Interviewer'} — ${i.email ?? 'no email'}`,
              })),
            ]}
            disabled={isAssigning || interviewersLoading}
            error={assignError ?? undefined}
          />
          {interviewersLoading && (
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading interviewers…</p>
          )}
          {!interviewersLoading && interviewers.length === 0 && (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              No active interviewer accounts are available.
            </p>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" type="button" onClick={() => setShowAssignModal(false)} disabled={isAssigning}>
              Cancel
            </Button>
            <Button type="button" loading={isAssigning} disabled={!selectedInterviewerId} onClick={handleAssign}>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Assign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
