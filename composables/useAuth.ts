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

// Initial test user
const TEST_USER: User = {
  id: '1',
  email: 'test@example.com',
  password: 'test123', // In real app, this would be hashed
  name: 'Test User',
  role: UserRole.DANCER,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    users: [TEST_USER], // Initialize with test user
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    isAuthenticated: false
  }),

  getters: {
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === UserRole.ADMIN,
    isJudge: (state) => state.user?.role === UserRole.JUDGE,
    isOrganizer: (state) => state.user?.role === UserRole.ORGANIZER,
    isDancer: (state) => state.user?.role === UserRole.DANCER
  },

  actions: {
    setError(error: AuthError | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    },

    async login(email: string, password: string) {
      this.loading = true
      this.clearError()
      
      try {
        // First check if user exists
        const user = this.users.find(u => u.email === email)
        if (!user) {
          throw new Error('No account found with this email')
        }

        // Then check password separately
        if (user.password !== password) {
          throw new Error('Invalid password')
        }

        // If both checks pass, proceed with login
        this.user = { ...user, password: undefined }
        this.isAuthenticated = true
        this.saveToStorage()
        return user
      } catch (error) {
        console.error('Login error:', error)
        throw error // Re-throw to handle in the component
      } finally {
        this.loading = false
      }
    },

    async register(email: string, password: string, name: string, role: UserRole, additionalInfo?: any) {
      this.loading = true
      this.clearError()
      
      try {
        // Validate email
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address')
        }

        // Check if user already exists - make sure to check case-insensitive
        const existingUser = this.users.find(u => 
          u.email.toLowerCase() === email.toLowerCase()
        )
        
        if (existingUser) {
          throw new Error('An account with this email already exists')
        }

        // Create new user
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          password,
          name,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...additionalInfo
        }
        
        // Add to users array
        this.users.push(newUser)
        
        // Set current user (without password)
        this.user = { ...newUser, password: undefined }
        this.isAuthenticated = true
        this.saveToStorage()

        return newUser
      } catch (error) {
        console.error('Registration error:', error)
        throw error // Re-throw to handle in the component
      } finally {
        this.loading = false
      }
    },

    saveToStorage() {
      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('users', JSON.stringify(this.users))
      }
    },

    initializeFromStorage() {
      const storedUser = localStorage.getItem('user')
      const storedUsers = localStorage.getItem('users')

      if (storedUsers) {
        this.users = JSON.parse(storedUsers)
      }

      if (storedUser) {
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true
      }

      // Ensure we always have at least the test user
      if (this.users.length === 0) {
        this.users = [TEST_USER]
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      return navigateTo('/login')
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
      return this.users.find(u => u.id === id) || null
    }
  }
}) 