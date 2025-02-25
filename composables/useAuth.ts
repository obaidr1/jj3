import { defineStore } from 'pinia'
import type { User } from '../types/user'
import { jwtDecode } from 'jwt-decode'
import { navigateTo } from 'nuxt/app'
import type { AuthResponse } from '../types/auth'
import { UserRole } from '../types/user'

interface AuthError {
  message: string
  code?: string
}

interface AuthState {
  user: User | null
  users: User[]
  token: string | null
  refreshToken: string | null
  loading: boolean
  error: AuthError | null
  isAuthenticated: boolean
}

// Initial test user - keep this consistent
const TEST_USER = {
  id: '1',
  email: 'test@example.com',
  password: 'test123',
  name: 'Test User',
  role: UserRole.ORGANIZER
}

// Initial test user
const DEFAULT_USERS = [{
  id: '1',
  email: 'test@example.com',
  password: 'test123',
  name: 'Test User',
  role: UserRole.ORGANIZER
}]

export const useAuth = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    } | null,
    users: [] as Array<{
      id: string;
      email: string;
      password: string;
      name: string;
      role: UserRole;
    }>,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === UserRole.ADMIN,
    isJudge: (state) => state.user?.role === UserRole.JUDGE,
    isOrganizer: (state) => state.user?.role === UserRole.ORGANIZER,
    isDancer: (state) => state.user?.role === UserRole.DANCER
  },

  actions: {
    initializeFromStorage() {
      // Load users
      const storedUsers = localStorage.getItem('users')
      this.users = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS
      
      // Load current user
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true
      }
    },

    async login(email: string, password: string) {
      try {
        this.loading = true
        this.error = null

        const user = this.users.find(u => u.email === email && u.password === password)
        
        if (user) {
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
          
          this.user = userData
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(userData))
          
          return userData
        }
        
        throw new Error('Invalid credentials')
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        this.loading = true
        this.user = null
        this.isAuthenticated = false
        localStorage.removeItem('user')
        await navigateTo('/login')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.loading = false
      }
    },

    register(email: string, password: string, name: string, role: UserRole) {
      // Check if user already exists
      if (this.users.some(u => u.email === email)) {
        throw new Error('User with this email already exists')
      }

      // Create new user
      const newUser = {
        id: Math.random().toString(),
        email,
        password,
        name,
        role
      }

      // Add to users array
      this.users.push(newUser)
      
      // Save users to localStorage
      localStorage.setItem('users', JSON.stringify(this.users))

      // Log the user in
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
      
      this.user = userData
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))

      return userData
    },

    setError(error: AuthError | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    },

    async checkAuth() {
      const token = localStorage.getItem('token')
      if (!token) return false

      try {
        const response = await $fetch<AuthResponse>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.user = response.user
        this.token = response.token
        this.refreshToken = response.refreshToken
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        this.isAuthenticated = true
        return true
      } catch {
        this.logout()
        return false
      }
    },

    async refreshTokens() {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await $fetch<AuthResponse>('/api/auth/refresh', {
          method: 'POST',
          body: { refreshToken }
        })

        this.token = response.token
        this.refreshToken = response.refreshToken
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)

        return true
      } catch (error) {
        this.logout()
        return false
      }
    },

    isTokenExpired(token: string): boolean {
      try {
        const decoded = jwtDecode<{ exp: number }>(token)
        const currentTime = Date.now() / 1000
        return decoded.exp < currentTime
      } catch {
        return true
      }
    },

    async ensureValidToken() {
      if (!this.token) return false

      if (this.isTokenExpired(this.token)) {
        return await this.refreshTokens()
      }

      return true
    },

    getDashboardPath(role: UserRole): string {
      switch (role) {
        case UserRole.DANCER:
          return '/dashboard/dancer'
        case UserRole.JUDGE:
          return '/dashboard/judge'
        case UserRole.ORGANIZER:
          return '/dashboard/organizer'
        case UserRole.ADMIN:
          return '/dashboard/admin'
        default:
          return '/dashboard'
      }
    },

    getUserById(id: string) {
      return this.users.find(u => u.id === id)
    }
  }
}) 