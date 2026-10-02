import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'hr' | 'interviewer' | 'interviewee'
  avatar?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  organizationId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: User['role']) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: User['role']
  organizationName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USERS: Record<string, User> = {
  'hr@demo.com': {
    id: '1',
    name: 'Sarah Chen',
    email: 'hr@demo.com',
    role: 'hr',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'online',
    organizationId: 'org-1',
  },
  'interviewer@demo.com': {
    id: '2',
    name: 'Michael Torres',
    email: 'interviewer@demo.com',
    role: 'interviewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'online',
    organizationId: 'org-1',
  },
  'candidate@demo.com': {
    id: '3',
    name: 'Alex Rivera',
    email: 'candidate@demo.com',
    role: 'interviewee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    status: 'online',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, _password: string, role: User['role']) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockUser = MOCK_USERS[email]
    if (mockUser && mockUser.role === role) {
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      setIsLoading(false)
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      status: 'online',
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      status: 'online',
      organizationId: data.organizationName ? `org-${crypto.randomUUID()}` : undefined,
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}