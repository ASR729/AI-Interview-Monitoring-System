import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Mic,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Wifi,
  WifiOff,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

// Pre-interview system check (Phase 9, UX-CAN-002, PRD-FR-003, SRS-FR-006/007).
// All checks run locally in the browser using native capability APIs — no raw
// media is persisted or uploaded, and no monitoring event is generated here.
// Screen sharing is not part of the implemented interview configuration and is
// therefore not a required check (conditional per UX-CAN-002).

type CheckState = 'idle' | 'checking' | 'ready' | 'permission_required' | 'unavailable' | 'failed'

interface CheckResult {
  state: CheckState
  message: string | null
}

const MANDATORY_CHECKS = ['browser', 'camera', 'connection'] as const
const OPTIONAL_CHECKS = ['microphone'] as const

const idleResult = (): CheckResult => ({ state: 'idle', message: null })
const checkingResult = (): CheckResult => ({ state: 'checking', message: null })

async function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}

async function runBrowserCheck(): Promise<CheckResult> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
    return { state: 'unavailable', message: 'This browser does not expose the media capture APIs required for the interview.' }
  }
  if (typeof RTCPeerConnection === 'undefined') {
    return { state: 'unavailable', message: 'This browser does not support the real-time communication capabilities required for the interview.' }
  }
  return { state: 'ready', message: null }
}

async function runCameraCheck(): Promise<CheckResult> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { state: 'unavailable', message: 'Camera access is not available in this browser.' }
  }
  let stream: MediaStream | null = null
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    return { state: 'ready', message: null }
  } catch (error) {
    const name = error instanceof DOMException ? error.name : ''
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return { state: 'permission_required', message: 'Camera access was denied. Allow camera access in your browser, then retry the check.' }
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'NotReadableError') {
      return { state: 'unavailable', message: 'No usable camera was found. Connect a camera and retry the check.' }
    }
    return { state: 'failed', message: 'The camera check failed. Please retry.' }
  } finally {
    await stopStream(stream)
  }
}

async function runMicrophoneCheck(): Promise<CheckResult> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { state: 'unavailable', message: 'Microphone access is not available in this browser.' }
  }
  let stream: MediaStream | null = null
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return { state: 'ready', message: null }
  } catch (error) {
    const name = error instanceof DOMException ? error.name : ''
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return { state: 'permission_required', message: 'Microphone access was denied. Allow microphone access in your browser, then retry the check.' }
    }
    if (name === 'NotFoundError' || name === 'NotReadableError') {
      return { state: 'unavailable', message: 'No usable microphone was found. Connect a microphone and retry the check.' }
    }
    return { state: 'failed', message: 'The microphone check failed. Please retry.' }
  } finally {
    await stopStream(stream)
  }
}

function runConnectionCheck(): CheckResult {
  if (typeof navigator === 'undefined') {
    return { state: 'failed', message: 'Connection status could not be determined. Please retry.' }
  }
  if (navigator.onLine) {
    // The exact connectivity quality metric is TBD (UX-CAN-002) — only a
    // truthful reachability signal is reported, no invented quality score.
    return { state: 'ready', message: null }
  }
  return { state: 'unavailable', message: 'No internet connection was detected. Check your connection and retry.' }
}

