import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  // Initialize auth state consistently
  if (process.client) {
    await auth.initializeFromStorage()
  }

  // Handle public routes first
  const publicRoutes = ['login', 'register']
  if (publicRoutes.includes(to.name as string)) {
    if (auth.isAuthenticated) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Check authentication
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // Handle dashboard redirects
  if (to.path === '/dashboard') {
    const dashboardPath = auth.getDashboardPath()
    return navigateTo(dashboardPath)
  }

  // Role-based access control
  if (to.path.startsWith('/dashboard/organizer') && !auth.isOrganizer) {
    return navigateTo('/dashboard')
  }
  if (to.path.startsWith('/dashboard/judge') && !auth.isJudge) {
    return navigateTo('/dashboard')
  }
  if (to.path.startsWith('/dashboard/dancer') && !auth.isDancer) {
    return navigateTo('/dashboard')
  }

  return
}) 