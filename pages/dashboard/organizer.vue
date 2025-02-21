<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const competitions = useCompetitions()

onMounted(async () => {
  await competitions.fetchOrganizerCompetitions()
})

const activeCompetitions = computed(() => 
  competitions.organizerCompetitions.filter(c => 
    ['registration_open', 'in_progress'].includes(c.status)
  )
)

const completedCompetitions = computed(() => 
  competitions.organizerCompetitions.filter(c => c.status === 'completed')
)
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">My Events</h1>
      <Button @click="navigateTo('/competitions/create')">
        Create Competition
      </Button>
    </div>

    <LoadingSpinner v-if="competitions.loading" />
    
    <Alert v-if="competitions.error" variant="destructive">
      {{ competitions.error }}
    </Alert>

    <template v-if="!competitions.loading && !competitions.error">
      <div class="space-y-6">
        <h2 class="text-xl font-semibold">Active Competitions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="comp in activeCompetitions" :key="comp.id">
            <CardHeader>
              <CardTitle>{{ comp.name }}</CardTitle>
              <CardDescription>{{ new Date(comp.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p>Status: {{ comp.status === 'registration_open' ? 'Registration Open' : 'In Progress' }}</p>
                <p>Registered Dancers: {{ comp.dancerCount }}</p>
                <p>Judges: {{ comp.judgeCount }}</p>
                <p v-if="comp.currentRound">Round: {{ comp.currentRound }}/{{ comp.totalRounds }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" @click="navigateTo(`/competitions/${comp.id}/manage`)">
                Manage
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template> 