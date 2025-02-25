<script setup lang="ts">
const route = useRoute()

const organizerMenuItems = [
  { id: 1, name: 'Overview', href: '/dashboard/organizer' },
  { id: 2, name: 'Results', href: '/dashboard/organizer/results' },
  { id: 3, name: 'Settings', href: '/dashboard/organizer/settings' },
  { id: 4, name: 'Judges', href: '/dashboard/organizer/judges' },
  { id: 5, name: 'Dancers', href: '/dashboard/organizer/dancers' }
]
</script>

<template>
  <nav class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex h-12">
        <div class="flex space-x-8">
          <NuxtLink 
            v-for="item in organizerMenuItems" 
            :key="item.id"
            :to="item.href"
            class="inline-flex items-center px-1 pt-1 text-sm font-medium"
            :class="[
              route.path === item.href
                ? 'border-b-2 border-primary text-gray-900'
                : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template> 