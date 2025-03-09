<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const competitions = useCompetitions()

// Get user's registered competitions
const myCompetitions = computed(() => {
  return competitions.competitions.filter(comp => 
    comp.registrations?.some(reg => reg.userId === auth.user?.id)
  )
})

onMounted(() => {
  competitions.fetchCompetitions()
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-8">My Competitions</h1>

    <div v-if="competitions.loading" class="text-center py-8">
      Loading...
    </div>

    <div v-else-if="myCompetitions.length === 0" class="text-center text-gray-500 py-8">
      You haven't registered for any competitions yet.
      <NuxtLink to="/competitions" class="text-primary hover:underline block mt-2">
        Browse Available Competitions
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CompetitionCard 
        v-for="comp in myCompetitions" 
        :key="comp.id"
        :competition="comp"
      />
    </div>
  </div>
</template> 