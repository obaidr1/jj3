<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const auth = useAuth()
const competitions = useCompetitions()

onMounted(() => {
  // Redirect dancers to available competitions
  if (auth.isDancer) {
    router.push('/competitions')
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>
    
    <!-- Show different content based on user role -->
    <div v-if="auth.isOrganizer">
      <NuxtLink to="/dashboard/organizer">
        Go to Organizer Dashboard
      </NuxtLink>
    </div>
    
    <div v-else-if="auth.isJudge">
      <NuxtLink to="/dashboard/judge">
        Go to Judge Dashboard
      </NuxtLink>
    </div>
  </div>
</template> 