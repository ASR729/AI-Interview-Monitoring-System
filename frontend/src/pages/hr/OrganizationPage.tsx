import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  Key,
  Building2,
  Bell,
  Activity,
  Crown,
  UserCheck,
  UserX,
  Settings,
  LogOut,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable, TableColumn } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

const mockTeamMembers = [
  { id: 'USR-001', name: 'Michael Torres', email: 'michael.torres@company.com', role: 'interviewer', status: 'active', lastActive: '2024-01-15 14:30', interviews: 23, avgRating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { id: 'USR-002', name: 'Priya Patel', email: 'priya.patel@company.com', role: 'interviewer', status: 'active', lastActive: '2024-01-15 16:45', interviews: 18, avgRating: 4.9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: 'USR-003', name: 'David Park', email: 'david.park@company.com', role: 'interviewer', status: 'active', lastActive: '2024-01-15 11:20', interviews: 15, avgRating: 4.7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 'USR-004', name: 'Lisa Wang', email: 'lisa.wang@company.com', role: 'interviewer', status: 'away', lastActive: '2024-01-14 17:00', interviews: 21, avgRating: 4.6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
  { id: 'USR-005', name: 'Robert Kim', email: 'robert.kim@company.com', role: 'interviewer', status: 'active', lastActive: '2024-01-15 09:15', interviews: 12, avgRating: 4.5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
  { id: 'USR-006', name: 'Amanda Foster', email: 'amanda.foster@company.com', role: 'interviewer', status: 'offline', lastActive: '2024-01-13 15:30', interviews: 8, avgRating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda' },
  { id: 'USR-007', name: 'James Chen', email: 'james.chen@company.com', role: 'interviewer', status: 'active', lastActive: '2024-01-15 13:45', interviews: 19, avgRating: 4.7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'USR-008', name: 'Emma Wilson', email: 'emma.wilson@company.com', role: 'interviewer', status: 'active', lastActive: '2024-01-15 10:00', interviews: 14, avgRating: 4.9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: 'USR-009', name: 'Chris Taylor', email: 'chris.taylor@company.com', role: 'hr', status: 'active', lastActive: '2024-01-15 12:30', interviews: 0, avgRating: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
  { id: 'USR-010', name: 'Nina Rodriguez', email: 'nina.rodriguez@company.com', role: 'hr', status: 'active', lastActive: '2024-01-15 08:45', interviews: 0, avgRating: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina' },
]

const roleConfig = {
  hr: { label: 'HR / Recruiter', icon: Shield, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  interviewer: { label: 'Interviewer', icon: UserCheck, color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  interviewee: { label: 'Candidate', icon: Users, color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300' },
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: Activity },
  away: { label: 'Away', color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300', icon: Bell },
  offline: { label: 'Offline', color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300', icon: UserX },
}

const mockInvitations = [
  { id: 'INV-001', email: 'sarah.johnson@newco.com', name: 'Sarah Johnson', role: 'interviewer', invitedBy: 'Chris Taylor', invitedAt: '2024-01-14', status: 'pending', expiresAt: '2024-01-21' },
  { id: 'INV-002', email: 'alex.martinez@email.com', name: 'Alex Martinez', role: 'interviewer', invitedBy: 'Nina Rodriguez', invitedAt: '2024-01-13', status: 'accepted', expiresAt: '2024-01-20' },
  { id: 'INV-003', email: 'jordan.kim@techstart.io', name: 'Jordan Kim', role: 'hr', invitedBy: 'Michael Torres', invitedAt: '2024-01-12', status: 'expired', expiresAt: '2024-01-19' },
  { id: 'INV-004', email: 'taylor.swift@company.com', name: 'Taylor Swift', role: 'interviewer', invitedBy: 'Priya Patel', invitedAt: '2024-01-11', status: 'pending', expiresAt: '2024-01-18' },
]

export function HROrganizationPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'invitations' | 'roles'>('team')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMember, setSelectedMember] = useState<typeof mockTeamMembers[0] | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const filteredMembers = useMemo(() => {
    let result = [...mockTeamMembers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
      )
    }

    if (roleFilter !== 'all') {
      result = result.filter(m => m.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter)
    }

    return result
  }, [searchQuery, roleFilter, statusFilter])

  const teamStats = useMemo(() => ({
    total: mockTeamMembers.length,
    active: mockTeamMembers.filter(m => m.status === 'active').length,
    interviewers: mockTeamMembers.filter(m => m.role === 'interviewer').length,
    hr: mockTeamMembers.filter(m => m.role === 'hr').length,
  }), [])

  const memberColumns: TableColumn<typeof mockTeamMembers[0]>[] = [
    { key: 'name', header: 'Team Member', render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size="sm" src={row.avatar} />
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-50">{row.name}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'role', header: 'Role', render: (row) => {
      const config = roleConfig[row.role as keyof typeof roleConfig]
      const Icon = config?.icon || Users
      return (
        <Badge variant="neutral" className={cn('gap-1', config?.color)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {config?.label || row.role}
        </Badge>
      )
    }},
    { key: 'status', header: 'Status', render: (row) => {
      const config = statusConfig[row.status as keyof typeof statusConfig]
      const Icon = config?.icon || Activity
      return (
        <Badge variant="neutral" className={cn('gap-1', config?.color)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {config?.label || row.status}
        </Badge>
      )
    }},
    { key: 'lastActive', header: 'Last Active', className: 'hidden md:table-cell' },
    { key: 'interviews', header: 'Interviews', className: 'text-right', render: (row) => row.role === 'interviewer' ? (
      <span className="font-medium">{row.interviews}</span>
    ) : (
      <span className="text-surface-400 dark:text-surface-500">—</span>
    )},
    { key: 'avgRating', header: 'Avg Rating', className: 'text-right', render: (row) => row.role === 'interviewer' && row.avgRating > 0 ? (
      <div className="flex items-center justify-end gap-1">
        <span className="font-medium">{row.avgRating.toFixed(1)}</span>
        <svg className="h-4 w-4 text-warning-500 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
    ) : (
      <span className="text-surface-400 dark:text-surface-500">—</span>
    )},
    { key: 'actions', header: 'Actions', render: (row) => (
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        align="right"
        items={[
          { label: 'View Profile', value: 'view', icon: <Eye className="h-4 w-4" />, onSelect: () => setSelectedMember(row) },
          { label: 'Edit Role', value: 'edit', icon: <Edit className="h-4 w-4" /> },
          { divider: true },
          { label: row.status === 'active' ? 'Deactivate' : 'Activate', value: 'toggle', icon: row.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" /> },
          { label: 'Resend Invite', value: 'resend', icon: <Mail className="h-4 w-4" />, disabled: row.status !== 'offline' },
          { divider: true },
          { label: 'Remove from Team', value: 'remove', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  const invitationColumns: TableColumn<typeof mockInvitations[0]>[] = [
    { key: 'name', header: 'Invitee', render: (row) => (
      <div>
        <p className="font-medium text-surface-900 dark:text-surface-50">{row.name}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">{row.email}</p>
      </div>
    )},
    { key: 'role', header: 'Role', render: (row) => {
      const config = roleConfig[row.role as keyof typeof roleConfig]
      const Icon = config?.icon || Users
      return (
        <Badge variant="neutral" className={cn('gap-1', config?.color)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {config?.label || row.role}
        </Badge>
      )
    }},
    { key: 'invitedBy', header: 'Invited By' },
    { key: 'invitedAt', header: 'Invited', className: 'hidden md:table-cell' },
    { key: 'expiresAt', header: 'Expires', className: 'hidden md:table-cell' },
    { key: 'status', header: 'Status', render: (row) => {
      const statusLabels = {
        pending: { label: 'Pending', color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300', icon: Clock },
        accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: UserCheck },
        expired: { label: 'Expired', color: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300', icon: UserX },
        cancelled: { label: 'Cancelled', color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300', icon: Trash2 },
      }
      const config = statusLabels[row.status as keyof typeof statusLabels]
      const Icon = config?.icon || Clock
      return (
        <Badge variant="neutral" className={cn('gap-1', config?.color)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {config?.label || row.status}
        </Badge>
      )
    }},
    { key: 'actions', header: 'Actions', render: (row) => (
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        align="right"
        items={[
          { label: 'Resend Invitation', value: 'resend', icon: <Mail className="h-4 w-4" />, disabled: row.status !== 'pending' },
          { label: 'Cancel Invitation', value: 'cancel', icon: <Trash2 className="h-4 w-4" />, disabled: row.status !== 'pending', danger: true },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Organization</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage your team, roles, and invitations</p>
        </div>
        <Button className="gap-2" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          <span>Invite Member</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team ({teamStats.total})</TabsTrigger>
          <TabsTrigger value="invitations">Invitations ({mockInvitations.filter(i => i.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Total Members</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{teamStats.total}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Active</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{teamStats.active}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Interviewers</p>
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{teamStats.interviewers}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">HR / Recruiters</p>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{teamStats.hr}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
                    <Input
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="input w-40"
                    >
                      <option value="all">All Roles</option>
                      <option value="hr">HR / Recruiter</option>
                      <option value="interviewer">Interviewer</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input w-36"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="away">Away</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-0">
                <DataTable
                  columns={memberColumns}
                  data={filteredMembers}
                  striped
                  hoverable
                  emptyMessage="No team members found"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="space-y-4">
            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
                    <Input placeholder="Search invitations..." className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-0">
                <DataTable
                  columns={invitationColumns}
                  data={mockInvitations}
                  striped
                  hoverable
                  emptyMessage="No invitations found"
                />
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader>
                <CardTitle>Invitation Settings</CardTitle>
                <CardDescription>Configure default invitation behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">Default Expiration</label>
                    <select className="input w-full">
                      <option value="7">7 days</option>
                      <option value="14" selected>14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="label">Auto-reminder</label>
                    <select className="input w-full">
                      <option value="none">None</option>
                      <option value="3" selected>3 days before expiry</option>
                      <option value="1">1 day before expiry</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="requireApproval" className="checkbox" />
                  <label htmlFor="requireApproval" className="text-sm text-surface-700 dark:text-surface-300">
                    Require admin approval for new HR invites
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="allowSelfSignup" className="checkbox" defaultChecked />
                  <label htmlFor="allowSelfSignup" className="text-sm text-surface-700 dark:text-surface-300">
                    Allow interviewers to self-signup with company domain
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-4">
            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Define what each role can access and perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700">
                        <th className="text-left p-4 font-medium text-surface-900 dark:text-surface-50">Permission</th>
                        <th className="text-center p-4 font-medium text-surface-900 dark:text-surface-50"><Shield className="h-5 w-5 mx-auto text-violet-600" aria-hidden="true" /><span className="sr-only">HR</span></th>
                        <th className="text-center p-4 font-medium text-surface-900 dark:text-surface-50"><UserCheck className="h-5 w-5 mx-auto text-brand-600" aria-hidden="true" /><span className="sr-only">Interviewer</span></th>
                        <th className="text-center p-4 font-medium text-surface-900 dark:text-surface-50"><Users className="h-5 w-5 mx-auto text-surface-500" aria-hidden="true" /><span className="sr-only">Candidate</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                      {[
                        { perm: 'View Dashboard', hr: true, iv: true, ie: true },
                        { perm: 'Manage Candidates', hr: true, iv: false, ie: false },
                        { perm: 'Schedule Interviews', hr: true, iv: true, ie: false },
                        { perm: 'Conduct Interviews', hr: false, iv: true, ie: false },
                        { perm: 'View Live Monitoring', hr: true, iv: true, ie: false },
                        { perm: 'Access Integrity Reports', hr: true, iv: true, ie: false },
                        { perm: 'Generate Reports', hr: true, iv: false, ie: false },
                        { perm: 'Manage Team Members', hr: true, iv: false, ie: false },
                        { perm: 'Configure Integrations', hr: true, iv: false, ie: false },
                        { perm: 'View Own Interviews', hr: true, iv: true, ie: true },
                        { perm: 'System Check', hr: false, iv: false, ie: true },
                        { perm: 'View Own Reports', hr: false, iv: false, ie: true },
                      ].map((p, i) => (
                        <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                          <td className="p-4 text-surface-700 dark:text-surface-300">{p.perm}</td>
                          <td className="text-center p-4">{p.hr ? <Crown className="h-5 w-5 mx-auto text-warning-500" aria-hidden="true" /> : <UserX className="h-5 w-5 mx-auto text-surface-300 dark:text-surface-600" aria-hidden="true" />}</td>
                          <td className="text-center p-4">{p.iv ? <UserCheck className="h-5 w-5 mx-auto text-emerald-500" aria-hidden="true" /> : <UserX className="h-5 w-5 mx-auto text-surface-300 dark:text-surface-600" aria-hidden="true" />}</td>
                          <td className="text-center p-4">{p.ie ? <UserCheck className="h-5 w-5 mx-auto text-emerald-500" aria-hidden="true" /> : <UserX className="h-5 w-5 mx-auto text-surface-300 dark:text-surface-600" aria-hidden="true" />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardHeader>
                <CardTitle>Custom Roles</CardTitle>
                <CardDescription>Create custom roles with specific permissions (Enterprise feature)</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-surface-600 dark:text-surface-400">Custom roles are available on Enterprise plans.</p>
                <Button variant="neutral" asChild>
                  <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                  <a href="#">Upgrade to Enterprise</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      <Modal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember ? selectedMember.name : 'Member Details'}
        size="lg"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedMember.name} size="xl" src={selectedMember.avatar} />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">{selectedMember.name}</h3>
                <p className="text-surface-600 dark:text-surface-400">{selectedMember.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="neutral" className={cn('gap-1', roleConfig[selectedMember.role as keyof typeof roleConfig]?.color)}>
                    {(() => {
                      const Icon = roleConfig[selectedMember.role as keyof typeof roleConfig]?.icon
                      return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null
                    })()}
                    {roleConfig[selectedMember.role as keyof typeof roleConfig]?.label}
                  </Badge>
                  <Badge variant="neutral" className={cn('gap-1', statusConfig[selectedMember.status as keyof typeof statusConfig]?.color)}>
                    {(() => {
                      const Icon = statusConfig[selectedMember.status as keyof typeof statusConfig]?.icon
                      return Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null
                    })()}
                    {statusConfig[selectedMember.status as keyof typeof statusConfig]?.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Activity</h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <p><span className="font-medium">Last Active:</span> {selectedMember.lastActive}</p>
                  <p><span className="font-medium">Interviews Conducted:</span> {selectedMember.interviews}</p>
                  <p><span className="font-medium">Average Rating:</span> {selectedMember.avgRating > 0 ? selectedMember.avgRating.toFixed(1) : 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="neutral" className="w-full justify-start gap-2" size="sm">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Send Message
                  </Button>
                  <Button variant="neutral" className="w-full justify-start gap-2" size="sm">
                    <Key className="h-4 w-4" aria-hidden="true" />
                    Reset Password
                  </Button>
                  <Button variant="neutral" className="w-full justify-start gap-2" size="sm">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Revoke Sessions
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <Button variant="neutral" onClick={() => setSelectedMember(null)}>Close</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        size="md"
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="label">Email Address</label>
            <Input type="email" placeholder="colleague@company.com" required />
          </div>
          <div className="space-y-2">
            <label className="label">Full Name</label>
            <Input placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <label className="label">Role</label>
            <select className="input w-full">
              <option value="interviewer">Interviewer</option>
              <option value="hr">HR / Recruiter</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="label">Message (Optional)</label>
            <textarea className="input w-full min-h-[80px] resize-y" placeholder="Welcome to the team! You'll have access to..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" type="button" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}