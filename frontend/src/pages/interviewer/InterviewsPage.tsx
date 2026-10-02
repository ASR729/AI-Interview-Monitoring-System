import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Video,
  FileText,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Brain,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableColumn } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

const mockInterviews = [
  { id: 'INT-001', candidate: 'Sarah Chen', role: 'Senior Frontend Engineer', interviewer: 'You', date: '2024-03-15', time: '10:00 AM', duration: 60, type: 'Technical Screen', status: 'scheduled', integrityScore: null, alerts: 0, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'INT-002', candidate: 'Alex Rivera', role: 'Backend Developer', interviewer: 'You', date: '2024-03-15', time: '2:00 PM', duration: 45, type: 'Final Interview', status: 'scheduled', integrityScore: null, alerts: 0, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'INT-003', candidate: 'Jordan Kim', role: 'DevOps Engineer', interviewer: 'You', date: '2024-03-16', time: '9:00 AM', duration: 60, type: 'Technical Screen', status: 'scheduled', integrityScore: null, alerts: 0, monitoring: { face: true, gaze: true, audio: false, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: 'INT-004', candidate: 'Taylor Morgan', role: 'Full Stack Developer', interviewer: 'You', date: '2024-03-16', time: '11:30 AM', duration: 45, type: 'Phone Screen', status: 'scheduled', integrityScore: null, alerts: 0, monitoring: { face: true, gaze: false, audio: true, multiFace: false }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
  { id: 'INT-005', candidate: 'Morgan Lee', role: 'Security Engineer', interviewer: 'You', date: '2024-03-14', time: '10:00 AM', duration: 60, type: 'Technical Screen', status: 'live', integrityScore: 87, alerts: 2, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan' },
  { id: 'INT-006', candidate: 'Riley Park', role: 'Data Engineer', interviewer: 'You', date: '2024-03-14', time: '2:00 PM', duration: 45, type: 'Final Interview', status: 'live', integrityScore: 95, alerts: 0, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley' },
  { id: 'INT-007', candidate: 'Avery Brooks', role: 'QA Engineer', interviewer: 'You', date: '2024-03-10', time: '10:00 AM', duration: 30, type: 'Phone Screen', status: 'completed', integrityScore: 92, alerts: 0, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery' },
  { id: 'INT-008', candidate: 'Quinn Adams', role: 'Mobile Developer', interviewer: 'You', date: '2024-03-09', time: '11:00 AM', duration: 45, type: 'Final Interview', status: 'completed', integrityScore: 89, alerts: 1, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn' },
  { id: 'INT-009', candidate: 'Dakota Cruz', role: 'Site Reliability Engineer', interviewer: 'You', date: '2024-03-08', time: '9:00 AM', duration: 60, type: 'Technical Screen', status: 'completed', integrityScore: 94, alerts: 0, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota' },
  { id: 'INT-010', candidate: 'Casey Johnson', role: 'ML Engineer', interviewer: 'You', date: '2024-03-07', time: '2:00 PM', duration: 60, type: 'Technical Screen', status: 'cancelled', integrityScore: null, alerts: 0, monitoring: { face: true, gaze: true, audio: true, multiFace: true }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
]

const statusConfig = {
  scheduled: { variant: 'info' as const, label: 'Scheduled', color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  live: { variant: 'success' as const, label: 'Live', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  completed: { variant: 'success' as const, label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  cancelled: { variant: 'neutral' as const, label: 'Cancelled', color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300' },
}

const typeConfig = {
  'Phone Screen': { color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300' },
  'Technical Screen': { color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  'Final Interview': { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
}

export function InterviewerInterviewsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'candidate' | 'type' | 'integrityScore'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedInterview, setSelectedInterview] = useState<typeof mockInterviews[0] | null>(null)

  const filteredInterviews = useMemo(() => {
    let result = [...mockInterviews]

    if (activeTab !== 'all') {
      if (activeTab === 'upcoming') {
        result = result.filter(i => i.status === 'scheduled')
      } else if (activeTab === 'live') {
        result = result.filter(i => i.status === 'live')
      } else if (activeTab === 'completed') {
        result = result.filter(i => i.status === 'completed')
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.candidate.toLowerCase().includes(query) ||
        i.role.toLowerCase().includes(query) ||
        i.type.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      result = result.filter(i => i.type === typeFilter)
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)

      result = result.filter(i => {
        const interviewDate = new Date(i.date)
        switch (dateFilter) {
          case 'today':
            return interviewDate >= today && interviewDate < tomorrow
          case 'tomorrow':
            return interviewDate >= tomorrow && interviewDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
          case 'week':
            return interviewDate >= weekStart && interviewDate <= weekEnd
          case 'past':
            return interviewDate < today
          default:
            return true
        }
      })
    }

    result.sort((a, b) => {
      let aVal: string | number | Date = a[sortBy]
      let bVal: string | number | Date = b[sortBy]
      if (sortBy === 'date') {
        aVal = new Date(a.date).getTime()
        bVal = new Date(b.date).getTime()
      }
      if (sortBy === 'integrityScore') {
        aVal = a.integrityScore ?? -1
        bVal = b.integrityScore ?? -1
      }
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      return sortOrder === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1
    })

    return result
  }, [activeTab, searchQuery, statusFilter, typeFilter, dateFilter, sortBy, sortOrder])

  const statuses = [...new Set(mockInterviews.map(i => i.status))]
  const types = [...new Set(mockInterviews.map(i => i.type))]

  const columns: TableColumn<typeof mockInterviews[0]>[] = [
    { key: 'candidate', header: 'Candidate', render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.candidate} size="sm" src={row.avatar} />
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-50">{row.candidate}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">{row.role}</p>
        </div>
      </div>
    )},
    { key: 'type', header: 'Type', render: (row) => (
      <Badge variant="neutral" className={typeConfig[row.type as keyof typeof typeConfig]?.color}>
        {row.type}
      </Badge>
    )},
    { key: 'date', header: 'Date & Time', render: (row) => (
      <div>
        <p className="font-medium text-surface-900 dark:text-surface-50">{row.date}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">{row.time} • {row.duration}min</p>
      </div>
    )},
    { key: 'status', header: 'Status', render: (row) => {
      const config = statusConfig[row.status as keyof typeof statusConfig]
      return (
        <Badge variant={config.variant} className={cn('gap-1', config.color)}>
          {row.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />}
          {config.label}
        </Badge>
      )
    }},
    { key: 'integrityScore', header: 'Integrity', render: (row) => {
      if (row.integrityScore === null) {
        return <span className="text-surface-400 dark:text-surface-500">—</span>
      }
      const color = row.integrityScore >= 90 ? 'text-emerald-600' : row.integrityScore >= 75 ? 'text-warning-600' : 'text-danger-600'
      return (
        <div className="flex items-center gap-2">
          <div className="relative w-20 h-4">
            <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full transition-all"
                style={{ width: `${row.integrityScore}%` }}
              />
            </div>
          </div>
          <span className={cn('text-sm font-medium', color)}>{row.integrityScore}%</span>
        </div>
      )
    }},
    { key: 'alerts', header: 'Alerts', render: (row) => (
      <Badge variant={row.alerts > 0 ? 'danger' : 'success'} className="gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${row.alerts > 0 ? 'bg-danger-500' : 'bg-emerald-500'}`} aria-hidden="true" />
        {row.alerts}
      </Badge>
    )},
    { key: 'monitoring', header: 'Monitoring', render: (row) => (
      <div className="flex items-center gap-1">
        {[
          { key: 'face', label: 'Face', icon: <Shield className="h-3 w-3" /> },
          { key: 'gaze', label: 'Gaze', icon: <Brain className="h-3 w-3" /> },
          { key: 'audio', label: 'Audio', icon: <AlertCircle className="h-3 w-3" /> },
          { key: 'multiFace', label: 'Multi', icon: <CheckCircle className="h-3 w-3" /> },
        ].map(m => (
          <span
            key={m.key}
            className={cn('p-1 rounded text-xs', row.monitoring[m.key as keyof typeof row.monitoring] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400')}
            title={m.label}
          >
            {m.icon}
          </span>
        ))}
      </div>
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
          { label: row.status === 'live' ? 'Monitor Live' : row.status === 'scheduled' ? 'Join Interview' : 'View Recording', value: 'join', icon: <Video className="h-4 w-4" />, onSelect: () => setSelectedInterview(row) },
          { label: 'Download Report', value: 'report', icon: <FileText className="h-4 w-4" />, disabled: row.status === 'scheduled' },
          { label: 'Edit', value: 'edit', icon: <Edit className="h-4 w-4" />, disabled: row.status !== 'scheduled' },
          { divider: true },
          { label: row.status === 'scheduled' ? 'Cancel' : 'Delete', value: 'delete', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  const getIntegrityBreakdown = (score: number | null) => {
    if (score === null) return null
    return [
      { label: 'Face Presence', score: Math.min(100, score + 5) },
      { label: 'Gaze Consistency', score: Math.max(60, score - 3) },
      { label: 'Audio Clarity', score: Math.max(70, score - 8) },
      { label: 'Environment', score: Math.min(100, score + 2) },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">My Interviews</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage and monitor your interview sessions</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Schedule Interview
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({mockInterviews.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({mockInterviews.filter(i => i.status === 'scheduled').length})</TabsTrigger>
          <TabsTrigger value="live">Live ({mockInterviews.filter(i => i.status === 'live').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({mockInterviews.filter(i => i.status === 'completed').length})</TabsTrigger>
        </TabsList>
      </Tabs>

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
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <Filter className="h-4 w-4" aria-hidden="true" />
                <span>Sort: {sortBy}</span>
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-36">
                <option value="all">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{statusConfig[s as keyof typeof statusConfig]?.label || s}</option>)}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input w-36">
                <option value="all">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input w-36">
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          <Table
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
        title={selectedInterview ? `Interview: ${selectedInterview.candidate}` : 'Interview Details'}
        size="xl"
      >
        {selectedInterview && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedInterview.candidate} size="xl" src={selectedInterview.avatar} />
              <div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">{selectedInterview.candidate}</h3>
                <p className="text-surface-600 dark:text-surface-400">{selectedInterview.role}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={statusConfig[selectedInterview.status as keyof typeof statusConfig]?.variant || 'neutral'} className={statusConfig[selectedInterview.status as keyof typeof statusConfig]?.color}>
                    {statusConfig[selectedInterview.status as keyof typeof statusConfig]?.label}
                  </Badge>
                  <Badge variant="neutral" className={typeConfig[selectedInterview.type as keyof typeof typeConfig]?.color}>
                    {selectedInterview.type}
                  </Badge>
                  {selectedInterview.integrityScore !== null && (
                    <Badge variant="info" className="gap-1">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      Integrity: {selectedInterview.integrityScore}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Schedule</h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" /><span>Date: {selectedInterview.date}</span></div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" /><span>Time: {selectedInterview.time} ({selectedInterview.duration} min)</span></div>
                  <div className="flex items-center gap-2"><Brain className="h-4 w-4" aria-hidden="true" /><span>Type: {selectedInterview.type}</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Monitoring Settings</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'face', label: 'Face Detection', icon: Shield },
                    { key: 'gaze', label: 'Gaze Tracking', icon: Brain },
                    { key: 'audio', label: 'Audio Analysis', icon: AlertCircle },
                    { key: 'multiFace', label: 'Multi-Face Detection', icon: CheckCircle },
                  ].map(m => (
                    <Badge
                      key={m.key}
                      variant={selectedInterview.monitoring[m.key as keyof typeof selectedInterview.monitoring] ? 'success' : 'neutral'}
                      className="gap-1"
                    >
                      <m.icon className="h-3 w-3" aria-hidden="true" />
                      {m.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {selectedInterview.integrityScore !== null && (
              <div className="space-y-3 border-t border-surface-200 dark:border-surface-800 pt-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Integrity Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  {getIntegrityBreakdown(selectedInterview.integrityScore)?.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">{item.label}</span>
                        <span className="font-medium text-surface-900 dark:text-surface-50">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedInterview.alerts > 0 && (
              <div className="space-y-3 border-t border-danger-200 dark:border-danger-900/30 pt-4">
                <h4 className="font-medium text-danger-600 dark:text-danger-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  Integrity Alerts ({selectedInterview.alerts})
                </h4>
                <div className="space-y-2">
                  {Array.from({ length: selectedInterview.alerts }, (_, i) => (
                    <div key={i} className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-900/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="font-medium text-danger-600 dark:text-danger-400">
                            {i === 0 ? 'Multiple faces detected' : 'Gaze deviation detected'}
                          </p>
                          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                            {i === 0 ? 'A second face was detected in the frame for 12 seconds at 10:15 AM' : 'Candidate looked away from screen for extended period (45s) at 2:23 PM'}
                          </p>
                        </div>
                        <Badge variant="danger" size="sm">High</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <Button variant="outline" onClick={() => setSelectedInterview(null)}>Close</Button>
              {selectedInterview.status === 'scheduled' && (
                <Button variant="primary" className="gap-2" onClick={() => setSelectedInterview(null)}>
                  <Video className="h-4 w-4" aria-hidden="true" />
                  Join Interview
                </Button>
              )}
              {selectedInterview.status === 'live' && (
                <Button variant="primary" className="gap-2" onClick={() => setSelectedInterview(null)}>
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Monitor Live
                </Button>
              )}
              {selectedInterview.status === 'completed' && (
                <Button variant="primary" className="gap-2" onClick={() => setSelectedInterview(null)}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  View Report
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}