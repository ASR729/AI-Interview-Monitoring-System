import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Video,
  Mic,
  Monitor,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable, TableColumn } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'

const mockInterviews = [
  { id: 'INT-001', candidate: 'Sarah Chen', candidateEmail: 'sarah.chen@email.com', role: 'Senior Frontend Engineer', interviewer: 'Michael Torres', interviewerEmail: 'michael.torres@company.com', date: '2024-01-15', time: '10:00 AM', duration: 45, status: 'completed', integrityScore: 94, alerts: 0, recordingUrl: '#', reportUrl: '#' },
  { id: 'INT-002', candidate: 'Alex Rivera', candidateEmail: 'alex.rivera@email.com', role: 'Backend Developer', interviewer: 'Priya Patel', interviewerEmail: 'priya.patel@company.com', date: '2024-01-15', time: '02:00 PM', duration: 60, status: 'in_progress', integrityScore: 87, alerts: 2, recordingUrl: '#', reportUrl: '#' },
  { id: 'INT-003', candidate: 'Jordan Kim', candidateEmail: 'jordan.kim@email.com', role: 'DevOps Engineer', interviewer: 'David Park', interviewerEmail: 'david.park@company.com', date: '2024-01-16', time: '09:30 AM', duration: 45, status: 'scheduled', integrityScore: null, alerts: 0, recordingUrl: null, reportUrl: null },
  { id: 'INT-004', candidate: 'Taylor Morgan', candidateEmail: 'taylor.morgan@email.com', role: 'Full Stack Developer', interviewer: 'Lisa Wang', interviewerEmail: 'lisa.wang@company.com', date: '2024-01-16', time: '11:00 AM', duration: 60, status: 'scheduled', integrityScore: null, alerts: 0, recordingUrl: null, reportUrl: null },
  { id: 'INT-005', candidate: 'Casey Johnson', candidateEmail: 'casey.j@email.com', role: 'ML Engineer', interviewer: 'Robert Kim', interviewerEmail: 'robert.kim@company.com', date: '2024-01-17', time: '10:00 AM', duration: 60, status: 'scheduled', integrityScore: null, alerts: 0, recordingUrl: null, reportUrl: null },
  { id: 'INT-006', candidate: 'Morgan Lee', candidateEmail: 'morgan.lee@email.com', role: 'Security Engineer', interviewer: 'Amanda Foster', interviewerEmail: 'amanda.foster@company.com', date: '2024-01-17', time: '03:00 PM', duration: 45, status: 'cancelled', integrityScore: null, alerts: 0, recordingUrl: null, reportUrl: null },
  { id: 'INT-007', candidate: 'Riley Park', candidateEmail: 'riley.park@email.com', role: 'Data Engineer', interviewer: 'James Chen', interviewerEmail: 'james.chen@company.com', date: '2024-01-18', time: '09:00 AM', duration: 60, status: 'scheduled', integrityScore: null, alerts: 0, recordingUrl: null, reportUrl: null },
  { id: 'INT-008', candidate: 'Avery Brooks', candidateEmail: 'avery.brooks@email.com', role: 'QA Engineer', interviewer: 'Emma Wilson', interviewerEmail: 'emma.wilson@company.com', date: '2024-01-18', time: '02:00 PM', duration: 45, status: 'completed', integrityScore: 91, alerts: 1, recordingUrl: '#', reportUrl: '#' },
  { id: 'INT-009', candidate: 'Quinn Adams', candidateEmail: 'quinn.adams@email.com', role: 'Mobile Developer', interviewer: 'Chris Taylor', interviewerEmail: 'chris.taylor@company.com', date: '2024-01-19', time: '10:30 AM', duration: 60, status: 'completed', integrityScore: 96, alerts: 0, recordingUrl: '#', reportUrl: '#' },
  { id: 'INT-010', candidate: 'Dakota Cruz', candidateEmail: 'dakota.cruz@email.com', role: 'Site Reliability Engineer', interviewer: 'Nina Rodriguez', interviewerEmail: 'nina.rodriguez@company.com', date: '2024-01-19', time: '03:00 PM', duration: 45, status: 'in_progress', integrityScore: 89, alerts: 1, recordingUrl: '#', reportUrl: '#' },
]

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300', icon: Calendar },
  in_progress: { label: 'In Progress', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: Video },
  completed: { label: 'Completed', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300', icon: AlertTriangle },
}

