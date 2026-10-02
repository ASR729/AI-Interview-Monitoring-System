import { ReactNode } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Monitor, Sun, Moon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'

export function AuthLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-400/20 to-transparent" aria-hidden="true" />
        <div className="relative z-10 max-w-md w-full text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8" aria-label="Home">
            <div className="relative h-10 w-10 rounded-xl">
              <div className="absolute inset-0 bg-white/20 rounded-xl" />
              <div className="absolute inset-1 bg-white/10 rounded-xl" />
              <Monitor className="relative h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-heading-lg font-bold text-white">InterviewGuard</span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            AI-Powered Interview Monitoring
          </h1>
          <p className="text-xl text-brand-100 mb-10 max-w-lg mx-auto">
            Protect interview integrity while respecting candidate privacy.
            Real-time monitoring, intelligent alerts, and comprehensive reporting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Real-time AI Monitoring</p>
                <p className="text-brand-200 text-sm">Live face detection & behavior analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Privacy-First Design</p>
                <p className="text-brand-200 text-sm">GDPR compliant, candidate consent required</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart2 className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Detailed Reports</p>
                <p className="text-brand-200 text-sm">Evidence-based integrity indicators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2" aria-label="Home">
              <div className="relative h-9 w-9 rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl" />
                <div className="absolute inset-1 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl" />
                <Monitor className="relative h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-heading-md font-bold text-surface-900 dark:text-surface-50">
                InterviewGuard
              </span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl p-8 border border-surface-200 dark:border-surface-800">
            <Outlet />
          </div>

          <p className="mt-6 text-center text-body-sm text-surface-500 dark:text-surface-400">
            &copy; {new Date().getFullYear()} InterviewGuard, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Sparkles, Shield, BarChart2, Monitor } from 'lucide-react'