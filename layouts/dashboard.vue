<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const navigation = computed(() => {
  const items = [
    { name: 'Overview', href: '/dashboard', icon: 'i-heroicons-home' }
  ]

  if (auth.isOrganizer) {
    items.push(
      { name: 'Competitions', href: '/competitions', icon: 'i-heroicons-trophy' },
      { name: 'Judges', href: '/dashboard/judges', icon: 'i-heroicons-users' }
    )
  }

  if (auth.isJudge) {
    items.push(
      { name: 'Scoring', href: '/dashboard/scoring', icon: 'i-heroicons-star' }
    )
  }

  if (auth.isDancer) {
    items.push(
      { name: 'My Competitions', href: '/dashboard/my-competitions', icon: 'i-heroicons-calendar' },
      { name: 'Results', href: '/dashboard/results', icon: 'i-heroicons-chart-bar' }
    )
  }

  return items
})

async function handleLogout() {
  try {
    await auth.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/dashboard" class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold">Dashboard</span>
            </NuxtLink>
            
            <!-- Navigation Menu -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                :class="$route.path === item.href ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'"
              >
                <div :class="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">{{ auth.user?.name }}</span>
            <Button variant="ghost" @click="handleLogout">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template> 