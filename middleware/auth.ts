import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  // Skip middleware on server-side
  if (process.server) return

  // Initialize auth state if needed
  if (process.client) {
    auth.initializeFromStorage()
  }

  // Redirect from /dashboard to role-specific dashboard
  if (to.path === '/dashboard') {
    if (auth.isOrganizer) {
      return navigateTo('/dashboard/organizer/dashboard_overview')
    } else if (auth.isJudge) {
      return navigateTo('/dashboard/judge')
    } else if (auth.isDancer) {
      return navigateTo('/dashboard/dancer')
    }
  }

  // Public routes that don't require auth
  const publicRoutes = ['login', 'register']
  if (publicRoutes.includes(to.name as string)) {
    if (auth.isAuthenticated) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Check if user is authenticated
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // Allow access to competition registration for authenticated users
  if (to.path.includes('/competitions/') && to.path.includes('/register')) {
    return
  }

  // If authenticated trying to access login/register
  if (auth.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
    // Redirect to appropriate dashboard based on role
    if (auth.isOrganizer) {
      return navigateTo('/dashboard/organizer')
    } else if (auth.isJudge) {
      return navigateTo('/dashboard/judge')
    } else if (auth.isDancer) {
      return navigateTo('/dashboard/dancer')
    } else {
      return navigateTo('/dashboard')
    }
  }

  // If trying to access wrong role's dashboard
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