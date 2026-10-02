import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Video,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Brain,
  Shield,
  Eye,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Dropdown } from '@/components/ui/Dropdown'
import { useAuth } from '@/hooks/useAuth'

const mockUpcomingInterviews = [
  { id: 'INT-001', candidate: 'Sarah Chen', role: 'Senior Frontend Engineer', time: 'Today, 10:00 AM', duration: 60, type: 'Technical Screen', status: 'scheduled', integrityScore: null, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'INT-002', candidate: 'Alex Rivera', role: 'Backend Developer', time: 'Today, 2:00 PM', duration: 45, type: 'Final Interview', status: 'scheduled', integrityScore: null, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'INT-003', candidate: 'Jordan Kim', role: 'DevOps Engineer', time: 'Tomorrow, 9:00 AM', duration: 60, type: 'Technical Screen', status: 'scheduled', integrityScore: null, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: 'INT-004', candidate: 'Taylor Morgan', role: 'Full Stack Developer', time: 'Tomorrow, 11:30 AM', duration: 45, type: 'Phone Screen', status: 'scheduled', integrityScore: null, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
  { id: 'INT-005', candidate: 'Casey Johnson', role: 'ML Engineer', time: 'Mar 15, 10:00 AM', duration: 60, type: 'Technical Screen', status: 'scheduled', integrityScore: null, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
]

const mockLiveInterviews = [
  { id: 'INT-006', candidate: 'Morgan Lee', role: 'Security Engineer', started: '5 min ago', duration: 60, type: 'Technical Screen', status: 'live', alerts: 2, integrityScore: 87, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan' },
  { id: 'INT-007', candidate: 'Riley Park', role: 'Data Engineer', started: '12 min ago', duration: 45, type: 'Final Interview', status: 'live', alerts: 0, integrityScore: 95, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley' },
]

const mockRecentInterviews = [
  { id: 'INT-008', candidate: 'Avery Brooks', role: 'QA Engineer', date: 'Mar 10', type: 'Phone Screen', status: 'completed', integrityScore: 92, alerts: 0, rating: 4.5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery' },
  { id: 'INT-009', candidate: 'Quinn Adams', role: 'Mobile Developer', date: 'Mar 9', type: 'Final Interview', status: 'completed', integrityScore: 89, alerts: 1, rating: 4.0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn' },
  { id: 'INT-010', candidate: 'Dakota Cruz', role: 'Site Reliability Engineer', date: 'Mar 8', type: 'Technical Screen', status: 'completed', integrityScore: 94, alerts: 0, rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota' },
]

const mockStats = {
  upcomingToday: 2,
  liveNow: 2,
  completedThisWeek: 8,
  avgIntegrity: 91,
  totalHours: 24.5,
  alertsTriggered: 3,
}

export function InterviewerDashboardPage() {
  const { user } = useAuth()

  const statsCards = useMemo(() => [
    {
      title: 'Upcoming Today',
      value: mockStats.upcomingToday,
      icon: Calendar,
      color: 'text-brand-600',
      bgColor: 'bg-brand-100 dark:bg-brand-900/30',
      trend: '+2 from yesterday',
      trendUp: true,
    },
    {
      title: 'Live Now',
      value: mockStats.liveNow,
      icon: Video,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      trend: '2 active sessions',
      trendUp: true,
    },
    {
      title: 'Completed This Week',
      value: mockStats.completedThisWeek,
      icon: CheckCircle,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      trend: '+3 vs last week',
      trendUp: true,
    },
    {
      title: 'Avg Integrity Score',
      value: `${mockStats.avgIntegrity}%`,
      icon: Shield,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100 dark:bg-warning-900/30',
      trend: '+2% improvement',
      trendUp: true,
    },
    {
      title: 'Total Hours',
      value: `${mockStats.totalHours}h`,
      icon: Clock,
      color: 'text-surface-600',
      bgColor: 'bg-surface-100 dark:bg-surface-800',
      trend: 'This month',
      trendUp: false,
    },
    {
      title: 'Alerts Triggered',
      value: mockStats.alertsTriggered,
      icon: AlertTriangle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100 dark:bg-danger-900/30',
      trend: 'Requires review',
      trendUp: false,
    },
  ], [])

  const getStatusBadge = (status: string) => {
    const configs = {
      scheduled: { variant: 'info' as const, label: 'Scheduled' },
      live: { variant: 'success' as const, label: 'Live' },
      completed: { variant: 'success' as const, label: 'Completed' },
      cancelled: { variant: 'neutral' as const, label: 'Cancelled' },
    }
    const config = configs[status as keyof typeof configs] || { variant: 'neutral' as const, label: status }
    return <Badge variant={config.variant} className="gap-1"><span className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-emerald-500 animate-pulse' : ''}`} aria-hidden="true" />{config.label}</Badge>
  }

  const getIntegrityColor = (score: number | null) => {
    if (score === null) return 'text-surface-400'
    if (score >= 90) return 'text-emerald-600'
    if (score >= 75) return 'text-warning-600'
    return 'text-danger-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Interviewer Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Welcome back, {user?.name || 'Interviewer'}. Here's your interview overview.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Join Live Session
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, i) => (
          <Card key={i} className="border-surface-200 dark:border-surface-800">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-50 mt-1">{stat.value}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{stat.trend}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-surface-200 dark:border-surface-800 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Your scheduled interviews for the next 7 days</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {mockUpcomingInterviews.map((interview, index) => (
                <div
                  key={interview.id}
                  className={cn('flex items-center gap-4 p-4 border-b border-surface-200 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors', index === 0 && 'bg-brand-50 dark:bg-brand-900/10')}
                >
                  <Avatar name={interview.candidate} size="md" src={interview.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.candidate}</p>
                      {getStatusBadge(interview.status)}
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{interview.role} • {interview.type}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>{interview.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <span>{interview.duration}min</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" className="gap-1">
                    <Video className="h-3 w-3" aria-hidden="true" />
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle>Live Sessions</CardTitle>
            <CardDescription>Currently active interviews</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {mockLiveInterviews.length === 0 ? (
              <div className="p-6 text-center">
                <Video className="h-12 w-12 mx-auto text-surface-300 dark:text-surface-600 mb-3" aria-hidden="true" />
                <p className="text-surface-500 dark:text-surface-400">No live sessions at the moment</p>
              </div>
            ) : (
              <div className="space-y-0">
                {mockLiveInterviews.map((interview, index) => (
                  <div
                    key={interview.id}
                    className={cn('flex items-start gap-4 p-4 border-b border-surface-200 dark:border-surface-800 last:border-0', index === 0 && 'bg-emerald-50 dark:bg-emerald-900/10')}
                  >
                    <Avatar name={interview.candidate} size="md" src={interview.avatar} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.candidate}</p>
                        <Badge variant="success" className="gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                          Live
                        </Badge>
                      </div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{interview.role} • {interview.type}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-surface-500 dark:text-surface-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          Started {interview.started}
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" aria-hidden="true" />
                          Integrity: {interview.integrityScore}%
                        </span>
                        {interview.alerts > 0 && (
                          <span className="flex items-center gap-1 text-danger-600">
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {interview.alerts} alerts
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="primary" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      Monitor
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" className="w-full gap-1">
              <Video className="h-4 w-4" aria-hidden="true" />
              View All Live Sessions
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle>Recent Completed</CardTitle>
            <CardDescription>Your recently finished interviews</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {mockRecentInterviews.map((interview, index) => (
                <div
                  key={interview.id}
                  className={cn('flex items-center gap-4 p-4 border-b border-surface-200 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors')}
                >
                  <Avatar name={interview.candidate} size="md" src={interview.avatar} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.candidate}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{interview.role} • {interview.type}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={cn('font-medium', getIntegrityColor(interview.integrityScore))}>
                      {interview.integrityScore}%
                    </span>
                    <Badge variant={interview.alerts > 0 ? 'danger' : 'success'} className="gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${interview.alerts > 0 ? 'bg-danger-500' : 'bg-emerald-500'}`} aria-hidden="true" />
                      {interview.alerts} alerts
                    </Badge>
                    <span className="text-surface-500 dark:text-surface-400">{interview.date}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    Report
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>Start Impromptu Interview</span>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Schedule New Interview</span>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Review Pending Reports</span>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span>Check Integrity Alerts</span>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>View Candidate Pool</span>
            </Button>
            <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
              <Brain className="h-4 w-4" aria-hidden="true" />
              <span>AI Interview Assistant</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle>Integrity Monitoring Overview</CardTitle>
          <CardDescription>Real-time integrity signals across active sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Face Detection', value: 'Active', status: 'good', icon: Eye, desc: 'All sessions tracking' },
              { label: 'Multiple Faces', value: '0 Detected', status: 'good', icon: Users, desc: 'No violations' },
              { label: 'Gaze Tracking', value: '92% Avg', status: 'good', icon: Brain, desc: 'Within normal range' },
              { label: 'Audio Analysis', value: 'Monitoring', status: 'warning', icon: Zap, desc: '1 session flagged' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('p-2 rounded-lg', item.status === 'good' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-warning-100 dark:bg-warning-900/30')}>
                    <item.icon className={cn('h-5 w-5', item.status === 'good' ? 'text-emerald-600' : 'text-warning-600')} aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.label}</p>
                <p className="text-xl font-bold text-surface-900 dark:text-surface-50 mt-1">{item.value}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}