// API configuration and client for the frontend
// Backend integration at http://localhost:3001 (pinned public URL via VITE_API_BASE_URL)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const API_PATH = '/api'

export const apiConfig = {
  baseURL: API_BASE_URL,
  apiPath: API_PATH,
  healthEndpoint: '/health',
}

export interface ApiResponse<T> {
  status: 'ok' | 'error'
  data?: T
  message?: string
  timestamp?: string
  statusCode?: number
}

// Carries the HTTP status and the server-provided (safe) message so
// authentication flows can distinguish 400/401/403/409 handling.
export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

export class ApiClient {
  private baseURL: string
  private authToken: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  setAuthToken(token: string | null) {
    this.authToken = token
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const body = await response.json().catch(() => null)

      if (!response.ok) {
        throw new ApiError(
          body?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status
        )
      }

      return body as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error(`API request failed: ${path}`, error)
      throw new ApiError('Unable to reach the server. Please try again.', 0)
    }
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' })
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' })
  }

  // Health check endpoint
  async health(): Promise<ApiResponse<{ status: string }>> {
    return this.get(`${apiConfig.healthEndpoint}`)
  }

  // Authentication (Phase 6)
  async register(data: {
    name: string
    email: string
    password: string
    role: string
    company?: string
  }): Promise<AuthResponse> {
    return this.post('/api/auth/register', data)
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.post('/api/auth/login', data)
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.post('/api/auth/logout')
  }

  async me(): Promise<MeResponse> {
    return this.get('/api/auth/me')
  }

  // HR interview management (Phase 7)
  async listCandidates(): Promise<CandidateListResponse> {
    return this.get('/api/candidates')
  }

  async createInterview(data: {
    title: string
    candidateId: string
    scheduledStartAt?: string | null
    interviewerId?: string | null
  }): Promise<InterviewResponse> {
    return this.post('/api/interviews', data)
  }

  async listInterviews(): Promise<InterviewListResponse> {
    return this.get('/api/interviews')
  }

  async getInterview(id: string): Promise<InterviewResponse> {
    return this.get(`/api/interviews/${encodeURIComponent(id)}`)
  }

  async updateInterview(
    id: string,
    data: { title?: string; scheduledStartAt?: string | null }
  ): Promise<InterviewResponse> {
    return this.patch(`/api/interviews/${encodeURIComponent(id)}`, data)
  }

  async inviteInterview(id: string): Promise<InterviewResponse> {
    return this.post(`/api/interviews/${encodeURIComponent(id)}/invite`)
  }

  // Interviewer assignment + Interviewer product (Phase 8)
  async listInterviewers(): Promise<InterviewerListResponse> {
    return this.get('/api/interviewers')
  }

  async assignInterview(id: string, interviewerId: string): Promise<InterviewResponse> {
    return this.post(`/api/interviews/${encodeURIComponent(id)}/assign`, { interviewerId })
  }

  async listAssignedInterviews(): Promise<AssignedInterviewListResponse> {
    return this.get('/api/interviewer/interviews')
  }

  async getAssignedInterview(id: string): Promise<AssignedInterviewResponse> {
    return this.get(`/api/interviewer/interviews/${encodeURIComponent(id)}`)
  }

  async getAssignedInterviewReport(id: string): Promise<InterviewReportResponse> {
    return this.get(`/api/interviewer/interviews/${encodeURIComponent(id)}/report`)
  }
}

export interface AuthUserShape {
  id: string
  name: string
  email: string
  role: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  status: 'ok'
  token: string
  user: AuthUserShape
}

export interface MeResponse {
  status: 'ok'
  user: AuthUserShape
}

export interface InterviewCandidateSummary {
  id: string
  name: string | null
  email: string | null
}

export interface InterviewInterviewerSummary {
  id: string
  name: string | null
}

export interface InterviewSession {
  id: string
  title: string
  status: string
  scheduled_start_at: string | null
  invite_reference: string | null
  candidate: InterviewCandidateSummary | null
  interviewer: InterviewInterviewerSummary | null
  created_at: string
  updated_at: string
}

export interface InterviewResponse {
  status: 'ok'
  interview: InterviewSession
}

export interface InterviewListResponse {
  status: 'ok'
  interviews: InterviewSession[]
}

export interface CandidateProfileSummary {
  id: string
  user_id: string
  name: string | null
  email: string | null
  status: string | null
  created_at: string
}

export interface CandidateListResponse {
  status: 'ok'
  candidates: CandidateProfileSummary[]
}

export interface InterviewerUserSummary {
  id: string
  name: string | null
  email: string | null
  status: string | null
  created_at: string
}

export interface InterviewerListResponse {
  status: 'ok'
  interviewers: InterviewerUserSummary[]
}

export interface AssignedInterview {
  id: string
  title: string
  status: string
  scheduled_start_at: string | null
  started_at: string | null
  ended_at: string | null
  candidate: InterviewInterviewerSummary | null
  created_at: string
  updated_at: string
}

export interface AssignedInterviewResponse {
  status: 'ok'
  interview: AssignedInterview
}

export interface AssignedInterviewListResponse {
  status: 'ok'
  interviews: AssignedInterview[]
}

export interface InterviewReport {
  id: string
  interview_id: string
  summary: string | null
  integrity_indicators: Record<string, unknown> | null
  generated_at: string | null
  created_at: string | null
}

export interface InterviewReportResponse {
  status: 'ok'
  report: InterviewReport
}

export const apiClient = new ApiClient()

// Export for use in components
export default apiClient
