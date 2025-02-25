<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

function getDashboardPath() {
  if (auth.isDancer) return '/dashboard/dancer'
  if (auth.isJudge) return '/dashboard/judge'
  if (auth.isOrganizer) return '/dashboard/organizer/dashboard_overview'
  return '/dashboard'
}

async function handleLogout() {
  try {
    await auth.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

function handleDashboardClick() {
  if (auth.isOrganizer) {
    router.push('/dashboard/organizer')
  }
  // ... other conditions ...
}
</script>

<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <NuxtLink to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold">Design Kit</span>
          </NuxtLink>
        </div>
        
        <div class="flex items-center space-x-4">
          <template v-if="auth.isAuthenticated">
            <NuxtLink 
              v-if="auth.isOrganizer"
              to="/dashboard/organizer/dashboard_overview"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Organizer Dashboard
            </NuxtLink>
            <NuxtLink 
              :to="getDashboardPath()"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </NuxtLink>
            <Button 
              variant="ghost" 
              @click="handleLogout"
              :disabled="auth.loading"
            >
              {{ auth.loading ? 'Logging out...' : 'Logout' }}
            </Button>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Register
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template> 