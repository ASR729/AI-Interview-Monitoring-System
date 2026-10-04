import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Monitor, User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useAuth, getRoleDashboardPath } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { ApiError } from '@/lib/api'

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
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organizationName: formData.company,
      })
      navigate(getRoleDashboardPath(String(user.role)), { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          danger('Sign up failed', 'An account with this email already exists')
        } else if (error.statusCode === 0) {
          danger('Sign up failed', error.message)
        } else {
          danger('Sign up failed', error.message)
        }
      } else {
        danger('Sign up failed', 'An error occurred. Please try again.')
      }
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

          <div className="mt-6">
            <p className="text-center text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
