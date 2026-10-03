import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  BarChart2,
  PieChart,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share2,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable, TableColumn } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

const mockReports = [
  { id: 'RPT-001', title: 'Monthly Integrity Report', type: 'integrity', period: 'January 2024', generated: '2024-02-01', status: 'completed', interviews: 45, avgIntegrity: 92.3, alerts: 12, pages: 12, size: '2.4 MB' },
  { id: 'RPT-002', title: 'Candidate Pipeline Analysis', type: 'pipeline', period: 'Q1 2024', generated: '2024-01-15', status: 'completed', interviews: 120, avgIntegrity: 89.7, alerts: 28, pages: 18, size: '3.1 MB' },
  { id: 'RPT-003', title: 'Interviewer Performance Review', type: 'performance', period: 'January 2024', generated: '2024-02-05', status: 'completed', interviews: 45, avgIntegrity: 91.5, alerts: 8, pages: 8, size: '1.8 MB' },
  { id: 'RPT-004', title: 'Weekly Integrity Summary', type: 'integrity', period: 'Week 3, Jan 2024', generated: '2024-01-22', status: 'completed', interviews: 12, avgIntegrity: 93.1, alerts: 2, pages: 4, size: '856 KB' },
  { id: 'RPT-005', title: 'Bias Detection Audit', type: 'bias', period: 'Q4 2023', generated: '2024-01-10', status: 'completed', interviews: 200, avgIntegrity: 88.9, alerts: 45, pages: 22, size: '4.2 MB' },
  { id: 'RPT-006', title: 'Daily Integrity Snapshot', type: 'integrity', period: '2024-01-30', generated: '2024-01-30', status: 'processing', interviews: 5, avgIntegrity: 0, alerts: 0, pages: 0, size: '0 KB' },
  { id: 'RPT-007', title: 'Hiring Velocity Report', type: 'pipeline', period: 'January 2024', generated: '2024-02-03', status: 'completed', interviews: 45, avgIntegrity: 90.2, alerts: 15, pages: 10, size: '1.5 MB' },
  { id: 'RPT-008', title: 'Compliance & Ethics Review', type: 'compliance', period: 'Q1 2024', generated: '2024-02-07', status: 'scheduled', interviews: 0, avgIntegrity: 0, alerts: 0, pages: 0, size: '0 KB' },
]

