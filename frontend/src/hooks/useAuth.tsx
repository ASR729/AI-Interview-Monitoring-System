import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export type ProductRole = 'hr' | 'interviewer' | 'interviewee'

interface User {
  id: string
  name: string
  email: string
  role: ProductRole | string
  avatar?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  organizationId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<User>
  updateProfile: (data: Partial<Pick<User, 'name' | 'avatar' | 'status'>>) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: ProductRole
  organizationName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// Role-aware entry (UX-AUTH-002): each authenticated role lands on its
// own dashboard. The backend-assigned role is the source of truth.
export function getRoleDashboardPath(role: string): string {
  if (role === 'hr') return '/hr/dashboard'
  if (role === 'interviewer') return '/interviewer/dashboard'
  if (role === 'interviewee') return '/interviewee/dashboard'
  return '/signin'
}

function persistSession(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  apiClient.setAuthToken(token)
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
  apiClient.setAuthToken(null)
}

function toContextUser(role: string, safeUser: { id: string; name: string; email: string }): User {
  return {
    id: safeUser.id,
    name: safeUser.name,
    email: safeUser.email,
    role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        setIsLoading(false)
        return
      }
      apiClient.setAuthToken(token)
      try {
        const response = await apiClient.me()
        setUser(toContextUser(response.user.role, response.user))
        localStorage.setItem(USER_KEY, JSON.stringify(toContextUser(response.user.role, response.user)))
      } catch {
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.login({ email, password })
    const contextUser = toContextUser(response.user.role, response.user)
    persistSession(contextUser, response.token)
    setUser(contextUser)
    return contextUser
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const response = await apiClient.register({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      ...(data.organizationName ? { company: data.organizationName } : {}),
    })
    const contextUser = toContextUser(response.user.role, response.user)
    persistSession(contextUser, response.token)
    setUser(contextUser)
    return contextUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.logout()
    } catch {
      // Stateless JWT: server holds no session state; proceed with
      // client-side credential removal regardless of API outcome.
    }
    clearSession()
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile: (data) => {
      setUser((prev) => {
        if (!prev) return prev
        const next = { ...prev, ...data }
        localStorage.setItem(USER_KEY, JSON.stringify(next))
        return next
      })
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
