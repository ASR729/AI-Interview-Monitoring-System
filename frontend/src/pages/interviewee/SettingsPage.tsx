import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  User,
  Bell,
  Shield,
  Palette,
  Link,
  Zap,
  Moon,
  Sun,
  Monitor,
  Layers,
  Key,
  Lock,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Headphones,
  Mic,
  Video,
  Settings as SettingsIcon,
  Sliders,
  Terminal,
  Bug,
  FileText,
  Clock,
  History,
  Wifi,
  Globe,
  Smartphone,
  Database,
  Cpu,
  Camera,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Toggle } from '@/components/ui/Toggle'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'
import { Separator } from '@/components/ui/Separator'
import { useToast } from '@/components/ui/Toast'

export function IntervieweeSettingsPage() {
  const { success, warning, danger } = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences' | 'security' | 'appearance' | 'integrations' | 'advanced'>('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Settings</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage your candidate account and interview preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-full mb-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center justify-center gap-2 py-2 px-3 text-sm">
              <tab.icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information visible to interviewers and hiring teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar name="Morgan Lee" size="xl" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan" />
                  <button className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors" aria-label="Change avatar">
                    <Camera className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" /> Change Photo</Button>
                  <Button variant="ghost" size="sm" className="mt-2 text-danger-600 hover:text-danger-700">Remove Photo</Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Morgan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Lee" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="morgan.lee@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 987-6543" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Input id="currentRole" defaultValue="Security Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Current Company</Label>
                  <Input id="company" defaultValue="TechCorp Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc-0">UTC</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Summary</Label>
                <Textarea id="bio" rows={4} placeholder="Brief summary of your background, skills, and career goals..." defaultValue="Security Engineer with 5+ years of experience in application security, penetration testing, and secure code review. Passionate about building secure systems and mentoring junior engineers." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills (comma-separated)</Label>
                <Input id="skills" defaultValue="Application Security, Penetration Testing, Secure Code Review, Python, Go, AWS, Kubernetes" />
              </div>
              <div className="flex justify-end pt-4 border-t border-surface-200 dark:border-surface-800">
                <Button variant="primary" className="gap-2" onClick={() => success('Profile Updated', 'Your profile has been saved successfully')}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose which events trigger email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'interview_scheduled', label: 'Interview Scheduled', desc: 'When a new interview is scheduled for you' },
                { id: 'interview_reminder', label: 'Interview Reminders', desc: '24 hours and 1 hour before scheduled interviews' },
                { id: 'interview_starting', label: 'Interview Starting Soon', desc: '15 minutes before interview start time' },
                { id: 'interview_rescheduled', label: 'Interview Rescheduled', desc: 'When an interview time changes' },
                { id: 'interview_cancelled', label: 'Interview Cancelled', desc: 'When an interview is cancelled' },
                { id: 'system_check_reminder', label: 'System Check Reminder', desc: 'Reminder to complete pre-interview system check' },
                { id: 'report_ready', label: 'Report Available', desc: 'When your interview report is ready' },
                { id: 'weekly_digest', label: 'Weekly Digest', desc: 'Summary of upcoming interviews and status' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                  </div>
                  <Toggle defaultChecked={!['weekly_digest'].includes(item.id)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>Real-time notifications within the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'interview_updates', label: 'Interview Updates', desc: 'Scheduling changes, reminders, and status updates' },
                { id: 'chat_messages', label: 'Chat Messages', desc: 'Messages from interviewers or system' },
                { id: 'system_alerts', label: 'System Alerts', desc: 'Technical issues, maintenance, announcements' },
                { id: 'preparation_tips', label: 'Preparation Tips', desc: 'Helpful reminders for interview preparation' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                  </div>
                  <Toggle defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Notification Sounds</CardTitle>
              <CardDescription>Audio cues for different notification types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'interview_sound', label: 'Interview Reminder Sound', desc: 'Play sound for upcoming interview alerts', defaultOn: true },
                { id: 'chat_sound', label: 'Chat Message Sound', desc: 'Play sound for new chat messages', defaultOn: true },
                { id: 'alert_sound', label: 'System Alert Sound', desc: 'Play sound for important system notifications', defaultOn: true },
                { id: 'complete_sound', label: 'Interview Complete Sound', desc: 'Play sound when interview ends', defaultOn: false },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                  </div>
                  <Toggle defaultChecked={item.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Interview Preferences</CardTitle>
              <CardDescription>Default settings for your interview experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Preferred Interview Duration</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Interview Types</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Screen</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="system_design">System Design</SelectItem>
                    <SelectItem value="coding">Live Coding</SelectItem>
                    <SelectItem value="final">Final Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-4">
                {[
                  { id: 'auto_join_waiting', label: 'Auto-Join Waiting Room', desc: 'Automatically enter waiting room 5 minutes before interview', defaultOn: true },
                  { id: 'enable_camera_default', label: 'Camera On by Default', desc: 'Start with camera enabled when joining', defaultOn: true },
                  { id: 'enable_mic_default', label: 'Microphone On by Default', desc: 'Start with microphone enabled when joining', defaultOn: true },
                  { id: 'show_timer', label: 'Show Interview Timer', desc: 'Display countdown timer during interview', defaultOn: true },
                  { id: 'show_integrity_score', label: 'Show My Integrity Score', desc: 'Display real-time integrity metrics (if enabled by interviewer)', defaultOn: false },
                  { id: 'blur_background', label: 'Blur Background', desc: 'Automatically blur video background', defaultOn: true },
                  { id: 'noise_cancellation', label: 'Noise Cancellation', desc: 'Enable audio noise suppression', defaultOn: true },
                  { id: 'recording_consent', label: 'Recording Consent Prompt', desc: 'Always ask for consent before recording', defaultOn: true },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                    </div>
                    <Toggle defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>How interview information is displayed to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interviewer Name Display</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Name</SelectItem>
                    <SelectItem value="first">First Name Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour (e.g., 2:30 PM)</SelectItem>
                    <SelectItem value="24h">24 Hour (e.g., 14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">MM/DD/YYYY</SelectItem>
                    <SelectItem value="eu">DD/MM/YYYY</SelectItem>
                    <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                    <SelectItem value="long">Month D, YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-brand-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">Authenticator App</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Use Google Authenticator, Authy, or similar</p>
                  </div>
                </div>
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <Phone className="h-6 w-6 text-surface-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">SMS Backup</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Receive codes via text message</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Set Up</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <Key className="h-6 w-6 text-surface-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">Recovery Codes</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Backup codes for account recovery</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => {}}>
                  <Download className="h-3 w-3" />
                  View Codes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Control active sessions and login behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select timeout" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                    <SelectItem value="never">Never (Stay logged in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'login_alerts', label: 'Login Alerts', desc: 'Notify me of new logins from unrecognized devices', defaultOn: true },
                  { id: 'concurrent_sessions', label: 'Limit Concurrent Sessions', desc: 'Allow only 2 simultaneous sessions', defaultOn: true },
                  { id: 'password_expiry', label: 'Password Expiry', desc: 'Require password change every 90 days', defaultOn: false },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                    </div>
                    <Toggle defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>Control your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { id: 'data_retention', label: 'Data Retention', desc: 'Automatically delete interview data after 1 year', defaultOn: false },
                  { id: 'analytics_opt_out', label: 'Opt Out of Analytics', desc: 'Do not include my data in platform analytics', defaultOn: false },
                  { id: 'marketing_emails', label: 'Marketing Emails', desc: 'Receive product updates and tips via email', defaultOn: false },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                    </div>
                    <Toggle defaultChecked={item.defaultOn} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800 border-danger-200 dark:border-danger-900/30">
            <CardHeader>
              <CardTitle className="text-danger-600 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that affect your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-900/30">
                <div>
                  <p className="font-medium text-danger-700 dark:text-danger-300">Deactivate Candidate Account</p>
                  <p className="text-sm text-danger-600 dark:text-danger-400">Temporarily disable your candidate access. You can reactivate later.</p>
                </div>
                <Button variant="danger" size="sm">Deactivate</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-900/30">
                <div>
                  <p className="font-medium text-danger-700 dark:text-danger-300">Delete All Interview Data</p>
                  <p className="text-sm text-danger-600 dark:text-danger-400">Permanently delete all your interview recordings, transcripts, and reports.</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => danger('Action Required', 'This would permanently delete data')}>
                  <Trash2 className="h-3 w-3" />
                  Delete Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred color scheme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun, desc: 'Always use light mode' },
                  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark mode' },
                  { id: 'system', label: 'System', icon: Monitor, desc: 'Match your OS setting' },
                ].map(theme => (
                  <button
                    key={theme.id}
                    className={cn('relative p-6 rounded-xl border-2 transition-all text-left', theme.id === 'system' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700')}
                    onClick={() => success('Theme Changed', `Switched to ${theme.label} mode`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('p-3 rounded-lg', theme.id === 'system' ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-surface-100 dark:bg-surface-800')}>
                        <theme.icon className="h-6 w-6 text-surface-600 dark:text-surface-400" aria-hidden="true" />
                      </div>
                    </div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">{theme.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{theme.desc}</p>
                    {theme.id === 'system' && (
                      <div className="absolute top-2 right-2 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">Active</div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Interface Density</CardTitle>
              <CardDescription>Adjust spacing and sizing for your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'compact', label: 'Compact', icon: Layers, desc: 'More content, smaller spacing' },
                  { id: 'comfortable', label: 'Comfortable', icon: Layers, desc: 'Balanced spacing (default)' },
                  { id: 'spacious', label: 'Spacious', icon: Layers, desc: 'More breathing room' },
                ].map(density => (
                  <button
                    key={density.id}
                    className={cn('relative p-6 rounded-xl border-2 transition-all text-left', density.id === 'comfortable' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700')}
                    onClick={() => success('Density Changed', `Switched to ${density.label} mode`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('p-3 rounded-lg', density.id === 'comfortable' ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-surface-100 dark:bg-surface-800')}>
                        <density.icon className="h-6 w-6 text-surface-600 dark:text-surface-400" aria-hidden="true" />
                      </div>
                    </div>
                    <p className="font-medium text-surface-900 dark:text-surface-50">{density.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{density.desc}</p>
                    {density.id === 'comfortable' && (
                      <div className="absolute top-2 right-2 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">Active</div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Enhance usability for your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'reduced_motion', label: 'Reduced Motion', desc: 'Minimize animations and transitions', defaultOn: false },
                { id: 'high_contrast', label: 'High Contrast', desc: 'Increase color contrast for readability', defaultOn: false },
                { id: 'focus_indicators', label: 'Enhanced Focus Indicators', desc: 'More visible focus outlines for keyboard navigation', defaultOn: true },
                { id: 'larger_text', label: 'Larger Text', desc: 'Increase base font size by 125%', defaultOn: false },
                { id: 'screen_reader', label: 'Screen Reader Optimizations', desc: 'Additional ARIA labels and descriptions', defaultOn: false },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                  </div>
                  <Toggle defaultChecked={item.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>Sync interview schedules with your personal calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'google_calendar', label: 'Google Calendar', icon: Calendar, status: 'connected', color: 'text-brand-600', bgColor: 'bg-brand-100 dark:bg-brand-900/30', desc: 'Synced as morgan.lee@gmail.com' },
                { id: 'outlook_calendar', label: 'Outlook Calendar', icon: Calendar, status: 'disconnected', color: 'text-surface-500', bgColor: 'bg-surface-100 dark:bg-surface-800', desc: 'Not connected' },
                { id: 'apple_calendar', label: 'Apple Calendar', icon: Calendar, status: 'disconnected', color: 'text-surface-500', bgColor: 'bg-surface-100 dark:bg-surface-800', desc: 'Not connected' },
              ].map(cal => (
                <div key={cal.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg', cal.bgColor)}>
                      <cal.icon className={cn('h-6 w-6', cal.color)} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">{cal.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{cal.desc}</p>
                    </div>
                  </div>
                  <Button variant={cal.status === 'connected' ? 'outline' : 'primary'} size="sm" className="gap-1">
                    {cal.status === 'connected' ? (
                      <>
                        <ExternalLink className="h-3 w-3" />
                        Manage
                      </>
                    ) : (
                      <>
                        <Link className="h-3 w-3" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Video Platforms</CardTitle>
              <CardDescription>Preferred video conferencing platforms for interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'teams', label: 'Microsoft Teams', icon: Video, status: 'available', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', desc: 'Installed and ready' },
                { id: 'zoom', label: 'Zoom', icon: Video, status: 'available', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', desc: 'Installed and ready' },
                { id: 'meet', label: 'Google Meet', icon: Video, status: 'available', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', desc: 'Browser-based, no install needed' },
              ].map(vc => (
                <div key={vc.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg', vc.bgColor)}>
                      <vc.icon className={cn('h-6 w-6', vc.color)} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">{vc.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{vc.desc}</p>
                    </div>
                  </div>
                  <Badge variant="success" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Ready
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>How you prefer to be contacted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'email', label: 'Email', icon: Mail, enabled: true, desc: 'Primary contact method' },
                { id: 'sms', label: 'SMS', icon: Phone, enabled: false, desc: 'For urgent interview updates' },
                { id: 'push', label: 'Push Notifications', icon: Bell, enabled: true, desc: 'Real-time app notifications' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-lg', item.enabled ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-surface-100 dark:bg-surface-700')}>
                      <item.icon className={cn('h-6 w-6', item.enabled ? 'text-brand-600' : 'text-surface-500')} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 animate-fade-in">
          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Interview Features</CardTitle>
              <CardDescription>Enable or disable interview experience features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'practice_mode', label: 'Practice Mode', desc: 'Access practice interviews and mock sessions', defaultOn: true, beta: false },
                { id: 'ai_feedback', label: 'AI Feedback', desc: 'Receive AI-generated feedback after interviews', defaultOn: true, beta: true },
                { id: 'interview_recording', label: 'Interview Recording', desc: 'Allow recording of your interviews (with consent)', defaultOn: true, beta: false },
                { id: 'transcript_access', label: 'Transcript Access', desc: 'View interview transcripts after completion', defaultOn: true, beta: false },
                { id: 'performance_insights', label: 'Performance Insights', desc: 'See your interview performance trends over time', defaultOn: true, beta: true },
                { id: 'peer_comparison', label: 'Anonymous Peer Comparison', desc: 'Compare your performance anonymously with peers', defaultOn: false, beta: true },
              ].map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-surface-900 dark:text-surface-50">{feature.label}</p>
                      {feature.beta && <Badge variant="outline" size="xs">Beta</Badge>}
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{feature.desc}</p>
                  </div>
                  <Toggle defaultChecked={feature.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Developer Settings</CardTitle>
              <CardDescription>Settings for development and testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'debug_mode', label: 'Debug Mode', desc: 'Show debug information and console logs', defaultOn: false },
                { id: 'api_mock_mode', label: 'API Mock Mode', desc: 'Use mock data instead of real API calls', defaultOn: true },
                { id: 'show_performance', label: 'Show Performance Metrics', desc: 'Display render times and memory usage', defaultOn: false },
                { id: 'verbose_logging', label: 'Verbose Logging', desc: 'Detailed logs for troubleshooting', defaultOn: false },
                { id: 'experimental_ui', label: 'Experimental UI', desc: 'Enable preview features and new components', defaultOn: false },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-surface-50">{item.label}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                  </div>
                  <Toggle defaultChecked={item.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or reset your candidate data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-50">Export Interview Data</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Download all your interview reports, feedback, and settings</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => success('Export Started', 'Your data export will be ready shortly')}>
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-50">Import Settings</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Restore settings from a previous export</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => warning('Import', 'Select a settings file to import')}>
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-900/30">
                <div>
                  <p className="font-medium text-danger-700 dark:text-danger-300">Reset All Settings</p>
                  <p className="text-sm text-danger-600 dark:text-danger-400">Restore all settings to default values</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => danger('Reset', 'All settings have been reset to defaults')}>
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-surface-200 dark:border-surface-800">
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Application information and version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700">
                <span className="text-surface-600 dark:text-surface-400">Version</span>
                <span className="font-mono text-surface-900 dark:text-surface-50">2.1.0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700">
                <span className="text-surface-600 dark:text-surface-400">Build</span>
                <span className="font-mono text-surface-900 dark:text-surface-50">2024.03.15.1423</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700">
                <span className="text-surface-600 dark:text-surface-400">Environment</span>
                <span className="font-mono text-surface-900 dark:text-surface-50">Production</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-surface-600 dark:text-surface-400">API Endpoint</span>
                <span className="font-mono text-surface-900 dark:text-surface-50 text-xs">https://api.interview-monitor.com/v2</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}