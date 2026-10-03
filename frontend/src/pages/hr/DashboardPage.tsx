import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Award,
  Target,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable, TableColumn } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'

const mockStats = [
  { label: 'Total Candidates', value: '2,847', change: '+12.5%', trend: 'up', icon: Users, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
  { label: 'Active Interviews', value: '23', change: '+3', trend: 'up', icon: Calendar, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  { label: 'Completed This Month', value: '156', change: '+8.2%', trend: 'up', icon: CheckCircle, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/30' },
  { label: 'Integrity Alerts', value: '7', change: '-2', trend: 'down', icon: AlertTriangle, color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30' },
]

const mockRecentInterviews = [
  { id: 'INT-001', candidate: 'Sarah Chen', role: 'Senior Frontend Engineer', interviewer: 'Michael Torres', date: '2024-01-15', time: '10:00 AM', duration: '45 min', status: 'completed', integrityScore: 94, alerts: 0 },
  { id: 'INT-002', candidate: 'Alex Rivera', role: 'Backend Developer', interviewer: 'Priya Patel', date: '2024-01-15', time: '02:00 PM', duration: '60 min', status: 'in_progress', integrityScore: 87, alerts: 2 },
  { id: 'INT-003', candidate: 'Jordan Kim', role: 'DevOps Engineer', interviewer: 'David Park', date: '2024-01-16', time: '09:30 AM', duration: '45 min', status: 'scheduled', integrityScore: null, alerts: 0 },
  { id: 'INT-004', candidate: 'Taylor Morgan', role: 'Full Stack Developer', interviewer: 'Lisa Wang', date: '2024-01-16', time: '11:00 AM', duration: '60 min', status: 'scheduled', integrityScore: null, alerts: 0 },
  { id: 'INT-005', candidate: 'Casey Johnson', role: 'ML Engineer', interviewer: 'Robert Kim', date: '2024-01-17', time: '10:00 AM', duration: '60 min', status: 'scheduled', integrityScore: null, alerts: 0 },
  { id: 'INT-006', candidate: 'Morgan Lee', role: 'Security Engineer', interviewer: 'Amanda Foster', date: '2024-01-17', time: '03:00 PM', duration: '45 min', status: 'cancelled', integrityScore: null, alerts: 0 },
]

const mockTopCandidates = [
  { id: 'CAN-001', name: 'Sarah Chen', email: 'sarah.chen@email.com', role: 'Senior Frontend Engineer', stage: 'Offer Extended', matchScore: 96, source: 'LinkedIn', applied: '2024-01-10' },
  { id: 'CAN-002', name: 'Alex Rivera', email: 'alex.rivera@email.com', role: 'Backend Developer', stage: 'Final Interview', matchScore: 92, source: 'Referral', applied: '2024-01-12' },
  { id: 'CAN-003', name: 'Jordan Kim', email: 'jordan.kim@email.com', role: 'DevOps Engineer', stage: 'Technical Screen', matchScore: 89, source: 'Indeed', applied: '2024-01-14' },
  { id: 'CAN-004', name: 'Taylor Morgan', email: 'taylor.morgan@email.com', role: 'Full Stack Developer', stage: 'Phone Screen', matchScore: 85, source: 'Company Website', applied: '2024-01-15' },
  { id: 'INT-005', name: 'Casey Johnson', email: 'casey.j@email.com', role: 'ML Engineer', stage: 'Applied', matchScore: 82, source: 'AngelList', applied: '2024-01-16' },
]

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300', icon: Calendar },
  in_progress: { label: 'In Progress', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: Clock },
  completed: { label: 'Completed', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300', icon: AlertTriangle },
}

const stageConfig = {
  'Applied': { color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300' },
  'Phone Screen': { color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  'Technical Screen': { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  'Final Interview': { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  'Offer Extended': { color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' },
}

export function HRDashboardPage() {
  const { user } = useAuth()

  const columns: TableColumn<typeof mockRecentInterviews[0]>[] = [
    { key: 'id', header: 'Interview ID', width: 'w-32' },
    { key: 'candidate', header: 'Candidate', render: (row) => (
      <div>
        <p className="font-medium text-surface-900 dark:text-surface-50">{row.candidate}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">{row.role}</p>
      </div>
    )},
    { key: 'interviewer', header: 'Interviewer' },
    { key: 'date', header: 'Date', render: (row) => (
      <div className="space-y-1">
        <p className="font-medium">{row.date}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">{row.time} · {row.duration}</p>
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
        <div className="relative w-20 h-4">
          <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full transition-all"
              style={{ width: `${row.integrityScore}%` }}
            />
          </div>
        </div>
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
          { label: 'View Details', value: 'view', icon: <Eye className="h-4 w-4" /> },
          { label: 'Edit', value: 'edit', icon: <Edit className="h-4 w-4" /> },
          { label: 'Download Report', value: 'download', icon: <Download className="h-4 w-4" /> },
          { divider: true },
          { label: 'Cancel Interview', value: 'cancel', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  const candidateColumns: TableColumn<typeof mockTopCandidates[0]>[] = [
    { key: 'name', header: 'Candidate', render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size="sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}`} />
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-50">{row.name}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'role', header: 'Role' },
    { key: 'stage', header: 'Stage', render: (row) => (
      <Badge variant="neutral" className={stageConfig[row.stage as keyof typeof stageConfig]?.color}>
        {row.stage}
      </Badge>
    )},
    { key: 'matchScore', header: 'Match', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="relative w-24 h-4">
          <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full transition-all"
              style={{ width: `${row.matchScore}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{row.matchScore}%</span>
      </div>
    )},
    { key: 'source', header: 'Source' },
    { key: 'applied', header: 'Applied' },
    { key: 'actions', header: 'Actions', render: (row) => (
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        align="right"
        items={[
          { label: 'View Profile', value: 'view', icon: <Eye className="h-4 w-4" /> },
          { label: 'Schedule Interview', value: 'schedule', icon: <Calendar className="h-4 w-4" /> },
          { label: 'Send Message', value: 'message', icon: <Mail className="h-4 w-4" /> },
          { divider: true },
          { label: 'Reject', value: 'reject', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">HR Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Overview of your hiring pipeline and interview integrity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="neutral" size="sm" className="gap-2">
            <Filter className="h-4 w-4" aria-hidden="true" />
            <span>Filters</span>
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New Interview</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-emerald-500 rotate-180" aria-hidden="true" />
                      )}
                      <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-emerald-600' : 'text-danger-600')}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-surface-500 dark:text-surface-400">vs last month</span>
                    </div>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.color)}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Latest interview sessions and their integrity status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/hr/interviews" className="flex items-center gap-1">
                View all
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={mockRecentInterviews}
              striped
              hoverable
              emptyMessage="No interviews found"
            />
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Candidates</CardTitle>
              <CardDescription>Highest matching candidates in your pipeline</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/hr/candidates" className="flex items-center gap-1">
                View all
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={candidateColumns}
              data={mockTopCandidates}
              striped
              hoverable
              emptyMessage="No candidates found"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/30">
                <Target className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="neutral" className="w-full justify-start gap-3" asChild>
              <Link to="/hr/interviews/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Schedule New Interview</span>
              </Link>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" asChild>
              <Link to="/hr/candidates/new">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Add New Candidate</span>
              </Link>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" asChild>
              <Link to="/hr/reports/new">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Generate Report</span>
              </Link>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" asChild>
              <Link to="/hr/organization/team">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span>Manage Team</span>
              </Link>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" asChild>
              <Link to="/hr/settings/integrations">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Configure Integrations</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Integrity Overview</CardTitle>
              <CardDescription>Interview integrity scores and alert trends</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="neutral">Last 30 days</Badge>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true" />
              <div className="relative z-10 text-center p-8">
                <div className="w-64 mx-auto mb-4">
                  <div className="h-32 bg-gradient-to-t from-brand-500/20 to-transparent rounded-t-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-500 to-brand-600 rounded-t-lg opacity-50" />
                    <div className="absolute bottom-0 left-1/4 w-px h-3/4 bg-brand-500" />
                    <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-brand-500" />
                    <div className="absolute bottom-0 left-3/4 w-px h-3/4 bg-brand-500" />
                    <div className="absolute bottom-0 right-1/4 w-px h-full bg-brand-500" />
                  </div>
                </div>
                <p className="text-surface-500 dark:text-surface-400 text-sm">Integrity score distribution chart</p>
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Average: 91.2% • Median: 93% • Alerts: 2.3/interview</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}