import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Shield,
  Brain,
  Zap,
  Eye,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  X,
  Download,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Dropdown } from '@/components/ui/Dropdown'
import { Input } from '@/components/ui/Input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useAuth } from '@/hooks/useAuth'

const mockInterviews = [
  { id: 'INT-001', company: 'TechCorp Inc.', role: 'Senior Frontend Engineer', interviewer: 'Alex Rivera', date: '2024-03-15', time: '2:00 PM', duration: 60, type: 'Final Interview', status: 'completed', integrityScore: 94, rating: 4.5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp', feedback: 'Strong technical skills, excellent communication', recording: true, report: true },
  { id: 'INT-002', company: 'DataFlow Systems', role: 'Backend Developer', interviewer: 'Jordan Kim', date: '2024-03-12', time: '10:00 AM', duration: 45, type: 'Technical Screen', status: 'completed', integrityScore: 91, rating: 4.0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataFlow', feedback: 'Good problem solving', recording: true, report: true },
  { id: 'INT-003', company: 'CloudNine Labs', role: 'DevOps Engineer', interviewer: 'Taylor Morgan', date: '2024-03-10', time: '11:30 AM', duration: 60, type: 'Technical Screen', status: 'completed', integrityScore: 88, rating: 3.5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CloudNine', feedback: 'Needs improvement on system design', recording: true, report: true },
  { id: 'INT-004', company: 'SecureNet', role: 'Security Engineer', interviewer: 'Casey Johnson', date: '2024-03-08', time: '2:00 PM', duration: 60, type: 'System Design', status: 'completed', integrityScore: 96, rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SecureNet', feedback: 'Excellent security knowledge', recording: true, report: true },
  { id: 'INT-005', company: 'InnovateLab', role: 'Full Stack Developer', interviewer: 'Riley Park', date: '2024-03-05', time: '10:00 AM', duration: 45, type: 'Phone Screen', status: 'completed', integrityScore: 92, rating: 4.2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateLab', feedback: 'Good cultural fit', recording: false, report: true },
  { id: 'INT-006', company: 'ScaleUp Inc', role: 'Mobile Developer', interviewer: 'Morgan Lee', date: '2024-03-01', time: '3:00 PM', duration: 60, type: 'Technical Screen', status: 'cancelled', integrityScore: 0, rating: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ScaleUp', feedback: 'Cancelled by company', recording: false, report: false },
  { id: 'INT-007', company: 'NextGen AI', role: 'ML Engineer', interviewer: 'Avery Brooks', date: '2024-02-28', time: '1:00 PM', duration: 60, type: 'Final Interview', status: 'completed', integrityScore: 95, rating: 4.7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NextGen', feedback: 'Exceptional ML expertise', recording: true, report: true },
  { id: 'INT-008', company: 'FinTech Solutions', role: 'Backend Engineer', interviewer: 'Quinn Davis', date: '2024-02-25', time: '11:00 AM', duration: 45, type: 'Technical Screen', status: 'completed', integrityScore: 89, rating: 3.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FinTech', feedback: 'Solid fundamentals', recording: true, report: true },
  { id: 'INT-009', company: 'HealthTech Co', role: 'Frontend Developer', interviewer: 'Sam Wilson', date: '2024-02-20', time: '9:00 AM', duration: 45, type: 'Phone Screen', status: 'completed', integrityScore: 93, rating: 4.3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HealthTech', feedback: 'Strong React skills', recording: false, report: true },
  { id: 'INT-010', company: 'EduPlatform', role: 'Full Stack Engineer', interviewer: 'Chris Taylor', date: '2024-02-18', time: '2:30 PM', duration: 60, type: 'System Design', status: 'completed', integrityScore: 87, rating: 3.7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EduPlatform', feedback: 'Needs more scalability experience', recording: true, report: true },
]

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
]

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'technical_screen', label: 'Technical Screen' },
  { value: 'system_design', label: 'System Design' },
  { value: 'final_interview', label: 'Final Interview' },
  { value: 'behavioral', label: 'Behavioral' },
]

const sortOptions = [
  { value: 'date_desc', label: 'Date (Newest)' },
  { value: 'date_asc', label: 'Date (Oldest)' },
  { value: 'company_asc', label: 'Company (A-Z)' },
  { value: 'company_desc', label: 'Company (Z-A)' },
  { value: 'integrity_desc', label: 'Integrity (High-Low)' },
  { value: 'rating_desc', label: 'Rating (High-Low)' },
]

export function IntervieweeInterviewsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInterview, setSelectedInterview] = useState<typeof mockInterviews[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const itemsPerPage = 10

  const filteredInterviews = useMemo(() => {
    let result = [...mockInterviews]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (i) =>
          i.company.toLowerCase().includes(query) ||
          i.role.toLowerCase().includes(query) ||
          i.interviewer.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((i) => i.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      result = result.filter((i) => i.type.toLowerCase().replace(' ', '_') === typeFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'company_asc':
          return a.company.localeCompare(b.company)
        case 'company_desc':
          return b.company.localeCompare(a.company)
        case 'integrity_desc':
          return b.integrityScore - a.integrityScore
        case 'rating_desc':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, statusFilter, typeFilter, sortBy])

  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage)
  const paginatedInterviews = filteredInterviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusConfig = (status: string) => {
    const configs = {
      scheduled: { variant: 'info' as const, label: 'Scheduled', icon: Calendar },
      live: { variant: 'success' as const, label: 'Live', icon: Video },
      completed: { variant: 'success' as const, label: 'Completed', icon: CheckCircle },
      cancelled: { variant: 'neutral' as const, label: 'Cancelled', icon: X },
      no_show: { variant: 'danger' as const, label: 'No Show', icon: AlertCircle },
    }
    return configs[status as keyof typeof configs] || { variant: 'neutral' as const, label: status, icon: AlertCircle }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      phone_screen: 'Phone Screen',
      technical_screen: 'Technical Screen',
      system_design: 'System Design',
      final_interview: 'Final Interview',
      behavioral: 'Behavioral',
    }
    return labels[type] || type
  }

  const handleViewDetails = (interview: typeof mockInterviews[0]) => {
    setSelectedInterview(interview)
    setActiveTab('overview')
    setIsModalOpen(true)
  }

  const handleDownloadReport = (interview: typeof mockInterviews[0]) => {
    console.log('Downloading report for', interview.id)
  }

  const handleDownloadRecording = (interview: typeof mockInterviews[0]) => {
    console.log('Downloading recording for', interview.id)
  }

  const handleRefresh = () => {
    console.log('Refreshing interviews...')
  }

  const handleExport = () => {
    console.log('Exporting interviews...')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">My Interviews</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">View and manage your interview history</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="neutral" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
          <Button variant="neutral" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
              <Input
                placeholder="Search by company, role, interviewer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter as any}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                  <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-surface-200 dark:border-surface-800">
                  <TableHead className="w-16">Company</TableHead>
                  <TableHead>Role & Type</TableHead>
                  <TableHead className="w-48">Date & Time</TableHead>
                  <TableHead className="w-32">Duration</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="w-40">Integrity</TableHead>
                  <TableHead className="w-32">Rating</TableHead>
                  <TableHead className="w-48">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInterviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-surface-500 dark:text-surface-400">
                      No interviews found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInterviews.map((interview) => (
                    <TableRow key={interview.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={interview.company} size="sm" src={interview.avatar} />
                          <span className="font-medium text-surface-900 dark:text-surface-50">{interview.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-surface-900 dark:text-surface-50">{interview.role}</p>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{getTypeLabel(interview.type)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-surface-600 dark:text-surface-400">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{interview.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-surface-600 dark:text-surface-400">
                        {interview.duration} min
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusConfig(interview.status).variant} className="gap-1">
                          {(() => {
                            const Icon = getStatusConfig(interview.status).icon
                            return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null
                          })()}
                          {getStatusConfig(interview.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {interview.integrityScore > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress value={interview.integrityScore} className="w-24 h-2" showLabel />
                            <span className="text-sm font-mono font-medium text-surface-900 dark:text-surface-50">{interview.integrityScore}%</span>
                          </div>
                        ) : (
                          <span className="text-surface-400 dark:text-surface-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {interview.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <ChevronDown className="h-3 w-3 fill-warning-500 text-warning-500" aria-hidden="true" />
                            <span className="font-mono font-medium text-surface-900 dark:text-surface-50">{interview.rating}/5</span>
                          </div>
                        ) : (
                          <span className="text-surface-400 dark:text-surface-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleViewDetails(interview)}>
                            <Eye className="h-3 w-3" aria-hidden="true" />
                            Details
                          </Button>
                          {interview.report && (
                            <Dropdown
                              trigger={
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Download className="h-3 w-3" aria-hidden="true" />
                                  Report
                                </Button>
                              }
                              items={[
                                { label: 'Download PDF', onClick: () => handleDownloadReport(interview), icon: FileText },
                                { label: 'View Online', onClick: () => handleViewDetails(interview), icon: Eye },
                              ]}
                            />
                          )}
                          {interview.recording && (
                            <Dropdown
                              trigger={
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Video className="h-3 w-3" aria-hidden="true" />
                                  Recording
                                </Button>
                              }
                              items={[
                                { label: 'Download Recording', onClick: () => handleDownloadRecording(interview), icon: Download },
                                { label: 'View Online', onClick: () => handleViewDetails(interview), icon: Eye },
                              ]}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="border-t border-surface-200 dark:border-surface-800 px-4 py-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showPageNumbers
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        title="Interview Details"
        description={`Details for ${selectedInterview?.company}`}
      >
        {selectedInterview && (
          <Tabs value={activeTab} onValueChange={setActiveTab as any}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="integrity">Integrity</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              {selectedInterview.recording && <TabsTrigger value="recording">Recording</TabsTrigger>}
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                    <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-2">Interview Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Company</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.company}</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Role</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.role}</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Interviewer</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.interviewer}</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Type</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{getTypeLabel(selectedInterview.type)}</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Date</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.date}</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Time</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.time}</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Duration</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.duration} minutes</p>
                      </div>
                      <div>
                        <p className="text-surface-500 dark:text-surface-400">Status</p>
                        <p className="font-medium text-surface-900 dark:text-surface-50">
                          <Badge variant={getStatusConfig(selectedInterview.status).variant} className="gap-1">
                            {(() => {
                              const Icon = getStatusConfig(selectedInterview.status).icon;
                              return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null;
                            })()}
                            {getStatusConfig(selectedInterview.status).label}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                    <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-2">Interview Feedback</h4>
                    <p className="text-surface-600 dark:text-surface-400">{selectedInterview.feedback}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700 text-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-4">
                        <div className="w-full h-full rounded-full border-4 border-brand-200 dark:border-brand-800">
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <div className="w-[80%] h-[80%] rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
                          </div>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-brand-600">{selectedInterview.integrityScore}%</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Integrity Score</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                      <p className="text-sm text-surface-500 dark:text-surface-400">Interview Rating</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <ChevronDown
                            key={i}
                            className={cn('h-5 w-5 fill-current', i < Math.floor(selectedInterview.rating) ? 'text-warning-500' : 'text-surface-200 dark:text-surface-700')}
                            aria-hidden="true"
                          />
                        ))}
                        <span className="font-mono font-medium text-surface-900 dark:text-surface-50 ml-2">{selectedInterview.rating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                    <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      {selectedInterview.report && (
                        <Button variant="neutral" className="w-full justify-start gap-2" onClick={() => handleDownloadReport(selectedInterview)}>
                          <FileText className="h-4 w-4" aria-hidden="true" />
                          Download Report
                        </Button>
                      )}
                      {selectedInterview.recording && (
                        <Button variant="neutral" className="w-full justify-start gap-2" onClick={() => handleDownloadRecording(selectedInterview)}>
                          <Video className="h-4 w-4" aria-hidden="true" />
                          Download Recording
                        </Button>
                      )}
                      <Button variant="neutral" className="w-full justify-start gap-2" onClick={() => {}}>
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        View Monitoring Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrity" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Face Detection', score: 96, icon: Eye, desc: 'Consistent face visibility throughout' },
                  { label: 'Gaze Tracking', score: 92, icon: Brain, desc: 'Good eye contact maintained' },
                  { label: 'Audio Quality', score: 94, icon: Mic, desc: 'Clear audio, minimal background noise' },
                  { label: 'Multi-Face Check', score: 98, icon: Users, desc: 'No additional faces detected' },
                  { label: 'Environment', score: 88, icon: Shield, desc: 'Stable environment, good lighting' },
                  { label: 'Technical Setup', score: 91, icon: Cpu, desc: 'Stable connection, proper configuration' },
                ].map((metric, i) => (
                  <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <metric.icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                        <span className="font-medium text-surface-900 dark:text-surface-50">{metric.label}</span>
                      </div>
                      <span className="font-mono font-bold text-brand-600">{metric.score}%</span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-3">Interviewer Feedback</h4>
                <p className="text-surface-600 dark:text-surface-400 whitespace-pre-wrap">{selectedInterview.feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Technical Skills', score: 90 },
                  { label: 'Communication', score: 92 },
                  { label: 'Problem Solving', score: 88 },
                ].map((cat, i) => (
                  <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700 text-center">
                    <p className="text-sm text-surface-500 dark:text-surface-400">{cat.label}</p>
                    <p className="text-3xl font-bold text-brand-600 mt-1">{cat.score}%</p>
                    <Progress value={cat.score} className="h-2 mt-2" />
                  </div>
                ))}
              </div>
            </TabsContent>

            {selectedInterview.recording && (
              <TabsContent value="recording" className="space-y-6">
                <div className="aspect-video bg-surface-900 dark:bg-surface-950 rounded-xl flex items-center justify-center relative">
                  <div className="text-center text-surface-400">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p className="text-lg font-medium">Recording Player</p>
                    <p className="text-sm mt-2">Video playback would be implemented here</p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <Button variant="neutral" size="sm" className="bg-white/10 border-white/20 text-white">
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        Download
                      </Button>
                      <Button variant="primary" size="sm">
                        <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                        Play
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                  <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-3">Recording Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-surface-500 dark:text-surface-400">Duration</p>
                      <p className="font-medium text-surface-900 dark:text-surface-50">{selectedInterview.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-surface-500 dark:text-surface-400">Format</p>
                      <p className="font-medium text-surface-900 dark:text-surface-50">MP4 (H.264)</p>
                    </div>
                    <div>
                      <p className="text-surface-500 dark:text-surface-400">Resolution</p>
                      <p className="font-medium text-surface-900 dark:text-surface-50">1920x1080</p>
                    </div>
                    <div>
                      <p className="text-surface-500 dark:text-surface-400">Size</p>
                      <p className="font-medium text-surface-900 dark:text-surface-50">~{Math.round(selectedInterview.duration * 15)} MB</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            <TabsContent value="report" className="space-y-6">
              <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-3">Full Interview Report</h4>
                <div className="prose prose-surface dark:prose-invert max-w-none">
                  <h5 className="font-medium text-surface-900 dark:text-surface-50 mb-2">Executive Summary</h5>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">
                    {selectedInterview.candidateName || 'Candidate'} completed a {getTypeLabel(selectedInterview.type).toLowerCase()} for the {selectedInterview.role} position at {selectedInterview.company} on {selectedInterview.date}. The interview lasted {selectedInterview.duration} minutes with an overall integrity score of {selectedInterview.integrityScore}% and an interviewer rating of {selectedInterview.rating}/5.0.
                  </p>
                  <h5 className="font-medium text-surface-900 dark:text-surface-50 mb-2">Integrity Assessment</h5>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">
                    The monitoring system detected no integrity concerns during this interview. Face detection, gaze tracking, and audio quality all remained within normal parameters throughout the session. No additional faces were detected in the camera frame.
                  </p>
                  <h5 className="font-medium text-surface-900 dark:text-surface-50 mb-2">Technical Assessment</h5>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">{selectedInterview.feedback}</p>
                  <h5 className="font-medium text-surface-900 dark:text-surface-50 mb-2">Recommendation</h5>
                  <p className="text-surface-600 dark:text-surface-400">
                    Based on the interview performance and integrity assessment, this candidate is recommended to proceed to the next stage of the hiring process.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="neutral" onClick={() => handleDownloadReport(selectedInterview)}>
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download PDF
                </Button>
                <Button variant="primary" onClick={() => {}}>
                  <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Share Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Modal>
    </div>
  )
}

// Need to import missing icons
import { Cpu, Play, Share2, Mic, Users } from 'lucide-react'