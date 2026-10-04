import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { apiClient, ApiError, CandidateProfileSummary } from '@/lib/api'

export function HRCandidatesPage() {
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState<CandidateProfileSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    apiClient
      .listCandidates()
      .then((response) => {
        if (!cancelled) setCandidates(response.candidates)
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiError ? error.message : 'Failed to load candidates')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredCandidates = useMemo(() => {
    if (!searchQuery) return candidates
    const query = searchQuery.toLowerCase()
    return candidates.filter(
      (c) =>
        (c.name ?? '').toLowerCase().includes(query) ||
        (c.email ?? '').toLowerCase().includes(query)
    )
  }, [candidates, searchQuery])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Candidates</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Registered candidates available for interview association
        </p>
      </div>

      {loadError && (
        <Card className="border-danger-300 dark:border-danger-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-50">Could not load candidates</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">{loadError}</p>
            </div>
            <Button variant="neutral" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-4 sm:p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" aria-hidden="true" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search candidates"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-surface-200 dark:border-surface-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-surface-100 dark:bg-surface-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="py-14 px-4 text-center">
              <Calendar className="h-10 w-10 text-surface-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-surface-900 dark:text-surface-50 font-medium">
                {candidates.length === 0 ? 'No registered candidates yet' : 'No candidates match your search'}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {candidates.length === 0
                  ? 'Candidates appear here once they register with an interviewee account'
                  : 'Try a different name or email'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800 text-left text-surface-500 dark:text-surface-400">
                    <th scope="col" className="px-4 py-3 font-medium">Candidate</th>
                    <th scope="col" className="px-4 py-3 font-medium">Email</th>
                    <th scope="col" className="px-4 py-3 font-medium">Account Status</th>
                    <th scope="col" className="px-4 py-3 font-medium">Registered</th>
                    <th scope="col" className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-surface-900 dark:text-surface-50">
                        {candidate.name ?? 'Candidate'}
                      </td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                        {candidate.email ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="neutral"
                          className={
                            candidate.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300'
                          }
                        >
                          {candidate.status ?? 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                        {candidate.created_at
                          ? new Date(candidate.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="neutral"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            navigate('/hr/interviews/new', { state: { candidateId: candidate.id } })
                          }
                        >
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          Create Interview
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
