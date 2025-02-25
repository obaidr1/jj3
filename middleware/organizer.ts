export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth()

  // Skip middleware on server-side
  if (process.server) return

  // Initialize auth state if needed
  if (process.client) {
    auth.initializeFromStorage()
  }

  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (auth.user?.role !== 'ORGANIZER') {
    return navigateTo('/dashboard')
  }

  if (auth.isOrganizer) {
    // Update default redirect
    if (to.path === '/dashboard/organizer/dashboard_overview') {
      return navigateTo('/dashboard/organizer')
    }
  }
}) 