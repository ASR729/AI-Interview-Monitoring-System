import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Lock, ArrowLeft, Home, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

export function AccessDeniedPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="relative h-16 w-16 rounded-2xl mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-danger-500 to-danger-700 rounded-2xl" />
            <div className="absolute inset-1 bg-gradient-to-br from-danger-600 to-danger-800 rounded-2xl" />
            <Lock className="relative h-8 w-8 text-white mx-auto mt-4" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">Access Denied</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 mb-6">
            You don't have permission to access this page. This area is restricted to specific roles.
          </p>
        </div>

        <Card className="border-surface-200 dark:border-surface-800">
          <CardHeader>
            <CardTitle className="text-lg">Current Session</CardTitle>
            <CardDescription>
              Information about your current account and role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            {user ? (
              <>
                <div className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                  <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">{user.name}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{user.email}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 mt-1">
                      Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Your current role ({user.role}) doesn't have access to the requested resource. Please contact your administrator if you believe this is an error.
                </p>
              </>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <div className="h-12 w-12 rounded-xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-warning-600 dark:text-warning-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-50">Not Signed In</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">You are not currently signed in. Please sign in with an account that has the required permissions.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user ? (
                <>
                  <Button variant="neutral" asChild className="flex-1">
                    <Link to="/signin">Switch Account</Link>
                  </Button>
                  <Button variant="secondary" onClick={logout} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild className="flex-1">
                  <Link to="/signin">Sign In</Link>
                </Button>
              )}
              <Button variant="ghost" asChild className="flex-1">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-sm text-surface-500 dark:text-surface-400">
          <p>If you need access to this area, please contact your system administrator.</p>
        </div>
      </div>
    </div>
  )
}