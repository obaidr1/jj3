export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth()
  
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  if (auth.user?.role !== 'ORGANIZER') {
    return navigateTo('/dashboard')
  }
}) 