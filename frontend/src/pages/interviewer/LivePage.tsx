import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Fullscreen,
  Minimize,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Shield,
  Brain,
  Users,
  Zap,
  Settings,
  Circle,
  StopCircle,
  PauseCircle,
  MessageSquare,
  Send,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Wifi,
  WifiOff,
  Cpu,
  HardDrive,
  Clock,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'

interface Alert {
  id: string
  time: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  acknowledged: boolean
}

const mockAlerts: Alert[] = [
  { id: 'ALT-001', time: '10:15:23', type: 'Multiple Faces', severity: 'high', message: 'Second face detected in frame for 12 seconds', acknowledged: false },
  { id: 'ALT-002', time: '10:18:45', type: 'Gaze Deviation', severity: 'medium', message: 'Candidate looked away from screen for 45 seconds', acknowledged: true },
  { id: 'ALT-003', time: '10:22:10', type: 'Audio Anomaly', severity: 'low', message: 'Background noise level exceeded threshold', acknowledged: false },
  { id: 'ALT-004', time: '10:25:33', type: 'Face Occlusion', severity: 'medium', message: 'Face partially covered by hand for 8 seconds', acknowledged: false },
]

const mockIntegrityMetrics = [
  { label: 'Face Presence', score: 98, trend: 'stable' },
  { label: 'Gaze Consistency', score: 87, trend: 'down' },
  { label: 'Audio Quality', score: 92, trend: 'stable' },
  { label: 'Environment', score: 95, trend: 'up' },
  { label: 'Attention', score: 89, trend: 'down' },
  { label: 'Engagement', score: 91, trend: 'stable' },
]

