import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Monitor, User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'

export function SignUpPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { danger } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'hr' as 'hr' | 'interviewer' | 'interviewee',
    company: '',
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.role === 'hr' && !formData.company.trim()) {
      newErrors.company = 'Company name is required for HR accounts'
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organizationName: formData.company,
      })
      const redirectPath = formData.role === 'hr' ? '/hr/dashboard' : formData.role === 'interviewer' ? '/interviewer/dashboard' : '/interviewee/dashboard'
      navigate(redirectPath, { replace: true })
    } catch {
      danger('Sign up failed', 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleDemoSignup = async (demoRole: 'hr' | 'interviewer' | 'interviewee') => {
    const demoData = {
      name: demoRole === 'hr' ? 'HR Demo User' : demoRole === 'interviewer' ? 'Interviewer Demo' : 'Candidate Demo',
      email: `${demoRole}@demo.com`,
      password: 'demo123456',
      confirmPassword: 'demo123456',
      role: demoRole,
      company: demoRole === 'hr' ? 'Demo Corp' : '',
      acceptTerms: true,
    }
    setFormData(demoData)
    await handleSubmit(new Event('submit') as unknown as React.FormEvent)
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
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">Create your account</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Start protecting your interview integrity today
        </p>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Sign up</CardTitle>
          <CardDescription>
            Enter your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="name" className="label">Full Name</label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name}
                disabled={isLoading}
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="label">I am a</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="input w-full"
                disabled={isLoading}
              >
                <option value="hr">HR / Recruiter</option>
                <option value="interviewer">Interviewer</option>
                <option value="interviewee">Candidate / Interviewee</option>
              </select>
            </div>

            {formData.role === 'hr' && (
              <div className="space-y-2">
                <label htmlFor="company" className="label">Company Name</label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Acme Corporation"
                  leftIcon={<Building2 className="h-4 w-4" />}
                  error={errors.company}
                  disabled={isLoading}
                  autoComplete="organization"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="label">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
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
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                className="checkbox mt-1"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                I agree to the{' '}
                <Link to="/terms" className="text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                  Privacy Policy
                </Link>
                {errors.acceptTerms && (
                  <p className="text-danger-500 text-xs mt-1">{errors.acceptTerms}</p>
                )}
              </label>
            </div>

            <Button type="submit" className="w-full" loading={isLoading} size="lg">
              Create account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-surface-900 text-surface-500 dark:text-surface-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="neutral" type="button" disabled={isLoading} className="gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </Button>
            <Button variant="neutral" type="button" disabled={isLoading} className="gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="space-y-2 text-center text-sm text-surface-500 dark:text-surface-400">
            <p className="font-medium">Demo accounts:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleDemoSignup('hr')} disabled={isLoading}>
                HR Demo
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDemoSignup('interviewer')} disabled={isLoading}>
                Interviewer Demo
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDemoSignup('interviewee')} disabled={isLoading}>
                Candidate Demo
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}