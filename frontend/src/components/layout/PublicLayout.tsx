import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Menu, X, Sun, Moon, Monitor, Shield, BarChart2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { useTheme } from '@/hooks/useTheme'
import { useAuth, getRoleDashboardPath } from '@/hooks/useAuth'

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'How it works', href: '/#how-it-works' },
  { name: 'Trust & Safety', href: '/#trust' },
  { name: 'Pricing', href: '/#pricing' },
]

const footerLinks = {
  Product: [
    { name: 'Features', href: '/#features' },
    { name: 'Integrations', href: '/#integrations' },
    { name: 'API Docs', href: '/docs/api' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
  Resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Security', href: '/security' },
    { name: 'Status', href: '/status' },
  ],
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'DPA', href: '/dpa' },
  ],
}

export function PublicLayout() {
  const { theme, toggleTheme } = useTheme()
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

  const handleUserMenuSelect = async (value: string) => {
    setUserMenuOpen(false)
    if (value === 'signout') {
      await logout()
      navigate('/', { replace: true })
      return
    }
    if (user) {
      const dashboardPath = getRoleDashboardPath(String(user.role))
      const settingsPath =
        user.role === 'hr' ? '/hr/settings' : user.role === 'interviewer' ? '/interviewer/settings' : '/interviewee/settings'
      if (value === 'dashboard') navigate(dashboardPath)
      else navigate(settingsPath)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-950">
      <header className="sticky top-0 z-40 w-full border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
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

              <div className="hidden md:flex md:items-center md:gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-body-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isLoading ? (
                <div className="h-10 w-10 animate-pulse bg-surface-200 dark:bg-surface-800 rounded-full" />
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size="sm"
                      status={user.status}
                    />
                    <span className="hidden sm:block text-body-sm font-medium text-surface-700 dark:text-surface-300">
                      {user.name}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-800 overflow-hidden z-50"
                      role="menu"
                    >
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 transition-colors text-left"
                        role="menuitem"
                        onClick={() => handleUserMenuSelect('dashboard')}
                      >
                        <BarChart2 className="h-4 w-4" aria-hidden="true" /> Dashboard
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 transition-colors text-left"
                        role="menuitem"
                        onClick={() => handleUserMenuSelect('settings')}
                      >
                        <Shield className="h-4 w-4" aria-hidden="true" /> Settings
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10 transition-colors text-left"
                        role="menuitem"
                        onClick={() => handleUserMenuSelect('signout')}
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/signin" className="text-body-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors">
                    Sign in
                  </Link>
                  <Button asChild size="sm">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
              )}

              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden py-4 border-t border-surface-200 dark:border-surface-800">
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-body font-medium text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1" id="main-content">
        <Outlet />
      </main>

      <footer className="border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="xl:col-span-1">
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
              <p className="mt-6 max-w-xs text-body text-surface-600 dark:text-surface-400">
                AI-powered interview monitoring that protects integrity while respecting privacy.
                Built for modern hiring teams who value fairness and transparency.
              </p>
              <div className="mt-6 flex gap-4">
                <a href="https://twitter.com" className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                </a>
                <a href="https://github.com" className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors" aria-label="GitHub">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                </a>
                <a href="https://linkedin.com" className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-body-sm font-semibold text-surface-900 dark:text-surface-50">Product</h3>
                  <ul className="mt-4 space-y-3" role="list">
                    {footerLinks.Product.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-body-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-body-sm font-semibold text-surface-900 dark:text-surface-50">Company</h3>
                  <ul className="mt-4 space-y-3" role="list">
                    {footerLinks.Company.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-body-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-body-sm font-semibold text-surface-900 dark:text-surface-50">Resources</h3>
                  <ul className="mt-4 space-y-3" role="list">
                    {footerLinks.Resources.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-body-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-body-sm font-semibold text-surface-900 dark:text-surface-50">Legal</h3>
                  <ul className="mt-4 space-y-3" role="list">
                    {footerLinks.Legal.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-body-sm text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-surface-200 dark:border-surface-800 pt-8">
            <p className="text-body-sm text-surface-500 dark:text-surface-400 text-center">
              &copy; {new Date().getFullYear()} InterviewGuard, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}