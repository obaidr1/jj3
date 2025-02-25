<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const navigationItems = computed(() => [
  {
    name: 'Overview',
    href: '/dashboard/organizer',
    icon: 'i-heroicons-home'
  },
  {
    name: 'Competitions',
    href: '/dashboard/organizer/competitions',
    icon: 'i-heroicons-trophy'
  },
  {
    name: 'Dancers',
    href: '/dashboard/organizer/dancers',
    icon: 'i-heroicons-users'
  },
  {
    name: 'Judges',
    href: '/dashboard/organizer/judges',
    icon: 'i-heroicons-star'
  }
])

function getDashboardPath() {
  if (auth.isDancer) return '/dashboard/dancer'
  if (auth.isJudge) return '/dashboard/judge'
  if (auth.isOrganizer) return '/dashboard/organizer'
  return '/dashboard'
}

function handleNavigation(href: string) {
  router.push(href)
}
</script>

<template>
  <nav class="space-y-2">
    <button
      v-for="item in navigationItems"
      :key="item.name"
      class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      :class="{ 'bg-gray-100': $route.path === item.href }"
      @click="handleNavigation(item.href)"
    >
      <div :class="item.icon" class="w-5 h-5 mr-2" />
      {{ item.name }}
    </button>
  </nav>
</template> 