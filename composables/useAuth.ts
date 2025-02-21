import { defineStore } from 'pinia'
import type { User } from '../types/user'
import { jwtDecode } from 'jwt-decode'
import { navigateTo } from 'nuxt/app'
import type { AuthResponse } from '../types/auth'
import { UserRole } from '../types/user'  // Remove 'type' from the import




interface AuthError {
  message: string
  code?: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  loading: boolean
  error: AuthError | null
}

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
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
        const response = await $fetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        
        this.setAuth(response.user, response.token, response.refreshToken)
        return true
      } catch (error: any) {
        this.setError({
          message: error.data?.message || 'Login failed',
          code: error.status
        })
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData: { 
      email: string, 
      password: string, 
      name: string, 
      role: UserRole 
    }) {
      this.loading = true
      try {
        const response = await $fetch<AuthResponse>('/api/auth/register', {
          method: 'POST',
          body: userData
        })
        
        this.setAuth(response.user, response.token, response.refreshToken)
        return true
      } catch (error) {
        throw new Error('Registration failed')
      } finally {
        this.loading = false
      }
    },

    setAuth(user: User, token: string, refreshToken: string) {
      this.user = user
      this.token = token
      this.refreshToken = refreshToken
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      navigateTo('/auth/login')
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
        this.setAuth(response.user, response.token, response.refreshToken)
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
    }
  }
}) 