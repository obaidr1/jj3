<script setup lang="ts">
const auth = useAuth()
</script>

<template>
  <nav class="space-y-2">
    <!-- Show different navigation based on role -->
    <template v-if="auth.isDancer">
      <NuxtLink 
        to="/competitions" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        Available Competitions
      </NuxtLink>
      <NuxtLink 
        to="/my-competitions" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        My Competitions
      </NuxtLink>
    </template>

    <template v-else-if="auth.isOrganizer">
      <NuxtLink 
        to="/dashboard/organizer" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        Organizer Dashboard
      </NuxtLink>
    </template>

    <template v-else-if="auth.isJudge">
      <NuxtLink 
        to="/dashboard/judge" 
        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        Judge Dashboard
      </NuxtLink>
    </template>
  </nav>
</template> 