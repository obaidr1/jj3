<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const auth = useAuth()
const router = useRouter()

// State Management
const isInitialized = ref(false)
const isLoading = ref(false)

// Computed properties for reactive state
const dashboardPath = computed(() => {
  if (!isInitialized.value) return '/'
  if (auth.isOrganizer) return '/dashboard/organizer'
  if (auth.isJudge) return '/dashboard/judge'
  if (auth.isDancer) return '/dashboard/dancer'
  return '/dashboard'
})

// Initialize auth state
onMounted(async () => {
  if (process.client) {
    try {
      await auth.initializeFromStorage()
    } finally {
      isInitialized.value = true
    }
  }
})

async function handleLogout() {
  try {
    isLoading.value = true
    await auth.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    isLoading.value = false
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
          <ClientOnly fallback-tag="span">
            <template v-if="isInitialized">
              <template v-if="auth.isAuthenticated">
                <NuxtLink 
                  v-if="auth.isOrganizer"
                  :to="dashboardPath"
                  class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Organizer Dashboard
                </NuxtLink>
                <NuxtLink 
                  :to="dashboardPath"
                  class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </NuxtLink>
                <Button 
                  variant="ghost" 
                  @click="handleLogout"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Logging out...' : 'Logout' }}
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
            </template>
            <template #fallback>
              <div class="animate-pulse flex space-x-4">
                <div class="h-8 w-20 bg-gray-200 rounded"></div>
                <div class="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </nav>
</template> 