export function HRInterviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'candidate' | 'integrityScore'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedInterview, setSelectedInterview] = useState<typeof mockInterviews[0] | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const filteredInterviews = useMemo(() => {
    let result = [...mockInterviews]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.candidate.toLowerCase().includes(query) ||
        i.role.toLowerCase().includes(query) ||
        i.interviewer.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter)
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      if (dateFilter === 'today') result = result.filter(i => i.date === today)
      else if (dateFilter === 'week') result = result.filter(i => i.date >= weekAgo)
      else if (dateFilter === 'month') result = result.filter(i => i.date >= monthAgo)
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortBy]
      let bVal: string | number = b[sortBy]
      if (sortBy === 'integrityScore') {
        aVal = a.integrityScore ?? -1
        bVal = b.integrityScore ?? -1
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      return sortOrder === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1
    })

    return result
  }, [searchQuery, statusFilter, dateFilter, sortBy, sortOrder])

  const stats = useMemo(() => ({
    total: mockInterviews.length,
    scheduled: mockInterviews.filter(i => i.status === 'scheduled').length,
    inProgress: mockInterviews.filter(i => i.status === 'in_progress').length,
    completed: mockInterviews.filter(i => i.status === 'completed').length,
    cancelled: mockInterviews.filter(i => i.status === 'cancelled').length,
    avgIntegrity: mockInterviews.filter(i => i.integrityScore !== null).reduce((sum, i) => sum + (i.integrityScore || 0), 0) /
      Math.max(1, mockInterviews.filter(i => i.integrityScore !== null).length),
  }), [])

  const columns: TableColumn<typeof mockInterviews[0]>[] = [
    { key: 'id', header: 'Interview ID', width: 'w-32' },
    { key: 'candidate', header: 'Candidate', render: (row) => (
      <div>
        <p className="font-medium text-surface-900 dark:text-surface-50">{row.candidate}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">{row.role}</p>
      </div>
    )},
    { key: 'interviewer', header: 'Interviewer' },
    { key: 'date', header: 'Date & Time', render: (row) => (
      <div className="space-y-1">
        <p className="font-medium">{row.date}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {row.time} · {row.duration} min
        </p>
      </div>
    )},
    { key: 'status', header: 'Status', render: (row) => {
      const config = statusConfig[row.status as keyof typeof statusConfig]
      const Icon = config?.icon || Calendar
      return (
        <Badge variant="neutral" className={cn('gap-1', config?.color)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {config?.label || row.status}
        </Badge>
      )
    }},
    { key: 'integrityScore', header: 'Integrity', render: (row) => row.integrityScore !== null ? (
      <div className="flex items-center gap-2">
        <Progress value={row.integrityScore} max={100} className="w-24 h-2" showLabel={false} />
        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{row.integrityScore}%</span>
      </div>
    ) : (
      <Badge variant="neutral" className="bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400">—</Badge>
    )},
    { key: 'alerts', header: 'Alerts', render: (row) => row.alerts > 0 ? (
      <Badge variant="danger" className="gap-1">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        {row.alerts}
      </Badge>
    ) : (
      <Badge variant="success" className="gap-1">
        <CheckCircle className="h-3 w-3" aria-hidden="true" />
        Clean
      </Badge>
    )},
    { key: 'actions', header: 'Actions', render: (row) => (
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        align="right"
        items={[
          { label: 'View Details', value: 'view', icon: <Eye className="h-4 w-4" />, onSelect: () => setSelectedInterview(row) },
          { label: row.status === 'in_progress' ? 'Join Live' : 'View Recording', value: 'recording', icon: row.status === 'in_progress' ? <Video className="h-4 w-4" /> : <Monitor className="h-4 w-4" /> },
          { label: 'Download Report', value: 'report', icon: <Download className="h-4 w-4" />, disabled: !row.reportUrl },
          { label: 'Edit', value: 'edit', icon: <Edit className="h-4 w-4" /> },
          { divider: true },
          { label: row.status === 'scheduled' ? 'Cancel' : 'Delete', value: 'cancel', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Interviews</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage and monitor all interview sessions</p>
        </div>
        <Button className="gap-2" onClick={() => setShowScheduleModal(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Schedule Interview</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">Total</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">Scheduled</p>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.scheduled}</p>
          </CardContent>
        </Card>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">In Progress</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">Completed</p>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">Cancelled</p>
            <p className="text-2xl font-bold text-surface-500 dark:text-surface-400">{stats.cancelled}</p>
          </CardContent>
        </Card>
        <Card className="border-surface-200 dark:border-surface-800">
          <CardContent className="p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">Avg Integrity</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{Math.round(stats.avgIntegrity)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
              <Input
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="neutral" size="sm" className="gap-2" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <Filter className="h-4 w-4" aria-hidden="true" />
                <span>Sort: {sortBy}</span>
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-36"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input w-36"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredInterviews}
            striped
            hoverable
            emptyMessage="No interviews found matching your criteria"
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedInterview}
        onClose={() => setSelectedInterview(null)}
        title={selectedInterview ? `Interview ${selectedInterview.id}` : 'Interview Details'}
        size="lg"
      >
        {selectedInterview && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">{selectedInterview.candidate}</h3>
                <p className="text-surface-600 dark:text-surface-400">{selectedInterview.role}</p>
              </div>
              <Badge variant="neutral" className={cn('text-base px-3 py-1', statusConfig[selectedInterview.status as keyof typeof statusConfig]?.color)}>
                {(() => {
                  const Icon = statusConfig[selectedInterview.status as keyof typeof statusConfig]?.icon
                  return Icon ? <Icon className="h-3 w-3 mr-1" aria-hidden="true" /> : null
                })()}
                {statusConfig[selectedInterview.status as keyof typeof statusConfig]?.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Candidate
                </h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <p><span className="font-medium">Name:</span> {selectedInterview.candidate}</p>
                  <p><span className="font-medium">Email:</span> {selectedInterview.candidateEmail}</p>
                  <p><span className="font-medium">Role:</span> {selectedInterview.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Interviewer
                </h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <p><span className="font-medium">Name:</span> {selectedInterview.interviewer}</p>
                  <p><span className="font-medium">Email:</span> {selectedInterview.interviewerEmail}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Schedule
                </h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <p className="flex items-center gap-2"><span className="font-medium">Date:</span> {selectedInterview.date}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" /><span className="font-medium">Time:</span> {selectedInterview.time}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" /><span className="font-medium">Duration:</span> {selectedInterview.duration} minutes</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  Integrity
                </h4>
                <div className="space-y-2">
                  {selectedInterview.integrityScore !== null ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Progress value={selectedInterview.integrityScore} max={100} className="flex-1 h-3" />
                        <span className="text-lg font-bold text-surface-900 dark:text-surface-50 w-16 text-right">{selectedInterview.integrityScore}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant={selectedInterview.alerts > 0 ? 'danger' : 'success'} className="gap-1">
                          {selectedInterview.alerts > 0 ? (
                            <>
                              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                              {selectedInterview.alerts} Alert{'s' + (selectedInterview.alerts > 1 ? 's' : '')}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3" aria-hidden="true" />
                              Clean
                            </>
                          )}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-surface-500 dark:text-surface-400">Interview not yet completed</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <Button variant="neutral" onClick={() => setSelectedInterview(null)}>Close</Button>
              {selectedInterview.status === 'in_progress' && (
                <Button variant="primary" asChild className="gap-2">
                  <Video className="h-4 w-4" aria-hidden="true" />
                  <Link to={`/interviewer/live/${selectedInterview.id}`}>Join Live</Link>
                </Button>
              )}
              {selectedInterview.recordingUrl && (
                <Button variant="neutral" asChild>
                  <Monitor className="h-4 w-4" aria-hidden="true" />
                  <Link to={selectedInterview.recordingUrl}>View Recording</Link>
                </Button>
              )}
              {selectedInterview.reportUrl && (
                <Button variant="neutral" asChild>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <Link to={selectedInterview.reportUrl}>Download Report</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule New Interview"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Candidate Name" placeholder="Search or enter name" required />
            <Input label="Candidate Email" type="email" placeholder="candidate@email.com" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Interviewer" placeholder="Select interviewer" required />
            <Input label="Role/Position" placeholder="Senior Frontend Engineer" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" required />
            <Input label="Time" type="time" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" defaultValue="45" required />
            <select className="input w-full" defaultValue="video">
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="in-person">In Person</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="label">Monitoring Settings</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox" defaultChecked />
                <span className="text-sm">Face Detection</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox" defaultChecked />
                <span className="text-sm">Multiple Face Alert</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox" defaultChecked />
                <span className="text-sm">Gaze Tracking</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox" defaultChecked />
                <span className="text-sm">Head Pose Analysis</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="text-sm">Screen Share Monitoring</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="text-sm">Audio Analysis</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" type="button" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button type="submit">Schedule Interview</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
