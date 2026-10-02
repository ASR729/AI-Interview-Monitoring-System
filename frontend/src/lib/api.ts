// API configuration and client for the frontend
// Supports future integration with backend at http://localhost:3001

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

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${path}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      console.error(`API request failed: ${path}`, error)
      throw error
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

  // Future API endpoints (to be implemented in later phases)
  // auth: login, logout, register
  // interviews: create, list, get, update, delete
  // users: create, list, get, update, delete
  // reports: generate, list, get
  // monitoring: events, alerts, evidence
}

export const apiClient = new ApiClient()

// Export for use in components
export default apiClient