export function IntervieweeSystemCheckPage() {
  const [browserCheck, setBrowserCheck] = useState<CheckResult>(idleResult())
  const [cameraCheck, setCameraCheck] = useState<CheckResult>(idleResult())
  const [microphoneCheck, setMicrophoneCheck] = useState<CheckResult>(idleResult())
  const [connectionCheck, setConnectionCheck] = useState<CheckResult>(idleResult())
  const [completed, setCompleted] = useState(false)

  const checkMap: Record<string, [CheckResult, (r: CheckResult) => void]> = {
    browser: [browserCheck, setBrowserCheck],
    camera: [cameraCheck, setCameraCheck],
    microphone: [microphoneCheck, setMicrophoneCheck],
    connection: [connectionCheck, setConnectionCheck],
  }

  const runCheck = useCallback(async (id: string) => {
    const setter = checkMap[id]?.[1]
    if (!setter) return
    setter(checkingResult())
    let result: CheckResult
    if (id === 'browser') result = await runBrowserCheck()
    else if (id === 'camera') result = await runCameraCheck()
    else if (id === 'microphone') result = await runMicrophoneCheck()
    else result = runConnectionCheck()
    setter(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserCheck, cameraCheck, microphoneCheck, connectionCheck])

  const runAllChecks = useCallback(async () => {
    setCompleted(false)
    for (const id of [...MANDATORY_CHECKS, ...OPTIONAL_CHECKS]) {
      await runCheck(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runCheck])

  useEffect(() => {
    runAllChecks()
  }, [runAllChecks])

  const mandatoryPassed = MANDATORY_CHECKS.every((id) => checkMap[id]?.[0].state === 'ready')
  const canContinue = mandatoryPassed && !completed
  const isRunning = [...MANDATORY_CHECKS, ...OPTIONAL_CHECKS].some((id) => checkMap[id]?.[0].state === 'checking')

  const stateDisplay = (id: string) => {
    const result = checkMap[id]?.[0] ?? idleResult()
    const isMandatory = (MANDATORY_CHECKS as readonly string[]).includes(id)
    switch (result.state) {
      case 'checking':
        return {
          icon: <RefreshCw className="h-5 w-5 animate-spin text-surface-400" aria-hidden="true" />,
          label: 'Checking…',
          className: 'text-surface-500 dark:text-surface-400',
        }
      case 'ready':
        return {
          icon: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
          label: 'Ready',
          className: 'text-emerald-700 dark:text-emerald-300',
        }
      case 'permission_required':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" aria-hidden="true" />,
          label: 'Permission required',
          className: 'text-warning-700 dark:text-warning-300',
        }
      case 'unavailable':
        return {
          icon: <XCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />,
          label: 'Unavailable',
          className: 'text-danger-700 dark:text-danger-300',
        }
      case 'failed':
        return {
          icon: <XCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />,
          label: 'Failed',
          className: 'text-danger-700 dark:text-danger-300',
        }
      default:
        return {
          icon: <span className={cn('h-5 w-5 rounded-full border-2 border-surface-300 dark:border-surface-600', !isMandatory && 'border-dashed')} aria-hidden="true" />,
          label: isMandatory ? 'Not checked' : 'Not checked (optional)',
          className: 'text-surface-500 dark:text-surface-400',
        }
    }
  }

  const checkRows: Array<{ id: string; icon: typeof Camera; label: string }> = [
    { id: 'camera', icon: Camera, label: 'Camera' },
    { id: 'microphone', icon: Mic, label: 'Microphone' },
    { id: 'connection', icon: navigator.onLine ? Wifi : WifiOff, label: 'Connection' },
    { id: 'browser', icon: Monitor, label: 'Browser' },
  ]

  if (completed) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-2">
            <Link to="/interviewee/interviews">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to my interviews
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">System Check</h1>
        </div>
        <Card className="border-emerald-300 dark:border-emerald-800">
          <CardContent className="py-14 text-center">
            <ShieldCheck className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50">System check complete</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2 max-w-sm mx-auto">
              Your device and browser are ready for the interview. The interview room will be available in the
              next stage — you will join your session from your interview page when it opens.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="neutral" onClick={() => { setCompleted(false); runAllChecks() }}>
                Run checks again
              </Button>
              <Button asChild>
                <Link to="/interviewee/interviews">Go to My Interviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 mb-2">
          <Link to="/interviewee/interviews">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to my interviews
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Pre-Interview System Check</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Before joining your interview, let's make sure your device and browser are ready. All checks run
          locally in your browser.
        </p>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="divide-y divide-surface-100 dark:divide-surface-800">
          {checkRows.map(({ id, icon: Icon, label }) => {
            const display = stateDisplay(id)
            const result = checkMap[id]?.[0] ?? idleResult()
            const isMandatory = (MANDATORY_CHECKS as readonly string[]).includes(id)
            return (
              <div key={id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 flex-shrink-0">
                      <Icon className="h-5 w-5 text-surface-600 dark:text-surface-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-surface-900 dark:text-surface-50">
                        {label}
                        {!isMandatory && <span className="text-surface-400 font-normal text-sm ml-1.5">(optional)</span>}
                      </p>
                      <p className={cn('text-sm mt-0.5', display.className)} role="status">
                        {display.icon}
                        <span className="align-middle ml-1.5">{display.label}</span>
                      </p>
                    </div>
                  </div>
                  {(result.state === 'permission_required' || result.state === 'unavailable' || result.state === 'failed') && (
                    <Button
                      variant="neutral"
                      size="sm"
                      className="gap-1.5 flex-shrink-0"
                      onClick={() => runCheck(id)}
                      disabled={isRunning}
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      Retry
                    </Button>
                  )}
                </div>
                {result.message && (
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 ml-[52px]">{result.message}</p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {mandatoryPassed
              ? 'All required checks passed. You can continue to the next step.'
              : 'One or more required checks have not passed yet. Follow the guidance above and retry.'}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="neutral" className="gap-1.5" onClick={runAllChecks} disabled={isRunning}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Run all checks
            </Button>
            <Button
              disabled={!canContinue}
              aria-disabled={!canContinue}
              title={canContinue ? undefined : 'All required checks must pass before you can continue'}
              onClick={() => setCompleted(true)}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
