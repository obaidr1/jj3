import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  
  // Public routes
  if (to.path.startsWith('/auth/')) {
    if (auth.isAuthenticated) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Check authentication
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // Role-based route protection
  if (to.meta.requiredRole && auth.userRole !== to.meta.requiredRole) {
    return navigateTo('/dashboard')
  }
}) 