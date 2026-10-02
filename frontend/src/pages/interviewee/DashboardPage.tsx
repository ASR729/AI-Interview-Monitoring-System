import { useMemo } from 'react'
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
  Star,
  Award,
  TrendingUp,
  Target,
  BookOpen,
  Headphones,
  Mic,
  Settings,
  AlertTriangle,
  Users,
  XCircle,
  Monitor,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Dropdown } from '@/components/ui/Dropdown'
import { useAuth } from '@/hooks/useAuth'

const mockUpcomingInterviews = [
  { id: 'INT-001', company: 'TechCorp Inc.', role: 'Senior Frontend Engineer', interviewer: 'Alex Rivera', time: 'Today, 2:00 PM', duration: 60, type: 'Final Interview', status: 'scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp', preparation: 85 },
  { id: 'INT-002', company: 'DataFlow Systems', role: 'Backend Developer', interviewer: 'Jordan Kim', time: 'Tomorrow, 10:00 AM', duration: 45, type: 'Technical Screen', status: 'scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataFlow', preparation: 60 },
  { id: 'INT-003', company: 'CloudNine Labs', role: 'DevOps Engineer', interviewer: 'Taylor Morgan', time: 'Mar 15, 11:30 AM', duration: 60, type: 'Technical Screen', status: 'scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CloudNine', preparation: 40 },
  { id: 'INT-004', company: 'SecureNet', role: 'Security Engineer', interviewer: 'Casey Johnson', time: 'Mar 18, 2:00 PM', duration: 60, type: 'System Design', status: 'scheduled', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SecureNet', preparation: 20 },
]

const mockPastInterviews = [
  { id: 'INT-005', company: 'InnovateLab', role: 'Full Stack Developer', interviewer: 'Riley Park', date: 'Mar 8', type: 'Phone Screen', status: 'completed', integrityScore: 94, rating: 4.5, feedback: 'Strong technical skills', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateLab' },
  { id: 'INT-006', company: 'ScaleUp Inc', role: 'Mobile Developer', interviewer: 'Morgan Lee', date: 'Mar 5', type: 'Technical Screen', status: 'completed', integrityScore: 91, rating: 4.0, feedback: 'Good problem solving', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ScaleUp' },
  { id: 'INT-007', company: 'NextGen AI', role: 'ML Engineer', interviewer: 'Avery Brooks', date: 'Mar 1', type: 'Final Interview', status: 'completed', integrityScore: 96, rating: 4.8, feedback: 'Excellent ML knowledge', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NextGen' },
]

const mockStats = {
  upcomingCount: 4,
  completedCount: 12,
  avgIntegrity: 93,
  avgRating: 4.4,
  totalHours: 18.5,
  offersReceived: 2,
}

const preparationSteps = [
  { id: 'system_check', label: 'System Check', icon: Monitor, desc: 'Verify camera, microphone, and connection', completed: true, required: true },
  { id: 'review_role', label: 'Review Role', icon: BookOpen, desc: 'Study job description and requirements', completed: true, required: true },
  { id: 'research_company', label: 'Research Company', icon: Target, desc: 'Learn about company mission and values', completed: false, required: true },
  { id: 'prepare_questions', label: 'Prepare Questions', icon: Headphones, desc: 'Draft questions for the interviewer', completed: false, required: false },
  { id: 'setup_environment', label: 'Setup Environment', icon: Settings, desc: 'Quiet space, good lighting, clean background', completed: false, required: true },
  { id: 'test_monitoring', label: 'Test Monitoring', icon: Shield, desc: 'Verify face detection and gaze tracking', completed: false, required: true },
]

export function IntervieweeDashboardPage() {
  const { user } = useAuth()

  const statsCards = useMemo(() => [
    {
      title: 'Upcoming Interviews',
      value: mockStats.upcomingCount,
      icon: Calendar,
      color: 'text-brand-600',
      bgColor: 'bg-brand-100 dark:bg-brand-900/30',
      trend: `${mockStats.upcomingCount} scheduled`,
      trendUp: true,
    },
    {
      title: 'Completed Interviews',
      value: mockStats.completedCount,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      trend: 'This season',
      trendUp: true,
    },
    {
      title: 'Avg Integrity Score',
      value: `${mockStats.avgIntegrity}%`,
      icon: Shield,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      trend: '+2% vs last season',
      trendUp: true,
    },
    {
      title: 'Avg Interview Rating',
      value: `${mockStats.avgRating}/5.0`,
      icon: Star,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100 dark:bg-warning-900/30',
      trend: 'Consistently high',
      trendUp: true,
    },
    {
      title: 'Total Interview Hours',
      value: `${mockStats.totalHours}h`,
      icon: Clock,
      color: 'text-surface-600',
      bgColor: 'bg-surface-100 dark:bg-surface-800',
      trend: 'Across all interviews',
      trendUp: false,
    },
    {
      title: 'Offers Received',
      value: mockStats.offersReceived,
      icon: Award,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      trend: 'From completed interviews',
      trendUp: true,
    },
  ], [])

  const getStatusConfig = (status: string) => {
    const configs = {
      scheduled: { variant: 'info' as const, label: 'Scheduled', icon: Calendar },
      live: { variant: 'success' as const, label: 'Live', icon: Video },
      completed: { variant: 'success' as const, label: 'Completed', icon: CheckCircle },
      cancelled: { variant: 'neutral' as const, label: 'Cancelled', icon: XCircle },
    }
    return configs[status as keyof typeof configs] || { variant: 'neutral' as const, label: status, icon: AlertCircle }
  }

  const getPreparationColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 50) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getPreparationBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 dark:bg-emerald-900/30'
    if (score >= 50) return 'bg-warning-100 dark:bg-warning-900/30'
    return 'bg-danger-100 dark:bg-danger-900/30'
  }

  const nextInterview = mockUpcomingInterviews[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Candidate Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Welcome back, {user?.name || 'Candidate'}. Track your interviews and preparation progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="neutral" className="gap-2" onClick={() => {}}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Interview Settings
          </Button>
          <Button variant="primary" className="gap-2" onClick={() => {}}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            System Check
          </Button>
        </div>
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
                <CardDescription>Your scheduled interviews</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => {}}>
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
                  <Avatar name={interview.company} size="md" src={interview.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.company}</p>
                      <Badge variant={getStatusConfig(interview.status).variant} className="gap-1">
                        {(() => {
                          const Icon = getStatusConfig(interview.status).icon
                          return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null
                        })()}
                        {getStatusConfig(interview.status).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{interview.role} • {interview.type}</p>
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Interviewer: {interview.interviewer}</p>
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
                  <div className={cn('w-24', getPreparationBg(interview.preparation))} style={{ width: '96px' }}>
                    <Progress value={interview.preparation} className="h-2" showLabel />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={index === 0 ? 'primary' : 'outline'} size="sm" className="gap-1 flex-1" onClick={() => {}}>
                      {index === 0 ? (
                        <>
                          <Video className="h-3 w-3" aria-hidden="true" />
                          Join Now
                        </>
                      ) : (
                        <>
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          Prepare
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle>Next Interview Prep</CardTitle>
            <CardDescription>Complete these steps before your interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preparationSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', step.completed ? 'bg-emerald-100 dark:bg-emerald-900/30' : step.required ? 'bg-warning-100 dark:bg-warning-900/30' : 'bg-surface-100 dark:bg-surface-800')}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <step.icon className={cn('h-5 w-5', step.completed ? 'text-emerald-600' : step.required ? 'text-warning-600' : 'text-surface-500')} aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn('font-medium text-surface-900 dark:text-surface-50', step.completed ? 'line-through text-surface-400' : '')}>{step.label}</p>
                    {step.required && <Badge variant="neutral" size="sm">Required</Badge>}
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{step.desc}</p>
                </div>
                {!step.completed && (
                  <Button variant="neutral" size="sm" className="gap-1" onClick={() => success('Step Started', `Opening ${step.label}...`)}>
                    {step.id === 'system_check' ? <ExternalLink className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    {step.id === 'system_check' ? 'Run' : 'Start'}
                  </Button>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-surface-200 dark:border-surface-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Overall Preparation</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {preparationSteps.filter(s => s.completed).length} of {preparationSteps.filter(s => s.required).length} required steps complete
                  </p>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-bold text-surface-900 dark:text-surface-50">
                    {Math.round((preparationSteps.filter(s => s.completed && s.required).length / preparationSteps.filter(s => s.required).length) * 100)}%
                  </span>
                </div>
              </div>
              <Progress value={Math.round((preparationSteps.filter(s => s.completed && s.required).length / preparationSteps.filter(s => s.required).length) * 100)} className="h-2 mt-2" />
            </div>
          </CardContent>
          <CardFooter className="border-t border-surface-200 dark:border-surface-800">
            <Button variant="primary" className="w-full gap-2" onClick={() => {}}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Run Full System Check
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle>Recent Completed Interviews</CardTitle>
            <CardDescription>Your interview history and performance</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {mockPastInterviews.map((interview, index) => (
                <div
                  key={interview.id}
                  className={cn('flex items-center gap-4 p-4 border-b border-surface-200 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors')}
                >
                  <Avatar name={interview.company} size="md" src={interview.avatar} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{interview.company}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{interview.role} • {interview.type}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono font-medium text-emerald-600">{interview.integrityScore}%</span>
                    {interview.rating && (
                      <span className="flex items-center gap-1 text-warning-600">
                        <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                        {interview.rating}
                      </span>
                    )}
                    <span className="text-surface-500 dark:text-surface-400">{interview.date}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => {}}>
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    Report
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" className="w-full gap-1" onClick={() => {}}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              View All Reports
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle>Interview Readiness</CardTitle>
            <CardDescription>Key metrics for your next interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Technical Knowledge', score: 88, icon: Brain, color: 'text-brand-600' },
                { label: 'Communication', score: 92, icon: Mic, color: 'text-emerald-600' },
                { label: 'Problem Solving', score: 85, icon: Target, color: 'text-violet-600' },
                { label: 'System Design', score: 78, icon: TrendingUp, color: 'text-warning-600' },
                { label: 'Behavioral', score: 90, icon: Users, color: 'text-pink-600' },
              ].map((skill, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <skill.icon className={cn('h-4 w-4', skill.color)} aria-hidden="true" />
                      <span className="font-medium text-surface-900 dark:text-surface-50">{skill.label}</span>
                    </div>
                    <span className={cn('text-sm font-mono font-medium', skill.color)}>{skill.score}%</span>
                  </div>
                  <Progress value={skill.score} className="h-1.5" />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>Interview Guides & Resources</span>
              </Button>
              <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
                <Headphones className="h-4 w-4" aria-hidden="true" />
                <span>Practice Questions</span>
              </Button>
              <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
                <Video className="h-4 w-4" aria-hidden="true" />
                <span>Mock Interview Practice</span>
              </Button>
              <Button variant="neutral" className="w-full justify-start gap-3" onClick={() => {}}>
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Monitoring Guidelines</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle>Monitoring Overview</CardTitle>
          <CardDescription>What to expect during monitored interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Face Detection', icon: Eye, desc: 'Ensures you\'re visible on camera', status: 'standard' },
              { label: 'Gaze Tracking', icon: Brain, desc: 'Monitors eye contact and attention', status: 'standard' },
              { label: 'Audio Analysis', icon: Mic, desc: 'Checks audio quality and background noise', status: 'standard' },
              { label: 'Multi-Face Check', icon: AlertTriangle, desc: 'Detects additional people in frame', status: 'enhanced' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30">
                    <item.icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.label}</p>
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{item.desc}</p>
                <Badge variant={item.status === 'enhanced' ? 'warning' : 'neutral'} size="sm" className="mt-2">
                  {item.status === 'enhanced' ? 'Enhanced' : 'Standard'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Need to import Users icon
import { Users } from 'lucide-react'