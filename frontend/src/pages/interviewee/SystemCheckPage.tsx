import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Camera,
  Mic,
  Wifi,
  Cpu,
  HardDrive,
  Monitor,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  Shield,
  Eye,
  Brain,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Settings,
  Download,
  AlertTriangle,
  Info,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'

interface CheckResult {
  id: string
  name: string
  description: string
  category: 'video' | 'audio' | 'network' | 'system' | 'monitoring'
  icon: React.ComponentType<{ className?: string }>
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  score?: number
  details?: string
  recommendation?: string
  required: boolean
}

const initialChecks: CheckResult[] = [
  {
    id: 'camera_access',
    name: 'Camera Access',
    description: 'Verify browser can access your camera',
    category: 'video',
    icon: Camera,
    status: 'pending',
    required: true,
  },
  {
    id: 'camera_resolution',
    name: 'Camera Resolution',
    description: 'Check if camera supports minimum 720p',
    category: 'video',
    icon: Video,
    status: 'pending',
    required: true,
  },
  {
    id: 'camera_fps',
    name: 'Frame Rate',
    description: 'Verify stable 30fps capture',
    category: 'video',
    icon: Monitor,
    status: 'pending',
    required: true,
  },
  {
    id: 'microphone_access',
    name: 'Microphone Access',
    description: 'Verify browser can access your microphone',
    category: 'audio',
    icon: Mic,
    status: 'pending',
    required: true,
  },
  {
    id: 'audio_quality',
    name: 'Audio Quality',
    description: 'Check input volume and clarity',
    category: 'audio',
    icon: Volume2,
    status: 'pending',
    required: true,
  },
  {
    id: 'background_noise',
    name: 'Background Noise',
    description: 'Measure ambient noise level',
    category: 'audio',
    icon: VolumeX,
    status: 'pending',
    required: false,
  },
  {
    id: 'network_latency',
    name: 'Network Latency',
    description: 'Test ping to media servers',
    category: 'network',
    icon: Wifi,
    status: 'pending',
    required: true,
  },
  {
    id: 'network_bandwidth',
    name: 'Bandwidth',
    description: 'Verify upload/download speeds',
    category: 'network',
    icon: Zap,
    status: 'pending',
    required: true,
  },
  {
    id: 'network_stability',
    name: 'Connection Stability',
    description: 'Check for packet loss and jitter',
    category: 'network',
    icon: Shield,
    status: 'pending',
    required: true,
  },
  {
    id: 'cpu_performance',
    name: 'CPU Performance',
    description: 'Check processor capability for encoding',
    category: 'system',
    icon: Cpu,
    status: 'pending',
    required: true,
  },
  {
    id: 'memory_available',
    name: 'Available Memory',
    description: 'Verify sufficient RAM for video processing',
    category: 'system',
    icon: HardDrive,
    status: 'pending',
    required: false,
  },
  {
    id: 'browser_compatibility',
    name: 'Browser Compatibility',
    description: 'Check WebRTC and MediaStream support',
    category: 'system',
    icon: Monitor,
    status: 'pending',
    required: true,
  },
  {
    id: 'face_detection',
    name: 'Face Detection',
    description: 'Verify face detection model loads and works',
    category: 'monitoring',
    icon: Eye,
    status: 'pending',
    required: true,
  },
  {
    id: 'gaze_tracking',
    name: 'Gaze Tracking',
    description: 'Test eye tracking calibration',
    category: 'monitoring',
    icon: Brain,
    status: 'pending',
    required: true,
  },
  {
    id: 'multi_face_check',
    name: 'Multi-Face Detection',
    description: 'Verify additional face detection works',
    category: 'monitoring',
    icon: AlertTriangle,
    status: 'pending',
    required: true,
  },
]

