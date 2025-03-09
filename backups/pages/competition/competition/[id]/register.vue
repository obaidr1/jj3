<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const competitions = useCompetitions()
const competition = computed(() => competitions.getCompetitionById(route.params.id as string))
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-8">Register for {{ competition?.name }}</h1>
    
    <RegistrationForm 
      v-if="competition" 
      :competition="competition" 
    />
  </div>
</template> 