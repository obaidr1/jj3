import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  // If not authenticated and not on login/register page
  if (!auth.isAuthenticated && !['login', 'register'].includes(to.name as string)) {
    return navigateTo('/login')
  }

  // If authenticated trying to access login/register
  if (auth.isAuthenticated && ['login', 'register'].includes(to.name as string)) {
    return navigateTo('/dashboard')
  }

  // If trying to access organizer routes without being an organizer
  if (to.path.includes('/competitions/') && !auth.isOrganizer) {
    return navigateTo('/dashboard')
  }

  return
}) 