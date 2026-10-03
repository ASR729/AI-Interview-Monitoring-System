import { ReactNode, useState } from 'react'
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Building2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/hr/dashboard', icon: LayoutDashboard },
  { name: 'Candidates', href: '/hr/candidates', icon: Users },
  { name: 'Interviews', href: '/hr/interviews', icon: Calendar },
  { name: 'Reports', href: '/hr/reports', icon: FileText },
  { name: 'Organization', href: '/hr/organization', icon: Building2 },
  { name: 'Settings', href: '/hr/settings', icon: Settings },
]

export function HRLayout() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const mockNotifications = [
    { id: '1', title: 'New candidate registered', message: 'Alex Rivera applied for Senior Frontend Engineer', time: '2 min ago', read: false },
    { id: '2', title: 'Interview completed', message: 'Interview with Jane Smith has been completed', time: '15 min ago', read: false },
    { id: '3', title: 'System check passed', message: 'All candidates passed system checks for tomorrow', time: '1 hour ago', read: true },
  ]

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 lg:flex">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-all duration-300 ease-in-out flex flex-col',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          !sidebarOpen && 'lg:w-20'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-surface-200 dark:border-surface-800">
          <Link to="/hr/dashboard" className="flex items-center gap-2" aria-label="Home">
            <div className="relative h-9 w-9 rounded-xl flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl" />
              <div className="absolute inset-1 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl" />
              <Shield className="relative h-5 w-5 text-white" aria-hidden="true" />
            </div>
            {sidebarOpen && (
              <span className="text-heading-md font-bold text-surface-900 dark:text-surface-50">
                InterviewGuard
              </span>
            )}
          </Link>
          <button
            className={cn(
              'lg:hidden p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors',
              !sidebarOpen && 'rotate-180'
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation" aria-label="HR navigation">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-body font-medium transition-all duration-200',
                  'group relative overflow-hidden',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-50 dark:hover:bg-surface-800',
                  !sidebarOpen && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={!sidebarOpen ? item.name : undefined}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0 transition-colors', isActive && 'text-brand-600 dark:text-brand-400')} aria-hidden="true" />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
                {isActive && sidebarOpen && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-brand-600 dark:bg-brand-400 rounded-r-full" aria-hidden="true" />
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-surface-200 dark:border-surface-800">
          <button
            type="button"
            onClick={() => logout()}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body font-medium transition-all duration-200',
              'text-surface-600 hover:text-danger-600 hover:bg-danger-50 dark:text-surface-400 dark:hover:text-danger-400 dark:hover:bg-danger-500/10',
              !sidebarOpen && 'justify-center px-2'
            )}
            title={!sidebarOpen ? 'Sign out' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {sidebarOpen && <span className="truncate">Sign out</span>}
          </button>
        </div>
      </aside>

      <div
        className={cn(
          'flex-1 min-w-0 transition-all duration-300 ease-in-out min-h-screen flex flex-col',

        )}
      >
        <header className="sticky top-0 z-30 w-full border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileSidebarOpen}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-heading-lg font-semibold text-surface-900 dark:text-surface-50 truncate">
                {navigation.find((n) => location.pathname.startsWith(n.href))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-danger-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-800 overflow-hidden z-50">
                    <div className="p-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
                      <h3 className="font-semibold text-surface-900 dark:text-surface-50">Notifications</h3>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="p-1 rounded text-surface-400 hover:text-surface-600"
                        aria-label="Close notifications"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          className={cn(
                            'w-full p-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors border-b border-surface-100 dark:border-surface-800 last:border-0',
                            !notification.read && 'bg-brand-50/50 dark:bg-brand-900/20'
                          )}
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <p className={cn('font-medium text-sm', !notification.read && 'text-surface-900 dark:text-surface-50')}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{notification.time}</p>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-surface-200 dark:border-surface-800">
                      <Link
                        to="/hr/notifications"
                        className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 block text-center"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <Avatar
                    src={user?.avatar}
                    name={user?.name}
                    size="sm"
                    status={user?.status}
                  />
                  <span className="hidden sm:block text-body-sm font-medium text-surface-700 dark:text-surface-300">
                    {user?.name}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-800 overflow-hidden z-50" role="menu">
                    <Link
                      to="/hr/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" /> Settings
                    </Link>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10 transition-colors text-left"
                      role="menuitem"
                      onClick={() => { setUserMenuOpen(false); logout() }}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8" id="main-content" role="main">
          {mobileSidebarOpen && (
            <div
              className="fixed inset-0 z-30 lg:hidden bg-black/50"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}