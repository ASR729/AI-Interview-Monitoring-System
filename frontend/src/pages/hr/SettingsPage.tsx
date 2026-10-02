import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  User,
  Bell,
  Shield,
  Key,
  Palette,
  Globe,
  Database,
  Webhook,
  Puzzle,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  HardDrive,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  TestTube,
  RotateCcw,
  Trash2,
  Code,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Toggle } from '@/components/ui/Toggle'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'

export function HRSettingsPage() {
  const { user, updateProfile } = useAuth()
  const { success, danger } = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'integrations' | 'data' | 'advanced'>('profile')
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    title: '',
    phone: '',
    timezone: 'America/Los_Angeles',
    language: 'en',
  })

  const [notifications, setNotifications] = useState({
    emailInterviewScheduled: true,
    emailInterviewReminder: true,
    emailInterviewCompleted: true,
    emailIntegrityAlert: true,
    emailReportReady: true,
    emailWeeklyDigest: false,
    pushInterviewStarting: true,
    pushIntegrityAlert: true,
    pushCandidateUpdate: false,
    smsCriticalAlerts: false,
  })

  const [security, setSecurity] = useState({
    twoFAEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true,
    deviceManagement: true,
    apiKeyRotation: 30,
  })

  const [appearance, setAppearance] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    density: 'comfortable' as 'compact' | 'comfortable' | 'spacious',
    animations: true,
    reducedMotion: false,
    sidebarCollapsed: false,
  })

  const [integrations, setIntegrations] = useState([
    { id: 'ats', name: 'Applicant Tracking System', description: 'Greenhouse, Lever, Workable', status: 'disconnected', icon: Database },
    { id: 'calendar', name: 'Calendar Sync', description: 'Google Calendar, Outlook', status: 'connected', icon: Integration },
    { id: 'video', name: 'Video Conferencing', description: 'Zoom, Teams, Google Meet', status: 'connected', icon: Monitor },
    { id: 'sso', name: 'Single Sign-On', description: 'SAML 2.0, OIDC, Okta, Azure AD', status: 'disconnected', icon: Lock },
    { id: 'webhook', name: 'Webhooks', description: 'Custom event notifications', status: 'disconnected', icon: Webhook },
    { id: 'slack', name: 'Slack Notifications', description: 'Channel alerts and daily summaries', status: 'connected', icon: Mail },
  ])

  const [dataSettings, setDataSettings] = useState({
    retentionPeriod: 365,
    autoDeleteRecordings: false,
    anonymizeReports: true,
    exportFormat: 'pdf',
    backupFrequency: 'weekly',
    complianceMode: 'standard',
  })

  const handleSave = async (section: string) => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (section === 'profile' && user) {
        await updateProfile({ name: profile.name })
      }
      success('Saved', `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`)
    } catch {
      danger('Error', 'Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnected' } : i))
    success('Disconnected', 'Integration disconnected successfully')
  }

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connecting' } : i))
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected' } : i))
      success('Connected', 'Integration connected successfully')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Settings</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage your account, preferences, and integrations</p>
        </div>
        <Button variant="primary" onClick={() => handleSave(activeTab)} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" /> Security</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" /> Appearance</TabsTrigger>
          <TabsTrigger value="integrations"><Puzzle className="h-4 w-4 mr-2" /> Integrations</TabsTrigger>
          <TabsTrigger value="data"><Database className="h-4 w-4 mr-2" /> Data & Privacy</TabsTrigger>
          <TabsTrigger value="advanced"><TestTube className="h-4 w-4 mr-2" /> Advanced</TabsTrigger>
        </TabsList>

        {activeTab === 'profile' && (
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar name={profile.name} size="xl" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} />
                <div className="flex flex-col gap-2">
                  <Button variant="neutral" size="sm">Change Avatar</Button>
                  <Button variant="ghost" size="sm" danger>Remove Avatar</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label">Full Name</label>
                  <Input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <label className="label">Email</label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <label className="label">Company</label>
                  <Input value={profile.company} onChange={(e) => setProfile(p => ({ ...p, company: e.target.value }))} placeholder="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <label className="label">Job Title</label>
                  <Input value={profile.title} onChange={(e) => setProfile(p => ({ ...p, title: e.target.value }))} placeholder="Senior Technical Recruiter" />
                </div>
                <div className="space-y-2">
                  <label className="label">Phone</label>
                  <Input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label className="label">Timezone</label>
                  <select className="input w-full" value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Australia/Sydney">Sydney (AEDT)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="label">Language</label>
                  <select className="input w-full" value={profile.language} onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Email Notifications
                </h4>
                {[
                  { key: 'emailInterviewScheduled', label: 'Interview Scheduled', desc: 'When a new interview is scheduled' },
                  { key: 'emailInterviewReminder', label: 'Interview Reminders', desc: '1 hour and 15 minutes before interviews' },
                  { key: 'emailInterviewCompleted', label: 'Interview Completed', desc: 'When an interview finishes with summary' },
                  { key: 'emailIntegrityAlert', label: 'Integrity Alerts', desc: 'High-severity integrity events during interviews' },
                  { key: 'emailReportReady', label: 'Report Ready', desc: 'When generated reports are available for download' },
                  { key: 'emailWeeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of hiring pipeline and metrics' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-surface-50">{n.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{n.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[n.key as keyof typeof notifications]}
                      onChange={v => setNotifications(p => ({ ...p, [n.key]: v }))}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Push Notifications
                </h4>
                {[
                  { key: 'pushInterviewStarting', label: 'Interview Starting Soon', desc: '15 minutes before your scheduled interviews' },
                  { key: 'pushIntegrityAlert', label: 'Integrity Alerts', desc: 'Real-time alerts during live interviews' },
                  { key: 'pushCandidateUpdate', label: 'Candidate Updates', desc: 'Stage changes and new applications' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-surface-50">{n.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{n.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[n.key as keyof typeof notifications]}
                      onChange={v => setNotifications(p => ({ ...p, [n.key]: v }))}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-danger-600" aria-hidden="true" />
                  SMS Alerts
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-surface-50">Critical Alerts Only</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">SMS for critical integrity violations only</p>
                  </div>
                  <Toggle
                    checked={notifications.smsCriticalAlerts}
                    onChange={v => setNotifications(p => ({ ...p, smsCriticalAlerts: v }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage authentication, sessions, and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Two-Factor Authentication
                </h4>
                <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">Two-Factor Authentication</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Add an extra layer of security to your account</p>
                  </div>
                  <Toggle
                    checked={security.twoFAEnabled}
                    onChange={v => setSecurity(p => ({ ...p, twoFAEnabled: v }))}
                  />
                </div>
                {!security.twoFAEnabled && (
                  <Button variant="neutral" size="sm" className="gap-2">
                    <Key className="h-4 w-4" aria-hidden="true" />
                    Enable 2FA
                  </Button>
                )}
                {security.twoFAEnabled && (
                  <Button variant="neutral" size="sm" className="gap-2" danger>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Reset 2FA
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Key className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Password & Sessions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">Session Timeout (minutes)</label>
                    <Input type="number" value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: parseInt(e.target.value) }))} min={5} max={480} />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Password Expiry (days)</label>
                    <Input type="number" value={security.passwordExpiry} onChange={e => setSecurity(p => ({ ...p, passwordExpiry: parseInt(e.target.value) }))} min={30} max={365} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Login Alerts</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Notify me of new device logins</p>
                    </div>
                    <Toggle checked={security.loginAlerts} onChange={v => setSecurity(p => ({ ...p, loginAlerts: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Device Management</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">View and manage active sessions</p>
                    </div>
                    <Toggle checked={security.deviceManagement} onChange={v => setSecurity(p => ({ ...p, deviceManagement: v }))} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Puzzle className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  API Keys
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">API Key Rotation (days)</label>
                    <Input type="number" value={security.apiKeyRotation} onChange={e => setSecurity(p => ({ ...p, apiKeyRotation: parseInt(e.target.value) }))} min={7} max={90} />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Active Keys</label>
                    <div className="input bg-surface-50 dark:bg-surface-800/50 text-surface-900 dark:text-surface-50 font-mono">3 keys active</div>
                  </div>
                </div>
                <Button variant="neutral" size="sm" className="gap-2">
                  <Key className="h-4 w-4" aria-hidden="true" />
                  Manage API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'appearance' && (
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks and behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Moon className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  <Sun className="h-5 w-5 text-warning-600" aria-hidden="true" />
                  Theme
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light mode' },
                    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark mode' },
                    { value: 'system', label: 'System', icon: Monitor, desc: 'Match system preference' },
                  ].map(t => (
                    <Button
                      key={t.value}
                      variant={appearance.theme === t.value ? 'primary' : 'outline'}
                      className="h-28 flex-col gap-2 text-left"
                      onClick={() => setAppearance(p => ({ ...p, theme: t.value as typeof appearance.theme }))}
                    >
                      <t.icon className="h-6 w-6" aria-hidden="true" />
                      <span className="font-medium">{t.label}</span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">{t.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Database className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Layout Density
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'compact', label: 'Compact', desc: 'Tight spacing, more content' },
                    { value: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing (default)' },
                    { value: 'spacious', label: 'Spacious', desc: 'Generous spacing, easier reading' },
                  ].map(d => (
                    <Button
                      key={d.value}
                      variant={appearance.density === d.value ? 'primary' : 'outline'}
                      className="h-24 flex-col gap-2 text-left"
                      onClick={() => setAppearance(p => ({ ...p, density: d.value as typeof appearance.density }))}
                    >
                      <span className="font-medium">{d.label}</span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">{d.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Accessibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Reduce Motion</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Minimize animations and transitions</p>
                    </div>
                    <Toggle checked={appearance.reducedMotion} onChange={v => setAppearance(p => ({ ...p, reducedMotion: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Animations</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Enable UI animations and transitions</p>
                    </div>
                    <Toggle checked={appearance.animations} onChange={v => setAppearance(p => ({ ...p, animations: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Collapsed Sidebar</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Start with sidebar collapsed</p>
                    </div>
                    <Toggle checked={appearance.sidebarCollapsed} onChange={v => setAppearance(p => ({ ...p, sidebarCollapsed: v }))} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-4">
            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader>
                <CardTitle>Connected Integrations</CardTitle>
                <CardDescription>Manage third-party services connected to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrations.map((integration, index) => {
                    const Icon = integration.icon
                    const isConnected = integration.status === 'connected'
                    const isConnecting = integration.status === 'connecting'
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
                        <div className="flex items-center gap-4">
                          <div className={cn('p-3 rounded-xl', isConnected ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-surface-100 dark:bg-surface-800')}>
                            <Icon className={cn('h-5 w-5', isConnected ? 'text-emerald-600' : 'text-surface-500')} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-medium text-surface-900 dark:text-surface-50">{integration.name}</p>
                            <p className="text-sm text-surface-500 dark:text-surface-400">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={isConnected ? 'success' : 'neutral'} className="gap-1">
                            {isConnected ? (
                              <>
                                <Check className="h-3 w-3" aria-hidden="true" />
                                Connected
                              </>
                            ) : isConnecting ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                                Disconnected
                              </>
                            )}
                          </Badge>
                          {isConnected ? (
                            <Button variant="ghost" size="sm" onClick={() => handleDisconnect(integration.id)} danger>
                              Disconnect
                            </Button>
                          ) : (
                            <Button variant="primary" size="sm" onClick={() => handleConnect(integration.id)} disabled={isConnecting}>
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
                <CardDescription>Additional integrations available on your plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: 'Microsoft Teams', desc: 'Meeting scheduling and recording', category: 'Video' },
                    { name: 'Google Workspace', desc: 'Calendar, Drive, and Meet integration', category: 'Productivity' },
                    { name: 'Workday', desc: 'HRIS sync and candidate management', category: 'ATS' },
                    { name: 'BambooHR', desc: 'Employee data and org chart sync', category: 'HRIS' },
                    { name: 'Jira', desc: 'Technical interview tracking', category: 'Project Mgmt' },
                    { name: 'Custom Webhooks', desc: 'Build your own integrations', category: 'Developer' },
                  ].map((item, i) => (
                    <Card key={i} className="border-surface-200 dark:border-surface-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-surface-900 dark:text-surface-50">{item.name}</p>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                        </div>
                        <Badge variant="neutral">{item.category}</Badge>
                      </div>
                      <Button variant="neutral" size="sm" className="w-full mt-3 gap-2">
                        <Puzzle className="h-4 w-4" aria-hidden="true" />
                        Configure
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'data' && (
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Control data retention, export, and compliance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Data Retention
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">Retention Period (days)</label>
                    <Input type="number" value={dataSettings.retentionPeriod} onChange={e => setDataSettings(p => ({ ...p, retentionPeriod: parseInt(e.target.value) }))} min={30} max={2555} />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Compliance Mode</label>
                    <select className="input w-full" value={dataSettings.complianceMode} onChange={e => setDataSettings(p => ({ ...p, complianceMode: e.target.value }))}>
                      <option value="standard">Standard</option>
                      <option value="gdpr">GDPR</option>
                      <option value="ccpa">CCPA</option>
                      <option value="hipaa">HIPAA</option>
                      <option value="sox">SOX</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Privacy Controls
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Anonymize Reports</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Remove PII from exported reports</p>
                    </div>
                    <Toggle checked={dataSettings.anonymizeReports} onChange={v => setDataSettings(p => ({ ...p, anonymizeReports: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Auto-delete Recordings</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Automatically delete recordings after retention period</p>
                    </div>
                    <Toggle checked={dataSettings.autoDeleteRecordings} onChange={v => setDataSettings(p => ({ ...p, autoDeleteRecordings: v }))} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Export & Backup
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">Default Export Format</label>
                    <select className="input w-full" value={dataSettings.exportFormat} onChange={e => setDataSettings(p => ({ ...p, exportFormat: e.target.value }))}>
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label">Backup Frequency</label>
                    <select className="input w-full" value={dataSettings.backupFrequency} onChange={e => setDataSettings(p => ({ ...p, backupFrequency: e.target.value }))}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="neutral" className="gap-2">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Export All Data
                  </Button>
                  <Button variant="neutral" className="gap-2">
                    <Cloud className="h-4 w-4" aria-hidden="true" />
                    Request Backup
                  </Button>
                </div>
              </div>

              <div className="space-y-4 border-t border-danger-200 dark:border-danger-900/30 pt-6">
                <h4 className="font-medium text-danger-600 dark:text-danger-400 flex items-center gap-2">
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                  Danger Zone
                </h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">These actions are irreversible. Proceed with caution.</p>
                <div className="flex gap-3">
                  <Button variant="neutral" danger className="gap-2">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete My Account
                  </Button>
                  <Button variant="neutral" danger className="gap-2">
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'advanced' && (
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Experimental features and developer options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Feature Flags
                </h4>
                <p className="text-sm text-surface-500 dark:text-surface-400">Enable experimental features (may be unstable)</p>
                <div className="space-y-3">
                  {[
                    { key: 'betaUI', label: 'New Dashboard UI', desc: 'Try the redesigned dashboard (beta)' },
                    { key: 'aiInsights', label: 'AI-Powered Insights', desc: 'Experimental ML-based recommendations' },
                    { key: 'realtimeCollab', label: 'Real-time Collaboration', desc: 'Live co-editing of interview notes' },
                    { key: 'advancedAnalytics', label: 'Advanced Analytics', desc: 'Extended metrics and custom dashboards' },
                  ].map(f => (
                    <div key={f.key} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-surface-900 dark:text-surface-50">{f.label}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{f.desc}</p>
                      </div>
                      <Toggle checked={false} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Reset Options
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="neutral" className="gap-2">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Reset to Defaults
                  </Button>
                  <Button variant="neutral" className="gap-2">
                    <HardDrive className="h-4 w-4" aria-hidden="true" />
                    Clear Cache
                  </Button>
                  <Button variant="neutral" className="gap-2">
                    <Database className="h-4 w-4" aria-hidden="true" />
                    Reindex Search
                  </Button>
                </div>
              </div>

              <div className="space-y-4 border-t border-surface-200 dark:border-surface-800 pt-6">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 flex items-center gap-2">
                  <Code className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  Developer
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">Debug Mode</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Enable verbose logging and debug panel</p>
                    </div>
                    <Toggle checked={false} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">API Mock Mode</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Use mock data instead of real API calls</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  )
}