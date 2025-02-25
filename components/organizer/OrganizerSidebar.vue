<script setup lang="ts">
const navigation = [
  { name: 'Overview', href: '/dashboard/organizer', icon: 'i-heroicons-home' },
  { name: 'Competitions', href: '/dashboard/organizer/competitions', icon: 'i-heroicons-trophy' },
  { name: 'Judges', href: '/dashboard/organizer/judges', icon: 'i-heroicons-users' },
  { name: 'Dancers', href: '/dashboard/organizer/dancers', icon: 'i-heroicons-user-group' },
  { name: 'Results', href: '/dashboard/organizer/results', icon: 'i-heroicons-chart-bar' },
  { name: 'Settings', href: '/dashboard/organizer/settings', icon: 'i-heroicons-cog' }
]

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <!-- Hamburger Menu Button -->
          <button 
            @click="toggleMenu"
            class="p-2 rounded-lg hover:bg-gray-100"
          >
            <div class="i-heroicons-bars-3 w-6 h-6" />
          </button>
          <h1 class="text-2xl font-bold">Organizer Dashboard</h1>
        </div>
        <slot name="actions" />
      </div>

      <!-- Dropdown Menu -->
      <div v-if="isMenuOpen" 
        class="absolute top-16 left-4 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <ul class="py-2">
          <li v-for="item in navigation" :key="item.href">
            <NuxtLink 
              :to="item.href"
              class="flex items-center px-4 py-2 text-gray-900 hover:bg-gray-100"
              :class="{ 'bg-gray-100': $route.path === item.href }"
              @click="isMenuOpen = false"
            >
              <div :class="[item.icon, 'w-5 h-5 mr-3']" />
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      
      <!-- Page Content -->
      <slot />
    </div>
  </div>
</template> 