export function InterviewerLivePage() {
  const { success, warning, danger } = useToast()
  const [isConnected, setIsConnected] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showAlerts, setShowAlerts] = useState(true)
  const [showMetrics, setShowMetrics] = useState(true)
  const [activeTab, setActiveTab] = useState<'monitoring' | 'alerts' | 'metrics' | 'notes'>('monitoring')
  const [sessionTime, setSessionTime] = useState(0)
  const [integrityScore, setIntegrityScore] = useState(87)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrityScore(prev => Math.max(70, Math.min(100, prev + (Math.random() - 0.48) * 3)))
      const qualities: Array<'excellent' | 'good' | 'fair' | 'poor'> = ['excellent', 'good', 'fair', 'poor']
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)] as typeof connectionQuality)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300 border-danger-200 dark:border-danger-900/30'
      case 'high': return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 border-warning-200 dark:border-warning-900/30'
      case 'medium': return 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border-brand-200 dark:border-brand-900/30'
      case 'low': return 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border-surface-200 dark:border-surface-700'
    }
  }

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-danger-600" aria-hidden="true" />
      case 'high': return <AlertCircle className="h-4 w-4 text-warning-600" aria-hidden="true" />
      case 'medium': return <AlertCircle className="h-4 w-4 text-brand-600" aria-hidden="true" />
      case 'low': return <CheckCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" />
    }
  }

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setIsPaused(false)
      success('Recording Started', 'Session recording has begun')
    } else if (isPaused) {
      setIsPaused(false)
      success('Recording Resumed', 'Session recording continues')
    } else {
      setIsPaused(true)
      warning('Recording Paused', 'Session recording is paused')
    }
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    success('Recording Stopped', 'Recording saved and available in reports')
  }

  const handleAcknowledgeAlert = (id: string) => {
    // In real app, would update alert
    success('Alert Acknowledged', 'Alert marked as reviewed')
  }

  return (
    <div className="h-screen flex flex-col bg-surface-950">
      <header className="border-b border-surface-800 bg-surface-900/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => {}} className="p-2">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white">Live Interview: Morgan Lee</h1>
            <p className="text-xs text-surface-400">Security Engineer • Technical Screen • 60 min</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', isConnected ? 'bg-emerald-900/30 text-emerald-400' : 'bg-danger-900/30 text-danger-400')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-danger-500')} aria-hidden="true" />
            {isConnected ? 'Live' : 'Disconnected'}
          </div>

          <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', connectionQuality === 'excellent' ? 'bg-emerald-900/30 text-emerald-400' : connectionQuality === 'good' ? 'bg-brand-900/30 text-brand-400' : connectionQuality === 'fair' ? 'bg-warning-900/30 text-warning-400' : 'bg-danger-900/30 text-danger-400')}>
            <Wifi className="h-3 w-3" aria-hidden="true" />
            {connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-surface-800 rounded-full">
            <Shield className="h-4 w-4 text-warning-400" aria-hidden="true" />
            <span className="text-sm font-mono text-white">{integrityScore}%</span>
            <span className="text-xs text-surface-400">Integrity</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-surface-800 rounded-full">
            <Clock className="h-4 w-4 text-white" aria-hidden="true" />
            <span className="text-sm font-mono text-white tabular-nums">{formatTime(sessionTime)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowMetrics(!showMetrics)} aria-pressed={showMetrics}>
            <Brain className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowAlerts(!showAlerts)} aria-pressed={showAlerts}>
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowChat(!showChat)} aria-pressed={showChat}>
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          <div className="flex-1 flex gap-4 min-h-0">
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <div className="relative flex-1 bg-surface-900 rounded-2xl overflow-hidden border border-surface-800">
                <div className="absolute inset-0 flex items-center justify-center bg-surface-900">
                  <div className="text-center p-8">
                    <Video className="h-16 w-16 mx-auto text-surface-600 mb-4" aria-hidden="true" />
                    <p className="text-surface-400">Candidate Video Stream</p>
                    <p className="text-xs text-surface-500 mt-1">WebRTC stream would appear here</p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-surface-500">
                      <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> 720p30</span>
                      <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> 2.4 Mbps</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2" aria-label="Video controls">
                  <Button variant="ghost" size="sm" className={cn('p-2', isVideoOff ? 'bg-danger-900/50 text-danger-400' : 'bg-surface-900/80')}>
                    {isVideoOff ? <Video className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 bg-surface-900/80">
                    <Fullscreen className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>

                {isRecording && !isPaused && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-danger-600/90 rounded-full animate-pulse">
                    <Circle className="h-4 w-4 text-white" aria-hidden="true" />
                    <span className="text-xs font-medium text-white">REC</span>
                    <span className="text-xs font-mono text-white">{formatTime(sessionTime)}</span>
                  </div>
                )}

                {isPaused && isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-warning-600/90 rounded-full">
                    <PauseCircle className="h-4 w-4 text-white" aria-hidden="true" />
                    <span className="text-xs font-medium text-white">PAUSED</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex gap-2">
                  <Button
                    variant={isRecording && !isPaused ? 'danger' : 'primary'}
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={isRecording ? handleStopRecording : handleToggleRecording}
                    disabled={isRecording && isPaused}
                  >
                    {isRecording && !isPaused ? (
                      <>
                        <StopCircle className="h-5 w-5" aria-hidden="true" />
                        Stop Recording
                      </>
                    ) : isPaused ? (
                      <>
                        <Circle className="h-5 w-5 animate-pulse" aria-hidden="true" />
                        Resume Recording
                      </>
                    ) : (
                      <>
                        <Circle className="h-5 w-5" aria-hidden="true" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  <Button
                    variant={isPaused && isRecording ? 'primary' : 'outline'}
                    size="lg"
                    className="gap-2"
                    onClick={handleToggleRecording}
                    disabled={!isRecording}
                  >
                    {isPaused ? <Circle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </div>

                <Button variant="neutral" size="lg" className={cn('gap-2', isMuted ? 'bg-danger-900/50 text-danger-400 border-danger-900/50' : '')} onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>

                <Button variant="neutral" size="lg" className={cn('gap-2', isVideoOff ? 'bg-danger-900/50 text-danger-400 border-danger-900/50' : '')} onClick={() => setIsVideoOff(!isVideoOff)}>
                  {isVideoOff ? <Video className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  {isVideoOff ? 'Video On' : 'Video Off'}
                </Button>
              </div>
            </div>

            <aside className={cn('w-80 flex flex-col gap-4 min-h-0', showChat && 'hidden lg:block')}>
              <Card className="border-surface-800 bg-surface-900/50 flex-1 flex flex-col min-h-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Monitoring Panel</CardTitle>
                    <Tabs value={activeTab} onValueChange={setActiveTab as any} className="ml-auto">
                      <TabsList className="grid grid-cols-4 bg-surface-800 p-1 rounded-lg">
                        <TabsTrigger value="monitoring" className="text-xs py-1">Monitor</TabsTrigger>
                        <TabsTrigger value="alerts" className="text-xs py-1">Alerts</TabsTrigger>
                        <TabsTrigger value="metrics" className="text-xs py-1">Metrics</TabsTrigger>
                        <TabsTrigger value="notes" className="text-xs py-1">Notes</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <TabsContent value="monitoring" className="h-full overflow-y-auto p-3">
                    <div className="space-y-4">
                      {[
                        { label: 'Face Detection', status: 'active', icon: Shield, color: 'text-emerald-400', details: 'Face detected • 98% confidence' },
                        { label: 'Gaze Tracking', status: 'active', icon: Brain, color: 'text-brand-400', details: 'Tracking gaze • 87% consistency' },
                        { label: 'Audio Analysis', status: 'active', icon: Zap, color: 'text-warning-400', details: 'Audio clear • 92% quality' },
                        { label: 'Multi-Face Check', status: 'clear', icon: Users, color: 'text-emerald-400', details: 'Single face confirmed' },
                        { label: 'Environment', status: 'clear', icon: CheckCircle, color: 'text-emerald-400', details: 'Well-lit, quiet environment' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-xl">
                          <div className={cn('p-2 rounded-lg bg-surface-700', item.color.replace('text-', 'bg-').replace('400', '900/30'))}>
                            <item.icon className={cn('h-5 w-5', item.color)} aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            <p className="text-xs text-surface-400 truncate">{item.details}</p>
                          </div>
                          <Badge variant={item.status === 'active' ? 'success' : 'neutral'} size="sm">
                            {item.status === 'active' ? 'Active' : 'Clear'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="alerts" className="h-full overflow-y-auto p-3">
                    <div className="space-y-3">
                      {mockAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className={cn('p-3 rounded-xl border', getSeverityColor(alert.severity), alert.acknowledged ? 'opacity-60' : 'animate-pulse')}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white">{alert.type}</p>
                                <span className="text-xs text-surface-400 font-mono">{alert.time}</span>
                              </div>
                              <p className="text-xs text-surface-300 mt-1">{alert.message}</p>
                            </div>
                            {!alert.acknowledged && (
                              <Button variant="ghost" size="sm" className="p-1 text-xs" onClick={() => handleAcknowledgeAlert(alert.id)}>
                                Acknowledge
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {mockAlerts.length === 0 && (
                        <div className="text-center py-8 text-surface-500">
                          <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-2" aria-hidden="true" />
                          <p>No alerts detected</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="h-full overflow-y-auto p-3">
                    <div className="space-y-4">
                      {mockIntegrityMetrics.map((metric, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white">{metric.label}</p>
                            <span className={cn('text-sm font-mono', metric.score >= 90 ? 'text-emerald-400' : metric.score >= 75 ? 'text-warning-400' : 'text-danger-400')}>
                              {metric.score}%
                            </span>
                          </div>
                          <Progress value={metric.score} className="h-2" />
                          <p className="text-xs text-surface-500 flex items-center gap-1">
                            <span className={cn(metric.trend === 'up' ? 'text-emerald-400' : metric.trend === 'down' ? 'text-danger-400' : 'text-surface-500')}>
                              {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                            </span>
                            {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Stable'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="h-full overflow-y-auto p-3">
                    <div className="space-y-3">
                      <textarea
                        className="w-full h-24 bg-surface-800 border border-surface-700 rounded-lg p-3 text-white text-sm placeholder-surface-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Add private notes about this interview..."
                      />
                      <div className="flex gap-2">
                        <Button variant="neutral" size="sm" className="flex-1 gap-1">
                          <Download className="h-3 w-3" aria-hidden="true" />
                          Export Notes
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1 gap-1">
                          <Save className="h-3 w-3" aria-hidden="true" />
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </aside>
          </div>
        </main>

        <aside className={cn('w-72 flex flex-col gap-4 p-4 border-l border-surface-800 bg-surface-900/50', !showChat ? 'hidden' : 'block')}>
          <Card className="border-surface-800 bg-surface-900/50 flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Interview Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="p-3 space-y-4">
                <div className="flex gap-3">
                  <Avatar name="You" size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Interviewer" />
                  <div className="flex-1">
                    <p className="text-xs text-surface-400">You • 10:10 AM</p>
                    <p className="text-sm text-white">Welcome! Let's begin the technical screen.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar name="Morgan Lee" size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan" />
                  <div className="flex-1">
                    <p className="text-xs text-surface-400">Morgan Lee • 10:10 AM</p>
                    <p className="text-sm text-white">Hello! Ready when you are.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar name="System" size="sm" src="https://api.dicebear.com/7.x/bottts/svg?seed=System" />
                  <div className="flex-1">
                    <p className="text-xs text-warning-400">System • 10:15 AM</p>
                    <p className="text-sm text-warning-300"><AlertCircle className="h-3 w-3 inline mr-1" aria-hidden="true" /> Alert: Multiple faces detected</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-surface-800 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-white text-sm placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Type a message..."
                  />
                  <Button variant="primary" size="sm" className="p-2">
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}