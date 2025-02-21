<script setup lang="ts">
const auth = useAuth()
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
        
        <div class="flex items-center">
          <template v-if="auth.isAuthenticated">
            <NuxtLink 
              to="/dashboard" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </NuxtLink>
            <Button variant="ghost" @click="auth.logout">
              Logout
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
  <NavigationMenuItem v-if="auth.isOrganizer">
    <NuxtLink to="/dashboard/organizer">
      Organizer Dashboard
    </NuxtLink>
  </NavigationMenuItem>
</template> 