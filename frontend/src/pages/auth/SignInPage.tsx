import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { useAuth, getRoleDashboardPath } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { ApiError } from '@/lib/api'

const DEMO_ACCOUNTS = [
  { role: 'hr', label: 'HR Demo', email: 'hr@demo.com', password: 'Demo123456' },
  { role: 'interviewer', label: 'Interviewer Demo', email: 'interviewer@demo.com', password: 'Demo123456' },
  { role: 'interviewee', label: 'Candidate Demo', email: 'candidate@demo.com', password: 'Demo123456' },
]

export function SignInPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { danger } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const authenticate = async (emailValue: string, passwordValue: string) => {
    setIsLoading(true)
    try {
      const user = await login(emailValue, passwordValue)
      navigate(getRoleDashboardPath(String(user.role)), { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 0) {
        danger('Sign in failed', error.message)
      } else {
        danger('Sign in failed', 'Invalid email or password')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    await authenticate(email, password)
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    await authenticate(demoEmail, demoPassword)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6" aria-label="Home">
          <div className="relative h-9 w-9 rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl" />
            <div className="absolute inset-1 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl" />
            <Monitor className="relative h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-heading-md font-bold text-surface-900 dark:text-surface-50">
            InterviewGuard
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">Welcome back</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Sign in to your account to continue
        </p>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="label">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="label">Password</label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading} size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="space-y-2 text-center text-sm text-surface-500 dark:text-surface-400">
            <p className="font-medium">Demo accounts (password: Demo123456):</p>
            <div className="flex flex-wrap justify-center gap-2">
              {DEMO_ACCOUNTS.map((demo) => (
                <Button
                  key={demo.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin(demo.email, demo.password)}
                  disabled={isLoading}
                >
                  {demo.label}
                </Button>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}
