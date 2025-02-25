<script setup lang="ts">
const auth = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <AppNavigation />
    
    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span class="block">Welcome to</span>
          <span class="block text-primary">Dance Competition Platform</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          The ultimate platform for organizing and participating in dance competitions.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <NuxtLink
              v-if="!auth.isAuthenticated"
              to="/login"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </NuxtLink>
            <NuxtLink
              v-else
              :to="auth.isOrganizer ? '/dashboard/organizer' : '/dashboard'"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
            >
              Go to Dashboard
            </NuxtLink>
          </div>
          <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <NuxtLink
              to="/competitions"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              View Competitions
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <!-- Feature 1 -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
              <div class="i-heroicons-trophy w-6 h-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">Organize Competitions</h3>
            <p class="mt-2 text-base text-gray-500">
              Create and manage dance competitions with ease
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
              <div class="i-heroicons-user-group w-6 h-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">Connect with Dancers</h3>
            <p class="mt-2 text-base text-gray-500">
              Build your network in the dance community
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
              <div class="i-heroicons-star w-6 h-6" />
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-900">Fair Judging</h3>
            <p class="mt-2 text-base text-gray-500">
              Transparent and professional evaluation system
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
