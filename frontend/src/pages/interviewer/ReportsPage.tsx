import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Eye,
  Share2,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  Brain,
  Shield,
  Users,
  Zap,
  Calendar,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Save,
  Edit,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { format } from 'date-fns'

interface Report {
  id: string
  candidate: string
  role: string
  type: string
  date: string
  duration: number
  status: 'completed' | 'flagged' | 'pending_review'
  integrityScore: number
  alerts: number
  rating?: number
  avatar: string
  alertsDetail: Array<{
    id: string
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    time: string
    message: string
    acknowledged: boolean
  }>
  integrityBreakdown: Array<{
    label: string
    score: number
    description: string
  }>
  transcript?: string
  notes?: string
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    candidate: 'Avery Brooks',
    role: 'QA Engineer',
    type: 'Phone Screen',
    date: '2024-03-10',
    duration: 30,
    status: 'completed',
    integrityScore: 92,
    alerts: 0,
    rating: 4.5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery',
    alertsDetail: [],
    integrityBreakdown: [
      { label: 'Face Presence', score: 98, description: 'Consistent face detection throughout' },
      { label: 'Gaze Consistency', score: 89, description: 'Occasional glances away from screen' },
      { label: 'Audio Quality', score: 95, description: 'Clear audio, minimal background noise' },
      { label: 'Environment', score: 94, description: 'Well-lit, professional background' },
      { label: 'Attention', score: 91, description: 'Engaged throughout interview' },
      { label: 'Engagement', score: 93, description: 'Active participation and responses' },
    ],
    transcript: 'Interviewer: Tell me about your experience with test automation...\nCandidate: I have 5 years of experience with Cypress and Playwright...\n...',
    notes: 'Strong technical knowledge. Good communication skills. Recommended for next round.',
  },
  {
    id: 'RPT-002',
    candidate: 'Quinn Adams',
    role: 'Mobile Developer',
    type: 'Final Interview',
    date: '2024-03-09',
    duration: 60,
    status: 'flagged',
    integrityScore: 89,
    alerts: 2,
    rating: 4.0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn',
    alertsDetail: [
      { id: 'ALT-001', type: 'Gaze Deviation', severity: 'medium', time: '14:23:12', message: 'Candidate looked away from screen for 45 seconds during coding challenge', acknowledged: true },
      { id: 'ALT-002', type: 'Audio Anomaly', severity: 'low', time: '14:35:44', message: 'Background noise detected - possible TV in background', acknowledged: false },
    ],
    integrityBreakdown: [
      { label: 'Face Presence', score: 96, description: 'Face detected consistently' },
      { label: 'Gaze Consistency', score: 78, description: 'Multiple extended gaze deviations' },
      { label: 'Audio Quality', score: 85, description: 'Some background noise present' },
      { label: 'Environment', score: 88, description: 'Adequate lighting, some distractions' },
      { label: 'Attention', score: 82, description: 'Periods of reduced attention' },
      { label: 'Engagement', score: 90, description: 'Good technical engagement' },
    ],
    transcript: 'Interviewer: Let\'s work on a React Native problem...\nCandidate: Sure, I\'ll share my screen...\n...',
    notes: 'Good technical skills but attention issues noted. Review alerts before final decision.',
  },
  {
    id: 'RPT-003',
    candidate: 'Dakota Cruz',
    role: 'Site Reliability Engineer',
    type: 'Technical Screen',
    date: '2024-03-08',
    duration: 45,
    status: 'completed',
    integrityScore: 94,
    alerts: 0,
    rating: 4.8,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota',
    alertsDetail: [],
    integrityBreakdown: [
      { label: 'Face Presence', score: 99, description: 'Perfect face detection' },
      { label: 'Gaze Consistency', score: 94, description: 'Excellent eye contact maintained' },
      { label: 'Audio Quality', score: 97, description: 'Studio-quality audio' },
      { label: 'Environment', score: 96, description: 'Professional home office setup' },
      { label: 'Attention', score: 95, description: 'Highly focused throughout' },
      { label: 'Engagement', score: 93, description: 'Deep technical engagement' },
    ],
    transcript: 'Interviewer: Explain how you would handle a distributed system outage...\nCandidate: First, I\'d check the monitoring dashboards...\n...',
    notes: 'Exceptional candidate. Strong SRE knowledge. Highly recommended.',
  },
  {
    id: 'RPT-004',
    candidate: 'Riley Park',
    role: 'Data Engineer',
    type: 'Final Interview',
    date: '2024-03-07',
    duration: 60,
    status: 'completed',
    integrityScore: 95,
    alerts: 0,
    rating: 4.7,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley',
    alertsDetail: [],
    integrityBreakdown: [
      { label: 'Face Presence', score: 98, description: 'Consistent face detection' },
      { label: 'Gaze Consistency', score: 92, description: 'Good eye contact' },
      { label: 'Audio Quality', score: 96, description: 'Clear audio throughout' },
      { label: 'Environment', score: 95, description: 'Clean, professional background' },
      { label: 'Attention', score: 94, description: 'Sustained attention' },
      { label: 'Engagement', score: 96, description: 'Highly engaged with data challenges' },
    ],
    transcript: 'Interviewer: Design a data pipeline for real-time analytics...\nCandidate: I\'d use Kafka for ingestion, Flink for processing...\n...',
    notes: 'Excellent data engineering skills. Strong system design thinking.',
  },
  {
    id: 'RPT-005',
    candidate: 'Morgan Lee',
    role: 'Security Engineer',
    type: 'Technical Screen',
    date: '2024-03-06',
    duration: 60,
    status: 'pending_review',
    integrityScore: 87,
    alerts: 3,
    rating: undefined,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    alertsDetail: [
      { id: 'ALT-003', type: 'Multiple Faces', severity: 'high', time: '10:15:23', message: 'Second face detected in frame for 12 seconds', acknowledged: false },
      { id: 'ALT-004', type: 'Face Occlusion', severity: 'medium', time: '10:25:33', message: 'Face partially covered by hand for 8 seconds', acknowledged: false },
      { id: 'ALT-005', type: 'Gaze Deviation', severity: 'medium', time: '10:42:10', message: 'Extended gaze deviation during security scenario', acknowledged: false },
    ],
    integrityBreakdown: [
      { label: 'Face Presence', score: 92, description: 'Face mostly detected, brief occlusion' },
      { label: 'Gaze Consistency', score: 76, description: 'Multiple gaze deviations noted' },
      { label: 'Audio Quality', score: 90, description: 'Good audio quality' },
      { label: 'Environment', score: 88, description: 'Adequate setup' },
      { label: 'Attention', score: 81, description: 'Attention lapses during key moments' },
      { label: 'Engagement', score: 89, description: 'Good technical knowledge shown' },
    ],
    transcript: 'Interviewer: How would you handle a potential data breach?\nCandidate: First, I\'d isolate the affected systems...\n...',
    notes: 'Strong security knowledge but integrity alerts need review before proceeding.',
  },
  {
    id: 'RPT-006',
    candidate: 'Casey Johnson',
    role: 'ML Engineer',
    type: 'Technical Screen',
    date: '2024-03-05',
    duration: 60,
    status: 'completed',
    integrityScore: 91,
    alerts: 1,
    rating: 4.2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    alertsDetail: [
      { id: 'ALT-006', type: 'Audio Anomaly', severity: 'low', time: '11:10:22', message: 'Microphone volume fluctuation detected', acknowledged: true },
    ],
    integrityBreakdown: [
      { label: 'Face Presence', score: 97, description: 'Consistent face detection' },
      { label: 'Gaze Consistency', score: 88, description: 'Good eye contact' },
      { label: 'Audio Quality', score: 84, description: 'Some volume fluctuations' },
      { label: 'Environment', score: 92, description: 'Good lighting and background' },
      { label: 'Attention', score: 90, description: 'Engaged throughout' },
      { label: 'Engagement', score: 93, description: 'Strong ML knowledge demonstrated' },
    ],
    transcript: 'Interviewer: Walk me through your approach to model deployment...\nCandidate: I use CI/CD pipelines with model versioning...\n...',
    notes: 'Solid ML engineering background. Minor audio issue resolved.',
  },
]

