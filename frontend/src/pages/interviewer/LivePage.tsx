import { Video } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

// Live interview monitoring (UX-INT-002) depends on the interview room,
// WebRTC, monitoring ingestion, events, alerts and evidence — all later
// phases (10+). This screen intentionally shows a truthful placeholder rather
// than fabricated monitoring data.
export function InterviewerLivePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Live Sessions</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Real-time interview monitoring for your assigned sessions
        </p>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="py-16 text-center max-w-lg mx-auto">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Video className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">Available in a later stage</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-2 text-sm">
            The live interview room and monitoring interface will become available as the platform's interview
            room, media and monitoring stages are delivered. Assigned interviews are available under
            <span className="font-medium"> My Interviews</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
