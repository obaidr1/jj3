export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth()
  
  // If user is authenticated and trying to access login/register pages
  if (auth.isAuthenticated) {
    return navigateTo('/dashboard')
  }
}) 