const statusConfig = {
  completed: { variant: 'success' as const, label: 'Completed', icon: CheckCircle },
  flagged: { variant: 'danger' as const, label: 'Flagged', icon: AlertCircle },
  pending_review: { variant: 'warning' as const, label: 'Pending Review', icon: XCircle },
}

const severityColors = {
  critical: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300 border-danger-200 dark:border-danger-900/30',
  high: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 border-warning-200 dark:border-warning-900/30',
  medium: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border-brand-200 dark:border-brand-900/30',
  low: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border-surface-200 dark:border-surface-700',
}

const severityIcons = {
  critical: XCircle,
  high: AlertCircle,
  medium: AlertCircle,
  low: CheckCircle,
}

export function InterviewerReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'alerts' | 'candidate'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'alerts' | 'integrity' | 'transcript' | 'notes'>('overview')

  const filteredReports = useMemo(() => {
    return mockReports
      .filter(report => {
        if (searchQuery && !report.candidate.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !report.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !report.id.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
        if (statusFilter !== 'all' && report.status !== statusFilter) return false
        if (dateFilter !== 'all') {
          const reportDate = new Date(report.date)
          const now = new Date()
          if (dateFilter === 'today' && reportDate.toDateString() !== now.toDateString()) return false
          if (dateFilter === 'week' && reportDate < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) return false
          if (dateFilter === 'month' && reportDate < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return false
        }
        return true
      })
      .sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
            break
          case 'score':
            comparison = a.integrityScore - b.integrityScore
            break
          case 'alerts':
            comparison = a.alerts - b.alerts
            break
          case 'candidate':
            comparison = a.candidate.localeCompare(b.candidate)
            break
        }
        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [searchQuery, statusFilter, dateFilter, sortBy, sortOrder])

  const getIntegrityColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600'
    if (score >= 75) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getIntegrityBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 dark:bg-emerald-900/30'
    if (score >= 75) return 'bg-warning-100 dark:bg-warning-900/30'
    return 'bg-danger-100 dark:bg-danger-900/30'
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return <ChevronDown className="h-4 w-4 text-surface-400" />
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 text-brand-600" /> : <ChevronDown className="h-4 w-4 text-brand-600" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Interview Reports</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Review and analyze interview integrity reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="neutral" className="gap-2">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export All
          </Button>
          <Button variant="primary" className="gap-2">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Generate Report
          </Button>
        </div>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
              <Input
                placeholder="Search by candidate, role, or report ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter as any}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter as any}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="neutral" size="sm" className="gap-1" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                <Filter className="h-4 w-4" aria-hidden="true" />
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-surface-700 dark:hover:text-surface-300" onClick={() => handleSort('candidate')}>
                      Candidate <SortIcon field="candidate" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">
                    <button className="flex items-center gap-1 hover:text-surface-700 dark:hover:text-surface-300" onClick={() => handleSort('date')}>
                      Date & Type <SortIcon field="date" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-surface-700 dark:hover:text-surface-300" onClick={() => handleSort('score')}>
                      Integrity <SortIcon field="score" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">
                    <button className="flex items-center gap-1 hover:text-surface-700 dark:hover:text-surface-300" onClick={() => handleSort('alerts')}>
                      Alerts <SortIcon field="alerts" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                {filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={cn('hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer', index === 0 && 'bg-brand-50 dark:bg-brand-900/10')}
                    onClick={() => { setSelectedReport(report); setActiveDetailTab('overview') }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={report.candidate} size="md" src={report.avatar} />
                        <div>
                          <p className="font-medium text-surface-900 dark:text-surface-50">{report.candidate}</p>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{report.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-surface-900 dark:text-surface-50 font-mono">{format(new Date(report.date), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{report.type}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-sm text-surface-500 dark:text-surface-400">
                      {report.duration} min
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-16', getIntegrityBg(report.integrityScore))}>
                          <Progress value={report.integrityScore} className="h-1.5" showLabel />
                        </div>
                        <span className={cn('text-sm font-mono font-medium', getIntegrityColor(report.integrityScore))}>
                          {report.integrityScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <Badge variant={report.alerts > 0 ? 'danger' : 'success'} className="gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${report.alerts > 0 ? 'bg-danger-500' : 'bg-emerald-500'}`} aria-hidden="true" />
                        {report.alerts}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusConfig[report.status].variant} className="gap-1">
                        {(() => {
                          const Icon = statusConfig[report.status].icon
                          return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null
                        })()}
                        {statusConfig[report.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Dropdown
                        trigger={<Button variant="ghost" size="sm" className="p-2 h-8 w-8"><MoreVertical className="h-4 w-4" aria-hidden="true" /></Button>}
                        items={[
                          { label: 'View Report', icon: Eye as any, onClick: () => { setSelectedReport(report); setActiveDetailTab('overview') } },
                          { label: 'View Alerts', icon: AlertCircle as any, onClick: () => { setSelectedReport(report); setActiveDetailTab('alerts') } },
                          { label: 'View Integrity', icon: Brain as any, onClick: () => { setSelectedReport(report); setActiveDetailTab('integrity') } },
                          { label: 'View Transcript', icon: FileText as any, onClick: () => { setSelectedReport(report); setActiveDetailTab('transcript') } },
                          { divider: true },
                          { label: 'Download PDF', icon: Download as any, onClick: () => {} },
                          { label: 'Share Report', icon: Share2 as any, onClick: () => {} },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <FileText className="h-12 w-12 mx-auto text-surface-300 dark:text-surface-600 mb-3" aria-hidden="true" />
                      <p className="text-surface-500 dark:text-surface-400">No reports found</p>
                      <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting your filters or search</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-surface-200 dark:border-surface-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Showing {filteredReports.length} of {mockReports.length} reports
            </p>
            <div className="flex items-center gap-2">
              <Button variant="neutral" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="neutral" size="sm" disabled><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} size="xl" className="max-h-[90vh]">
        {selectedReport && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
              <div className="flex items-center gap-4">
                <Avatar name={selectedReport.candidate} size="lg" src={selectedReport.avatar} />
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">{selectedReport.candidate}</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{selectedReport.role} • {selectedReport.type}</p>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <Badge variant={statusConfig[selectedReport.status].variant} className="gap-1">
                    {(() => {
                      const Icon = statusConfig[selectedReport.status].icon
                      return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null
                    })()}
                    {statusConfig[selectedReport.status].label}
                  </Badge>
                  <div className={cn('px-3 py-1 rounded-full text-sm font-mono font-medium', getIntegrityBg(selectedReport.integrityScore))}>
                    <span className={cn(getIntegrityColor(selectedReport.integrityScore))}>{selectedReport.integrityScore}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="neutral" size="sm" className="gap-1"><Download className="h-4 w-4" /> PDF</Button>
                <Button variant="neutral" size="sm" className="gap-1"><Share2 className="h-4 w-4" /> Share</Button>
              </div>
            </div>

            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab as any} className="flex-1 overflow-hidden">
              <TabsList className="border-b border-surface-200 dark:border-surface-800 px-4 bg-surface-50 dark:bg-surface-800/50">
                <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
                <TabsTrigger value="alerts" className="px-4">Alerts ({selectedReport.alerts})</TabsTrigger>
                <TabsTrigger value="integrity" className="px-4">Integrity Breakdown</TabsTrigger>
                <TabsTrigger value="transcript" className="px-4">Transcript</TabsTrigger>
                <TabsTrigger value="notes" className="px-4">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-surface-200 dark:border-surface-800 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Interview Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Date</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50">{format(new Date(selectedReport.date), 'EEEE, MMMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Duration</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50">{selectedReport.duration} minutes</p>
                        </div>
                        <div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Interview Type</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50">{selectedReport.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Report ID</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50 font-mono">{selectedReport.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Status</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                            <Badge variant={statusConfig[selectedReport.status].variant} className="gap-1">
                              {(() => {
                                const Icon = statusConfig[selectedReport.status].icon
                                return Icon ? <Icon className="h-3 w-3" /> : null
                              })()}
                              {statusConfig[selectedReport.status].label}
                            </Badge>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">Overall Rating</p>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                            {selectedReport.rating ? (
                              <span className="flex items-center gap-1">
                                <span className="text-warning-600">★</span> {selectedReport.rating}/5.0
                              </span>
                            ) : (
                              <span className="text-surface-400">Not rated</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-surface-200 dark:border-surface-800">
                    <CardHeader>
                      <CardTitle>Integrity Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-4">
                        <div className="relative w-32 h-32 mx-auto">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="64" cy="64" r="58"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-surface-200 dark:text-surface-700"
                            />
                            <circle
                              cx="64" cy="64" r="58"
                              stroke={getIntegrityColor(selectedReport.integrityScore).replace('text-', 'text-')}
                              strokeWidth="8"
                              strokeDasharray={364.4}
                              strokeDashoffset={364.4 - (selectedReport.integrityScore / 100) * 364.4}
                              strokeLinecap="round"
                              fill="none"
                              className={cn('transition-all duration-1000', getIntegrityColor(selectedReport.integrityScore))}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-surface-900 dark:text-surface-50">{selectedReport.integrityScore}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
                        {selectedReport.integrityScore >= 90 ? 'Excellent integrity' : selectedReport.integrityScore >= 75 ? 'Some concerns noted' : 'Significant integrity concerns'}
                      </p>
                      <div className="pt-4 border-t border-surface-200 dark:border-surface-800">
                        <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-2">Alerts Summary</p>
                        <div className="flex items-center gap-3">
                          <Badge variant={selectedReport.alerts > 0 ? 'danger' : 'success'} className="gap-1 text-sm">
                            <span className={`w-2 h-2 rounded-full ${selectedReport.alerts > 0 ? 'bg-danger-500' : 'bg-emerald-500'}`} />
                            {selectedReport.alerts} total alerts
                          </Badge>
                          {selectedReport.alerts > 0 && (
                            <span className="text-xs text-surface-500 dark:text-surface-400">Requires review</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-surface-200 dark:border-surface-800">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="neutral" className="gap-2" onClick={() => setActiveDetailTab('alerts')}>
                        <AlertCircle className="h-4 w-4" />
                        Review Alerts ({selectedReport.alerts})
                      </Button>
                      <Button variant="neutral" className="gap-2" onClick={() => setActiveDetailTab('integrity')}>
                        <Shield className="h-4 w-4" />
                        View Integrity Details
                      </Button>
                      <Button variant="neutral" className="gap-2" onClick={() => setActiveDetailTab('transcript')}>
                        <FileText className="h-4 w-4" />
                        Read Transcript
                      </Button>
                      <Button variant="primary" className="gap-2" onClick={() => setActiveDetailTab('notes')}>
                        <Edit className="h-4 w-4" />
                        Add Review Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="flex-1 overflow-y-auto p-6">
                {selectedReport.alertsDetail.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50">No Alerts Detected</h3>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">This interview completed without any integrity alerts.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedReport.alertsDetail.map((alert, index) => (
                      <div
                        key={alert.id}
                        className={cn('p-4 rounded-xl border', severityColors[alert.severity], alert.acknowledged ? 'opacity-60' : '')}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-0.5">
                            {(() => {
                              const Icon = severityIcons[alert.severity];
                              return Icon ? <Icon className={cn('h-5 w-5', alert.severity === 'critical' || alert.severity === 'high' ? 'text-danger-600' : alert.severity === 'medium' ? 'text-warning-600' : 'text-emerald-600')} aria-hidden="true" /> : null;
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-surface-900 dark:text-surface-50">{alert.type}</h4>
                              <span className="text-xs text-surface-400 font-mono">{alert.time}</span>
                            </div>
                            <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">{alert.message}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : alert.severity === 'medium' ? 'info' : 'neutral'} size="sm">
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Severity
                              </Badge>
                              <Badge variant={alert.acknowledged ? 'success' : 'neutral'} size="sm">
                                {alert.acknowledged ? 'Acknowledged' : 'Pending Review'}
                              </Badge>
                              {!alert.acknowledged && (
                                <Button variant="neutral" size="sm" className="gap-1" onClick={() => {}}>
                                  <CheckCircle className="h-3 w-3" />
                                  Acknowledge
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="integrity" className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {selectedReport.integrityBreakdown.map((metric, index) => {
                    const Icons = [Shield, Brain, Zap, Users, Eye, TrendingUp]
                    const Icon = Icons[index % 6]
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn('p-2 rounded-lg', getIntegrityBg(metric.score))}>
                              <Icon className={cn('h-5 w-5', getIntegrityColor(metric.score))} aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-medium text-surface-900 dark:text-surface-50">{metric.label}</p>
                              <p className="text-xs text-surface-500 dark:text-surface-400">{metric.description}</p>
                            </div>
                          </div>
                          <span className={cn('text-sm font-mono font-medium', getIntegrityColor(metric.score))}>{metric.score}%</span>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="transcript" className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-surface-300 dark:text-surface-400 font-mono leading-relaxed">
                    {selectedReport.transcript || 'Transcript not available for this interview.'}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Reviewer Notes</label>
                    <textarea
                      defaultValue={selectedReport.notes || ''}
                      className="w-full h-40 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-3 text-surface-900 dark:text-surface-50 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      placeholder="Add your review notes here..."
                    />
                  </div>
                  {selectedReport.notes && (
                    <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                      <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-2">Previous Notes</p>
                      <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">{selectedReport.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                    <Button variant="neutral" className="flex-1">Cancel</Button>
                    <Button variant="primary" className="flex-1 gap-2">
                      <Save className="h-4 w-4" />
                      Save Notes
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  )
}