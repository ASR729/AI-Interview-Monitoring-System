import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Award,
  Target,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Download,
  Building2,
  UserPlus,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableColumn } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'

const mockCandidates = [
  { id: 'CAN-001', name: 'Sarah Chen', email: 'sarah.chen@email.com', phone: '+1 (555) 123-4567', location: 'San Francisco, CA', role: 'Senior Frontend Engineer', stage: 'Offer Extended', matchScore: 96, source: 'LinkedIn', applied: '2024-01-10', experience: '8 years', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'CAN-002', name: 'Alex Rivera', email: 'alex.rivera@email.com', phone: '+1 (555) 234-5678', location: 'Austin, TX', role: 'Backend Developer', stage: 'Final Interview', matchScore: 92, source: 'Referral', applied: '2024-01-12', experience: '5 years', skills: ['Python', 'Django', 'PostgreSQL', 'AWS'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'CAN-003', name: 'Jordan Kim', email: 'jordan.kim@email.com', phone: '+1 (555) 345-6789', location: 'Seattle, WA', role: 'DevOps Engineer', stage: 'Technical Screen', matchScore: 89, source: 'Indeed', applied: '2024-01-14', experience: '4 years', skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: 'CAN-004', name: 'Taylor Morgan', email: 'taylor.morgan@email.com', phone: '+1 (555) 456-7890', location: 'New York, NY', role: 'Full Stack Developer', stage: 'Phone Screen', matchScore: 85, source: 'Company Website', applied: '2024-01-15', experience: '6 years', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
  { id: 'CAN-005', name: 'Casey Johnson', email: 'casey.j@email.com', phone: '+1 (555) 567-8901', location: 'Boston, MA', role: 'ML Engineer', stage: 'Applied', matchScore: 82, source: 'AngelList', applied: '2024-01-16', experience: '3 years', skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
  { id: 'CAN-006', name: 'Morgan Lee', email: 'morgan.lee@email.com', phone: '+1 (555) 678-9012', location: 'Chicago, IL', role: 'Security Engineer', stage: 'Phone Screen', matchScore: 78, source: 'LinkedIn', applied: '2024-01-17', experience: '7 years', skills: ['Penetration Testing', 'SIEM', 'Compliance', 'Incident Response'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan' },
  { id: 'CAN-007', name: 'Riley Park', email: 'riley.park@email.com', phone: '+1 (555) 789-0123', location: 'Denver, CO', role: 'Data Engineer', stage: 'Technical Screen', matchScore: 88, source: 'Referral', applied: '2024-01-18', experience: '5 years', skills: ['Spark', 'Kafka', 'Airflow', 'SQL'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley' },
  { id: 'CAN-008', name: 'Avery Brooks', email: 'avery.brooks@email.com', phone: '+1 (555) 890-1234', location: 'Remote', role: 'QA Engineer', stage: 'Applied', matchScore: 75, source: 'Indeed', applied: '2024-01-19', experience: '4 years', skills: ['Cypress', 'Playwright', 'Jest', 'Selenium'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery' },
  { id: 'CAN-009', name: 'Quinn Adams', email: 'quinn.adams@email.com', phone: '+1 (555) 901-2345', location: 'Los Angeles, CA', role: 'Mobile Developer', stage: 'Final Interview', matchScore: 91, source: 'Company Website', applied: '2024-01-20', experience: '6 years', skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn' },
  { id: 'CAN-010', name: 'Dakota Cruz', email: 'dakota.cruz@email.com', phone: '+1 (555) 012-3456', location: 'Miami, FL', role: 'Site Reliability Engineer', stage: 'Technical Screen', matchScore: 86, source: 'LinkedIn', applied: '2024-01-21', experience: '5 years', skills: ['Kubernetes', 'Prometheus', 'Grafana', 'Go'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota' },
]

const stageOrder = ['Applied', 'Phone Screen', 'Technical Screen', 'Final Interview', 'Offer Extended']
const stageConfig = {
  'Applied': { color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300' },
  'Phone Screen': { color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  'Technical Screen': { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  'Final Interview': { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  'Offer Extended': { color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' },
}

export function HRCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'matchScore' | 'applied' | 'name'>('matchScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCandidates = useMemo(() => {
    let result = [...mockCandidates]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query) ||
        c.skills.some(s => s.toLowerCase().includes(query))
      )
    }

    if (stageFilter !== 'all') {
      result = result.filter(c => c.stage === stageFilter)
    }

    if (sourceFilter !== 'all') {
      result = result.filter(c => c.source === sourceFilter)
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortBy]
      let bVal: string | number = b[sortBy]
      if (sortBy === 'matchScore') {
        aVal = a.matchScore
        bVal = b.matchScore
      }
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      return sortOrder === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1
    })

    return result
  }, [searchQuery, stageFilter, sourceFilter, sortBy, sortOrder])

  const stages = [...new Set(mockCandidates.map(c => c.stage))]
  const sources = [...new Set(mockCandidates.map(c => c.source))]

  const columns: TableColumn<typeof mockCandidates[0]>[] = [
    { key: 'name', header: 'Candidate', render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size="sm" src={row.avatar} />
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-50">{row.name}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'role', header: 'Role' },
    { key: 'stage', header: 'Stage', render: (row) => (
      <Badge variant="neutral" className={stageConfig[row.stage as keyof typeof stageConfig]?.color}>
        {row.stage}
      </Badge>
    )},
    { key: 'matchScore', header: 'Match', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="relative w-24 h-4">
          <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full transition-all"
              style={{ width: `${row.matchScore}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{row.matchScore}%</span>
      </div>
    )},
    { key: 'source', header: 'Source' },
    { key: 'experience', header: 'Experience' },
    { key: 'applied', header: 'Applied' },
    { key: 'actions', header: 'Actions', render: (row) => (
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        align="right"
        items={[
          { label: 'View Profile', value: 'view', icon: <Eye className="h-4 w-4" />, onSelect: () => setSelectedCandidate(row) },
          { label: 'Schedule Interview', value: 'schedule', icon: <Calendar className="h-4 w-4" /> },
          { label: 'Send Message', value: 'message', icon: <Mail className="h-4 w-4" /> },
          { label: 'Edit Candidate', value: 'edit', icon: <Edit className="h-4 w-4" /> },
          { divider: true },
          { label: 'Reject', value: 'reject', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Candidates</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Manage and track candidates through your hiring pipeline</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          <span>Add Candidate</span>
        </Button>
      </div>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="neutral" size="sm" className="gap-2" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <Filter className="h-4 w-4" aria-hidden="true" />
                <span>Sort: {sortBy}</span>
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="input w-40"
              >
                <option value="all">All Stages</option>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="input w-40"
              >
                <option value="all">All Sources</option>
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          <Table
            columns={columns}
            data={filteredCandidates}
            striped
            hoverable
            emptyMessage="No candidates found matching your criteria"
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate?.name || 'Candidate Details'}
        size="lg"
      >
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedCandidate.name} size="xl" src={selectedCandidate.avatar} />
              <div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">{selectedCandidate.name}</h3>
                <p className="text-surface-600 dark:text-surface-400">{selectedCandidate.role}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="neutral" className={stageConfig[selectedCandidate.stage as keyof typeof stageConfig]?.color}>
                    {selectedCandidate.stage}
                  </Badge>
                  <Badge variant="info">Match: {selectedCandidate.matchScore}%</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Contact</h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" aria-hidden="true" />{selectedCandidate.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" aria-hidden="true" />{selectedCandidate.phone}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{selectedCandidate.location}</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Details</h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <div><span className="font-medium">Source:</span> {selectedCandidate.source}</div>
                  <div><span className="font-medium">Experience:</span> {selectedCandidate.experience}</div>
                  <div><span className="font-medium">Applied:</span> {selectedCandidate.applied}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-surface-900 dark:text-surface-50">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCandidate.skills.map((skill, i) => (
                  <Badge key={i} variant="neutral">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <Button variant="neutral" onClick={() => setSelectedCandidate(null)}>Close</Button>
              <Button variant="primary" onClick={() => setSelectedCandidate(null)}>Schedule Interview</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Candidate"
        size="md"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" required />
            <Input label="Last Name" placeholder="Doe" required />
          </div>
          <Input label="Email" type="email" placeholder="john.doe@email.com" required />
          <Input label="Phone" placeholder="+1 (555) 123-4567" />
          <Input label="Current Role" placeholder="Senior Developer" />
          <Input label="Location" placeholder="San Francisco, CA" />
          <select className="input w-full" defaultValue="Applied">
            <option value="Applied">Applied</option>
            <option value="Phone Screen">Phone Screen</option>
            <option value="Technical Screen">Technical Screen</option>
            <option value="Final Interview">Final Interview</option>
            <option value="Offer Extended">Offer Extended</option>
          </select>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Candidate</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}