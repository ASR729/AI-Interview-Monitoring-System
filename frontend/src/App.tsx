import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/components/ui/Toast'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { HRLayout } from '@/components/layout/HRLayout'
import { InterviewerLayout } from '@/components/layout/InterviewerLayout'
import { IntervieweeLayout } from '@/components/layout/IntervieweeLayout'

import { HomePage } from '@/pages/public/HomePage'
import { SignInPage } from '@/pages/auth/SignInPage'
import { SignUpPage } from '@/pages/auth/SignUpPage'
import { AccessDeniedPage } from '@/pages/auth/AccessDeniedPage'

import { HRDashboardPage } from '@/pages/hr/DashboardPage'
import { HRCandidatesPage } from '@/pages/hr/CandidatesPage'
import { HRInterviewsPage } from '@/pages/hr/InterviewsPage'
import { HRReportsPage } from '@/pages/hr/ReportsPage'
import { HROrganizationPage } from '@/pages/hr/OrganizationPage'
import { HRSettingsPage } from '@/pages/hr/SettingsPage'

import { InterviewerDashboardPage } from '@/pages/interviewer/DashboardPage'
import { InterviewerInterviewsPage } from '@/pages/interviewer/InterviewsPage'
import { InterviewerLivePage } from '@/pages/interviewer/LivePage'
import { InterviewerReportsPage } from '@/pages/interviewer/ReportsPage'
import { InterviewerSettingsPage } from '@/pages/interviewer/SettingsPage'

import { IntervieweeDashboardPage } from '@/pages/interviewee/DashboardPage'
import { IntervieweeInterviewsPage } from '@/pages/interviewee/InterviewsPage'
import { IntervieweeSystemCheckPage } from '@/pages/interviewee/SystemCheckPage'
import { IntervieweeHistoryPage } from '@/pages/interviewee/HistoryPage'
import { IntervieweeSettingsPage } from '@/pages/interviewee/SettingsPage'

function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast()
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={() => {}} />
    </>
  )
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent" aria-label="Loading" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent" aria-label="Loading" />
      </div>
    )
  }

  return <>{children}</>
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        
          <ToastProvider>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
                <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
              </Route>

              <Route element={<AuthLayout />}>
                <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['hr', 'interviewer', 'interviewee']}><div>Onboarding</div></ProtectedRoute>} />
              </Route>

              <Route element={<HRLayout />}>
                <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['hr']}><HRDashboardPage /></ProtectedRoute>} />
                <Route path="/hr/candidates" element={<ProtectedRoute allowedRoles={['hr']}><HRCandidatesPage /></ProtectedRoute>} />
                <Route path="/hr/interviews" element={<ProtectedRoute allowedRoles={['hr']}><HRInterviewsPage /></ProtectedRoute>} />
                <Route path="/hr/reports" element={<ProtectedRoute allowedRoles={['hr']}><HRReportsPage /></ProtectedRoute>} />
                <Route path="/hr/organization" element={<ProtectedRoute allowedRoles={['hr']}><HROrganizationPage /></ProtectedRoute>} />
                <Route path="/hr/settings" element={<ProtectedRoute allowedRoles={['hr']}><HRSettingsPage /></ProtectedRoute>} />
              </Route>

              <Route element={<InterviewerLayout />}>
                <Route path="/interviewer/dashboard" element={<ProtectedRoute allowedRoles={['interviewer']}><InterviewerDashboardPage /></ProtectedRoute>} />
                <Route path="/interviewer/interviews" element={<ProtectedRoute allowedRoles={['interviewer']}><InterviewerInterviewsPage /></ProtectedRoute>} />
                <Route path="/interviewer/live" element={<ProtectedRoute allowedRoles={['interviewer']}><InterviewerLivePage /></ProtectedRoute>} />
                <Route path="/interviewer/reports" element={<ProtectedRoute allowedRoles={['interviewer']}><InterviewerReportsPage /></ProtectedRoute>} />
                <Route path="/interviewer/settings" element={<ProtectedRoute allowedRoles={['interviewer']}><InterviewerSettingsPage /></ProtectedRoute>} />
              </Route>

              <Route element={<IntervieweeLayout />}>
                <Route path="/interviewee/dashboard" element={<ProtectedRoute allowedRoles={['interviewee']}><IntervieweeDashboardPage /></ProtectedRoute>} />
                <Route path="/interviewee/interviews" element={<ProtectedRoute allowedRoles={['interviewee']}><IntervieweeInterviewsPage /></ProtectedRoute>} />
                <Route path="/interviewee/system-check" element={<ProtectedRoute allowedRoles={['interviewee']}><IntervieweeSystemCheckPage /></ProtectedRoute>} />
                <Route path="/interviewee/history" element={<ProtectedRoute allowedRoles={['interviewee']}><IntervieweeHistoryPage /></ProtectedRoute>} />
                <Route path="/interviewee/settings" element={<ProtectedRoute allowedRoles={['interviewee']}><IntervieweeSettingsPage /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App