const typeConfig = {
  integrity: { label: 'Integrity', icon: Shield, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  pipeline: { label: 'Pipeline', icon: BarChart2, color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  performance: { label: 'Performance', icon: TrendingUp, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  bias: { label: 'Bias Audit', icon: AlertTriangle, color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' },
  compliance: { label: 'Compliance', icon: CheckCircle, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
}

const statusConfig = {
  completed: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: CheckCircle },
  processing: { label: 'Generating', color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300', icon: Clock },
  scheduled: { label: 'Scheduled', color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300', icon: Calendar },
  failed: { label: 'Failed', color: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300', icon: AlertTriangle },
}

export function HRReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'generated' | 'title' | 'avgIntegrity'>('generated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports')

  const filteredReports = useMemo(() => {
    let result = [...mockReports]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query) ||
        r.period.toLowerCase().includes(query)
      )
    }

    if (typeFilter !== 'all') {
      result = result.filter(r => r.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }

    result.sort((a, b) => {
      let aVal: string | number = a[sortBy]
      let bVal: string | number = b[sortBy]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      return sortOrder === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1
    })

    return result
  }, [searchQuery, typeFilter, statusFilter, sortBy, sortOrder])

  const stats = useMemo(() => ({
    total: mockReports.length,
    completed: mockReports.filter(r => r.status === 'completed').length,
    processing: mockReports.filter(r => r.status === 'processing').length,
    scheduled: mockReports.filter(r => r.status === 'scheduled').length,
    totalInterviews: mockReports.reduce((sum, r) => sum + r.interviews, 0),
    avgIntegrity: mockReports.filter(r => r.avgIntegrity > 0).reduce((sum, r) => sum + r.avgIntegrity, 0) /
      Math.max(1, mockReports.filter(r => r.avgIntegrity > 0).length),
  }), [])

  const reportColumns: TableColumn<typeof mockReports[0]>[] = [
    { key: 'title', header: 'Report', render: (row) => {
      const type = typeConfig[row.type as keyof typeof typeConfig]
      const Icon = type?.icon || FileText
      return (
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', type?.color)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-surface-900 dark:text-surface-50">{row.title}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">{row.period}</p>
          </div>
        </div>
      )
    }},
    { key: 'type', header: 'Type', render: (row) => {
      const type = typeConfig[row.type as keyof typeof typeConfig]
      return (
        <Badge variant="neutral" className={type?.color}>
          {type?.label || row.type}
        </Badge>
      )
    }},
    { key: 'generated', header: 'Generated', render: (row) => (
      <div className="space-y-1">
        <p className="font-medium">{row.generated}</p>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          <Calendar className="h-3 w-3 inline mr-1" aria-hidden="true" />
          {row.period}
        </p>
      </div>
    )},
    { key: 'status', header: 'Status', render: (row) => {
      const config = statusConfig[row.status as keyof typeof statusConfig]
      const Icon = config?.icon || Clock
      return (
        <Badge variant="neutral" className={cn('gap-1', config?.color)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {config?.label || row.status}
        </Badge>
      )
    }},
    { key: 'interviews', header: 'Interviews', className: 'text-right' },
    { key: 'avgIntegrity', header: 'Avg Integrity', render: (row) => row.avgIntegrity > 0 ? (
      <div className="flex items-center gap-2">
        <Progress value={row.avgIntegrity} max={100} className="w-24 h-2" showLabel={false} />
        <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{row.avgIntegrity.toFixed(1)}%</span>
      </div>
    ) : (
      <Badge variant="neutral" className="bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400">—</Badge>
    )},
    { key: 'alerts', header: 'Alerts', className: 'text-right', render: (row) => row.alerts > 0 ? (
      <Badge variant="danger" className="gap-1">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        {row.alerts}
      </Badge>
    ) : (
      <Badge variant="success" className="gap-1">
        <CheckCircle className="h-3 w-3" aria-hidden="true" />
        Clean
      </Badge>
    )},
    { key: 'actions', header: 'Actions', render: (row) => (
      <Dropdown
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={row.status !== 'completed'}>
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
        align="right"
        items={[
          { label: 'View Report', value: 'view', icon: <Eye className="h-4 w-4" />, disabled: row.status !== 'completed' },
          { label: 'Download', value: 'download', icon: <Download className="h-4 w-4" />, disabled: row.status !== 'completed' },
          { label: 'Share', value: 'share', icon: <Share2 className="h-4 w-4" />, disabled: row.status !== 'completed' },
          { divider: true },
          { label: 'Regenerate', value: 'regenerate', icon: <Edit className="h-4 w-4" /> },
          { label: 'Delete', value: 'delete', danger: true, icon: <Trash2 className="h-4 w-4" /> },
        ]}
        onSelect={() => {}}
      />
    )},
  ]

  const templates = [
    { id: 'TPL-001', name: 'Monthly Integrity Report', description: 'Comprehensive integrity analysis with trends, alerts, and candidate breakdowns', type: 'integrity', frequency: 'Monthly', lastUsed: '2024-01-01', schedule: true },
    { id: 'TPL-002', name: 'Weekly Integrity Summary', description: 'Quick weekly snapshot of interview integrity metrics and notable alerts', type: 'integrity', frequency: 'Weekly', lastUsed: '2024-01-22', schedule: true },
    { id: 'TPL-003', name: 'Candidate Pipeline Analysis', description: 'Pipeline health, conversion rates, stage distribution, and source effectiveness', type: 'pipeline', frequency: 'Monthly', lastUsed: '2024-01-15', schedule: true },
    { id: 'TPL-004', name: 'Interviewer Performance Review', description: 'Individual interviewer metrics: completion rates, integrity scores, feedback quality', type: 'performance', frequency: 'Monthly', lastUsed: '2024-02-05', schedule: true },
    { id: 'TPL-005', name: 'Bias Detection Audit', description: 'Quarterly audit for demographic parity, false positive rates, and fairness metrics', type: 'bias', frequency: 'Quarterly', lastUsed: '2024-01-10', schedule: false },
    { id: 'TPL-006', name: 'Compliance & Ethics Review', description: 'Regulatory compliance check for interview monitoring practices and data handling', type: 'compliance', frequency: 'Quarterly', lastUsed: null, schedule: false },
    { id: 'TPL-007', name: 'Hiring Velocity Report', description: 'Time-to-hire, interview-to-offer ratios, and bottleneck identification', type: 'pipeline', frequency: 'Monthly', lastUsed: '2024-02-03', schedule: true },
    { id: 'TPL-008', name: 'Custom Report', description: 'Build a custom report with your selected metrics, filters, and visualizations', type: 'custom', frequency: 'On-demand', lastUsed: null, schedule: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Reports</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Generate, view, and manage interview integrity reports</p>
        </div>
        <Button className="gap-2" onClick={() => setShowGenerateModal(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Generate Report</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-4">
        <TabsList className="w-auto">
          <TabsTrigger value="reports">Generated Reports ({stats.completed})</TabsTrigger>
          <TabsTrigger value="templates">Report Templates ({templates.length})</TabsTrigger>
        </TabsList>

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Total Reports</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{stats.total}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Processing</p>
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.processing}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Scheduled</p>
                  <p className="text-2xl font-bold text-surface-500 dark:text-surface-400">{stats.scheduled}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Total Interviews</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{stats.totalInterviews}</p>
                </CardContent>
              </Card>
              <Card className="border-surface-200 dark:border-surface-800">
                <CardContent className="p-4">
                  <p className="text-sm text-surface-500 dark:text-surface-400">Avg Integrity</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.avgIntegrity.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
                    <Input
                      placeholder="Search reports..."
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
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="input w-40"
                    >
                      <option value="all">All Types</option>
                      <option value="integrity">Integrity</option>
                      <option value="pipeline">Pipeline</option>
                      <option value="performance">Performance</option>
                      <option value="bias">Bias Audit</option>
                      <option value="compliance">Compliance</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input w-36"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="processing">Processing</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-0">
                <DataTable
                  columns={reportColumns}
                  data={filteredReports}
                  striped
                  hoverable
                  emptyMessage="No reports found matching your criteria"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <Card className="border-surface-200 dark:border-surface-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
                    <Input placeholder="Search templates..." className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template, index) => {
                const type = typeConfig[template.type as keyof typeof typeConfig] || { icon: FileText, color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300', label: template.type }
                const Icon = type.icon || FileText
                return (
                  <Card key={index} className="border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn('p-3 rounded-xl', type.color)}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <Badge variant={template.schedule ? 'success' : 'neutral'} className="gap-1">
                          {template.schedule ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                          {template.schedule ? 'Scheduled' : 'On-demand'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">{template.name}</h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">{template.description}</p>
                      <div className="space-y-2 text-sm text-surface-500 dark:text-surface-400 mb-4">
                        <p className="flex items-center gap-2"><BarChart2 className="h-4 w-4" aria-hidden="true" />Type: {type.label}</p>
                        <p className="flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" />Frequency: {template.frequency}</p>
                        {template.lastUsed && (
                          <p className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />Last used: {template.lastUsed}</p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-surface-200 dark:border-surface-800">
                        <Button variant="primary" className="flex-1 gap-2" size="sm">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                          Generate
                        </Button>
                        <Button variant="neutral" className="flex-1 gap-2" size="sm">
                          <Edit className="h-4 w-4" aria-hidden="true" />
                          Customize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </Tabs>

      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport ? selectedReport.title : 'Report Details'}
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">{selectedReport.title}</h3>
                <p className="text-surface-600 dark:text-surface-400">{selectedReport.period}</p>
              </div>
              <Badge variant="neutral" className={cn('text-base px-3 py-1', statusConfig[selectedReport.status as keyof typeof statusConfig]?.color)}>
                {(() => {
                  const Icon = statusConfig[selectedReport.status as keyof typeof statusConfig]?.icon
                  return Icon ? <Icon className="h-3 w-3 mr-1" aria-hidden="true" /> : null
                })()}
                {statusConfig[selectedReport.status as keyof typeof statusConfig]?.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <p className="text-sm text-surface-500 dark:text-surface-400">Interviews</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{selectedReport.interviews}</p>
              </div>
              <div className="space-y-1 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <p className="text-sm text-surface-500 dark:text-surface-400">Avg Integrity</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selectedReport.avgIntegrity > 0 ? selectedReport.avgIntegrity.toFixed(1) + '%' : '—'}</p>
              </div>
              <div className="space-y-1 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <p className="text-sm text-surface-500 dark:text-surface-400">Alerts</p>
                <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{selectedReport.alerts}</p>
              </div>
              <div className="space-y-1 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <p className="text-sm text-surface-500 dark:text-surface-400">Size</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{selectedReport.size}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Report Details</h4>
                <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <p><span className="font-medium">Type:</span> {typeConfig[selectedReport.type as keyof typeof typeConfig]?.label || selectedReport.type}</p>
                  <p><span className="font-medium">Generated:</span> {selectedReport.generated}</p>
                  <p><span className="font-medium">Period:</span> {selectedReport.period}</p>
                  <p><span className="font-medium">Pages:</span> {selectedReport.pages}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-surface-900 dark:text-surface-50">Integrity Breakdown</h4>
                <div className="space-y-2">
                  {selectedReport.avgIntegrity > 0 && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-surface-600 dark:text-surface-400">90-100%</span>
                        <Progress value={Math.min(100, selectedReport.avgIntegrity + 5)} max={100} className="flex-1 h-2" showLabel={false} />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-surface-600 dark:text-surface-400">80-89%</span>
                        <Progress value={Math.max(0, 100 - selectedReport.avgIntegrity)} max={100} className="flex-1 h-2" showLabel={false} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
              <Button variant="neutral" onClick={() => setSelectedReport(null)}>Close</Button>
              {selectedReport.status === 'completed' && (
                <>
                  <Button variant="neutral" asChild>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <a href="#" download>Download PDF</a>
                  </Button>
                  <Button variant="neutral">
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate New Report"
        size="lg"
      >
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="label">Report Template</label>
            <select className="input w-full">
              <option value="">Select a template...</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">Date Range</label>
              <select className="input w-full">
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-quarter" selected>Last quarter</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label">Format</label>
              <select className="input w-full">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Include Sections</label>
            <div className="grid grid-cols-2 gap-3">
              {['Executive Summary', 'Integrity Score Distribution', 'Alert Analysis', 'Candidate Breakdown', 'Interviewer Performance', 'Trend Analysis', 'Recommendations', 'Appendix'].map((section, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox" defaultChecked={i < 5} />
                  <span className="text-sm text-surface-700 dark:text-surface-300">{section}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">Recipients (Email)</label>
            <Input placeholder="colleague@company.com, manager@company.com" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="scheduleReport" className="checkbox" />
            <label htmlFor="scheduleReport" className="text-sm text-surface-700 dark:text-surface-300">
              Schedule recurring generation
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="neutral" type="button" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
            <Button type="submit">Generate Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}