const categoryInfo = {
  video: { label: 'Video & Camera', icon: Camera, color: 'text-brand-600', bgColor: 'bg-brand-100 dark:bg-brand-900/30' },
  audio: { label: 'Audio & Microphone', icon: Mic, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  network: { label: 'Network & Connection', icon: Wifi, color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  system: { label: 'System & Browser', icon: Cpu, color: 'text-warning-600', bgColor: 'bg-warning-100 dark:bg-warning-900/30' },
  monitoring: { label: 'Monitoring & AI', icon: Shield, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
}

const statusConfig = {
  pending: { icon: Radio, color: 'text-surface-400', label: 'Pending', variant: 'neutral' as const },
  running: { icon: Loader2, color: 'text-brand-600', label: 'Running...', variant: 'info' as const },
  passed: { icon: CheckCircle, color: 'text-emerald-600', label: 'Passed', variant: 'success' as const },
  failed: { icon: XCircle, color: 'text-danger-600', label: 'Failed', variant: 'danger' as const },
  warning: { icon: AlertCircle, color: 'text-warning-600', label: 'Warning', variant: 'warning' as const },
}

const mockResults = {
  camera_access: { status: 'passed' as const, score: 100, details: 'Camera access granted. Device: "FaceTime HD Camera"', recommendation: '' },
  camera_resolution: { status: 'passed' as const, score: 100, details: 'Resolution: 1920x1080 @ 30fps', recommendation: '' },
  camera_fps: { status: 'passed' as const, score: 95, details: 'Stable 30fps achieved', recommendation: '' },
  microphone_access: { status: 'passed' as const, score: 100, details: 'Microphone access granted. Device: "MacBook Pro Microphone"', recommendation: '' },
  audio_quality: { status: 'passed' as const, score: 92, details: 'Input level: -12dB (optimal)', recommendation: '' },
  background_noise: { status: 'warning' as const, score: 70, details: 'Ambient noise: -35dB (moderate)', recommendation: 'Consider moving to a quieter environment' },
  network_latency: { status: 'passed' as const, score: 95, details: 'Latency: 28ms to nearest media server', recommendation: '' },
  network_bandwidth: { status: 'passed' as const, score: 98, details: 'Upload: 45 Mbps, Download: 120 Mbps', recommendation: '' },
  network_stability: { status: 'passed' as const, score: 96, details: 'Packet loss: 0.1%, Jitter: 3ms', recommendation: '' },
  cpu_performance: { status: 'passed' as const, score: 88, details: 'CPU: Apple M2, 8 cores. Encoding test: 45fps', recommendation: '' },
  memory_available: { status: 'passed' as const, score: 90, details: 'Available: 12.4 GB / 16 GB', recommendation: '' },
  browser_compatibility: { status: 'passed' as const, score: 100, details: 'Chrome 120: Full WebRTC support', recommendation: '' },
  face_detection: { status: 'passed' as const, score: 97, details: 'MediaPipe Face Detection: Ready', recommendation: '' },
  gaze_tracking: { status: 'passed' as const, score: 94, details: 'Gaze estimation model loaded. Calibration recommended', recommendation: 'Run calibration for best accuracy' },
  multi_face_check: { status: 'passed' as const, score: 99, details: 'Multi-face detection: Active', recommendation: '' },
}

export function IntervieweeSystemCheckPage() {
  const [checks, setChecks] = useState<CheckResult[]>(initialChecks)
  const [isRunning, setIsRunning] = useState(false)
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0)
  const [overallScore, setOverallScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'all' | keyof typeof categoryInfo>('all')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)

  const filteredChecks = activeCategory === 'all'
    ? checks
    : checks.filter(c => c.category === activeCategory)

  const categoryOrder = ['video', 'audio', 'network', 'system', 'monitoring'] as const

  const runChecks = async () => {
    setIsRunning(true)
    setShowResults(false)
    setCurrentCheckIndex(0)

    const updatedChecks = checks.map(c => ({ ...c, status: 'pending' as const }))
    setChecks(updatedChecks)

    for (let i = 0; i < checks.length; i++) {
      setCurrentCheckIndex(i)
      const check = checks[i]

      setChecks(prev => prev.map((c, idx) =>
        idx === i ? { ...c, status: 'running' as const } : c
      ))

      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

      const result = mockResults[check.id as keyof typeof mockResults]
      if (result) {
        setChecks(prev => prev.map((c, idx) =>
          idx === i ? { ...c, status: result.status, score: result.score, details: result.details, recommendation: result.recommendation } : c
        ))
      }
    }

    const passedCount = checks.filter(c => mockResults[c.id as keyof typeof mockResults]?.status === 'passed').length
    const requiredChecks = checks.filter(c => c.required)
    const requiredPassed = requiredChecks.filter(c => mockResults[c.id as keyof typeof mockResults]?.status === 'passed').length
    const totalScore = checks.reduce((sum, c) => sum + (mockResults[c.id as keyof typeof mockResults]?.score || 0), 0)

    setOverallScore(Math.round(totalScore / checks.length))
    setIsRunning(false)
    setShowResults(true)
  }

  const runSingleCheck = async (checkId: string) => {
    const index = checks.findIndex(c => c.id === checkId)
    if (index === -1) return

    setChecks(prev => prev.map((c, idx) =>
      idx === index ? { ...c, status: 'running' as const } : c
    ))

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    const result = mockResults[checkId as keyof typeof mockResults]
    if (result) {
      setChecks(prev => prev.map((c, idx) =>
        idx === index ? { ...c, status: result.status, score: result.score, details: result.details, recommendation: result.recommendation } : c
      ))
    }
  }

  const handleCameraToggle = async () => {
    if (isCameraOn) {
      videoRef.current?.srcObject?.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraOn(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setIsCameraOn(true)
      } catch (err) {
        console.error('Camera access denied:', err)
      }
    }
  }

  const handleMicToggle = async () => {
    if (isMicOn) {
      setIsMicOn(false)
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsMicOn(true)
      } catch (err) {
        console.error('Microphone access denied:', err)
      }
    }
  }

  const getCategoryStats = (cat: keyof typeof categoryInfo) => {
    const catChecks = checks.filter(c => c.category === cat)
    const passed = catChecks.filter(c => mockResults[c.id as keyof typeof mockResults]?.status === 'passed').length
    const failed = catChecks.filter(c => mockResults[c.id as keyof typeof mockResults]?.status === 'failed').length
    const warning = catChecks.filter(c => mockResults[c.id as keyof typeof mockResults]?.status === 'warning').length
    return { total: catChecks.length, passed, failed, warning }
  }

  const allRequiredPassed = checks
    .filter(c => c.required)
    .every(c => mockResults[c.id as keyof typeof mockResults]?.status === 'passed')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">System Check</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Verify your system meets all requirements for monitored interviews</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="neutral" className="gap-2" onClick={runChecks} disabled={isRunning}>
            <RotateCcw className={cn('h-4 w-4', isRunning && 'animate-spin')} aria-hidden="true" />
            {isRunning ? 'Running...' : 'Run Full Check'}
          </Button>
        </div>
      </div>

      {showResults && overallScore > 0 && (
        <Card className={cn('border-surface-200 dark:border-surface-800', overallScore >= 90 ? 'border-emerald-300 dark:border-emerald-700' : overallScore >= 70 ? 'border-warning-300 dark:border-warning-700' : 'border-danger-300 dark:border-danger-700')}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className="text-surface-200 dark:text-surface-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className={cn(
                        overallScore >= 90 ? 'text-emerald-500' :
                        overallScore >= 70 ? 'text-warning-500' : 'text-danger-500'
                      )}
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="none"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * overallScore / 100)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-surface-900 dark:text-surface-50">{overallScore}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">
                    {overallScore >= 90 ? 'System Ready' : overallScore >= 70 ? 'System Ready (with warnings)' : 'System Not Ready'}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mt-1">
                    {overallScore >= 90
                      ? 'All checks passed. You\'re ready for your interview!'
                      : overallScore >= 70
                      ? 'Most checks passed. Review warnings before your interview.'
                      : 'Several checks failed. Please resolve issues before your interview.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={allRequiredPassed ? 'success' : 'danger'} className="text-sm px-3 py-1.5">
                  {allRequiredPassed ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {allRequiredPassed ? 'All Required Checks Passed' : 'Required Checks Failed'}
                </Badge>
                <Button variant="neutral" className="gap-2" onClick={() => {}}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-surface-200 dark:border-surface-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-brand-600" aria-hidden="true" />
              Camera Preview
            </CardTitle>
            <CardDescription>Live camera feed for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-surface-900 dark:bg-surface-950 rounded-xl overflow-hidden">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-surface-400">
                  <VideoOff className="h-16 w-16 mb-4 opacity-50" aria-hidden="true" />
                  <p className="text-lg font-medium">Camera Off</p>
                  <p className="text-sm mt-1">Click "Start Camera" to preview</p>
                </div>
              )}
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Button variant="primary" size="lg" className="gap-2" onClick={handleCameraToggle}>
                    <Camera className="h-5 w-5" aria-hidden="true" />
                    Start Camera
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button
                variant={isCameraOn ? 'danger' : 'primary'}
                className="gap-2 flex-1"
                onClick={handleCameraToggle}
              >
                {isCameraOn ? (
                  <>
                    <VideoOff className="h-4 w-4" aria-hidden="true" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" aria-hidden="true" />
                    Start Camera
                  </>
                )}
              </Button>
              <Button
                variant="neutral"
                className="gap-2 flex-1"
                onClick={handleMicToggle}
              >
                {isMicOn ? (
                  <>
                    <VolumeX className="h-4 w-4" aria-hidden="true" />
                    Mute Mic
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" aria-hidden="true" />
                    Test Mic
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-surface-200 dark:border-surface-800">
            <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
              <Info className="h-4 w-4" aria-hidden="true" />
              <span>Camera and microphone are only used for this test. No data is recorded or stored.</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="border-surface-200 dark:border-surface-800 lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>System Checks</CardTitle>
                <CardDescription>Automated verification of your interview readiness</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={activeCategory} onValueChange={setActiveCategory as any} className="hidden sm:flex">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <TabsTrigger key={key} value={key as keyof typeof categoryInfo} className="gap-1">
                        <info.icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {info.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <Select value={activeCategory} onValueChange={setActiveCategory as any} className="sm:hidden w-40">
                  <SelectTrigger>
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Checks</SelectItem>
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <SelectItem key={key} value={key as keyof typeof categoryInfo}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 max-h-[600px] overflow-y-auto">
              {categoryOrder.map(category => {
                const catChecks = filteredChecks.filter(c => c.category === category)
                if (catChecks.length === 0) return null

                const stats = getCategoryStats(category)
                const info = categoryInfo[category]

                return (
                  <div key={category} className="border-b border-surface-200 dark:border-surface-800 last:border-0">
                    <button
                      onClick={() => setActiveCategory(activeCategory === category ? 'all' : category)}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-between"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg', info.bgColor)}>
                            <info.icon className={cn('h-5 w-5', info.color)} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-medium text-surface-900 dark:text-surface-50">{info.label}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">
                              {stats.passed}/{stats.total} passed
                              {stats.warning > 0 && ` • ${stats.warning} warning${stats.warning > 1 ? 's' : ''}`}
                              {stats.failed > 0 && ` • ${stats.failed} failed`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={Math.round((stats.passed / stats.total) * 100)} className="w-32 h-1.5" />
                          <Badge variant={stats.failed > 0 ? 'danger' : stats.warning > 0 ? 'warning' : 'success'} className="gap-1">
                            {stats.failed > 0 ? (
                              <>
                                <XCircle className="h-3 w-3" aria-hidden="true" />
                                {stats.failed} failed
                              </>
                            ) : stats.warning > 0 ? (
                              <>
                                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                                {stats.warning} warning{stats.warning > 1 ? 's' : ''}
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3" aria-hidden="true" />
                                All passed
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </button>
                    {activeCategory === category && (
                      <div className="px-4 pb-4">
                        <div className="space-y-3 pt-2">
                            {catChecks.map((check, index) => {
                              const result = mockResults[check.id as keyof typeof mockResults]
                              const config = statusConfig[check.status]
                              const isCurrentRunning = isRunning && currentCheckIndex === checks.findIndex(c => c.id === check.id)

                              return (
                                <div
                                  key={check.id}
                                  className={cn('flex items-center gap-4 p-3 rounded-lg transition-colors', isCurrentRunning && 'bg-brand-50 dark:bg-brand-900/10')}
                                >
                                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-surface-100 dark:bg-surface-800">
                                    {isCurrentRunning ? (
                                      <Loader2 className="h-5 w-5 text-brand-600 animate-spin" aria-hidden="true" />
                                    ) : (
                                      <config.icon className={cn('h-5 w-5', config.color)} aria-hidden="true" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-surface-900 dark:text-surface-50 truncate">{check.name}</p>
                                      {check.required && (
                                        <Badge variant="neutral" size="sm">Required</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-surface-500 dark:text-surface-400">{check.description}</p>
                                    {result?.details && (
                                      <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 font-mono">{result.details}</p>
                                    )}
                                    {result?.recommendation && (
                                      <p className="text-xs text-warning-600 dark:text-warning-400 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" aria-hidden="true" />
                                        {result.recommendation}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {result?.score !== undefined && (
                                      <span className="font-mono font-medium text-surface-900 dark:text-surface-50 w-16 text-right">
                                        {result.score}%
                                      </span>
                                    )}
                                    <Badge variant={config.variant} className="gap-1">
                                      <config.icon className="h-3 w-3" aria-hidden="true" />
                                      {isCurrentRunning ? 'Running...' : config.label}
                                    </Badge>
                                    {check.status === 'pending' && !isRunning && (
                                      <Button variant="ghost" size="sm" className="p-1.5" onClick={() => runSingleCheck(check.id)}>
                                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle>Interview Requirements Summary</CardTitle>
          <CardDescription>Minimum requirements for a successful monitored interview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Camera', items: ['720p minimum (1080p recommended)', '30fps stable frame rate', 'Auto-focus preferred', 'Good lighting (face visible)'], icon: Camera, color: 'text-brand-600' },
              { title: 'Microphone', items: ['Clear audio input', 'Noise cancellation helpful', 'Position 6-12 inches away', 'Test before interview'], icon: Mic, color: 'text-emerald-600' },
              { title: 'Network', items: ['5+ Mbps upload speed', 'Latency < 100ms', 'Wired connection preferred', 'Stable, no packet loss'], icon: Wifi, color: 'text-violet-600' },
              { title: 'System', items: ['Chrome/Edge/Firefox/Safari latest', '4+ GB available RAM', 'Modern CPU (2018+)', 'WebRTC support enabled'], icon: Cpu, color: 'text-warning-600' },
            ].map((cat, i) => (
              <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('p-2 rounded-lg', `bg-${cat.color.replace('text-', 'bg-').replace('-600', '-100')} dark:bg-${cat.color.replace('text-', 'bg-').replace('-600', '-900/30')}`)}>
                    <cat.icon className={cn('h-5 w-5', cat.color)} aria-hidden="true" />
                  </div>
                  <h4 className="font-medium text-surface-900 dark:text-surface-50">{cat.title}</h4>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader>
          <CardTitle>Monitoring During Interview</CardTitle>
          <CardDescription>What the system monitors during your interview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Eye, title: 'Face Presence', desc: 'Continuous verification that your face is visible and properly positioned in the frame', status: 'standard' },
              { icon: Brain, title: 'Gaze & Attention', desc: 'Eye contact tracking and attention monitoring to ensure engagement with the interview', status: 'standard' },
              { icon: Mic, title: 'Audio Quality', desc: 'Real-time audio level monitoring and background noise detection', status: 'standard' },
              { icon: AlertTriangle, title: 'Multi-Face Detection', desc: 'Alerts if additional faces are detected in the camera view', status: 'enhanced' },
              { icon: Shield, title: 'Environment Stability', desc: 'Monitors for significant lighting changes or camera obstructions', status: 'enhanced' },
              { icon: MessageSquare, title: 'Communication Patterns', desc: 'Analyzes speaking patterns and response timing (metadata only)', status: 'standard' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-brand-100 dark:bg-brand-900/30">
                    <item.icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-surface-900 dark:text-surface-50">{item.title}</h4>
                      <Badge variant={item.status === 'enhanced' ? 'warning' : 'neutral'} size="sm">
                        {item.status === 'enhanced' ? 'Enhanced' : 'Standard'}
                      </Badge>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Privacy Notice</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                  Monitoring data is processed in real-time and only summary events are stored. Raw video/audio is not recorded unless explicitly enabled by the interviewer.
                  You will be notified before any recording begins. See our <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a> for details.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Need to import Radio icon
import { Radio } from 'lucide-react'