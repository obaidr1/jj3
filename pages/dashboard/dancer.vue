<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const competitions = useCompetitions()

onMounted(async () => {
  await competitions.fetchDancerCompetitions()
})

const upcomingCompetitions = computed(() => 
  competitions.dancerCompetitions.filter(c => c.status === 'upcoming')
)

const pastCompetitions = computed(() => 
  competitions.dancerCompetitions.filter(c => c.status === 'completed')
)
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">My Competitions</h1>
      <Button @click="navigateTo('/competitions')">
        Find Competitions
      </Button>
    </div>

    <LoadingSpinner v-if="competitions.loading" />
    
    <Alert v-if="competitions.error" variant="destructive">
      {{ competitions.error }}
    </Alert>

    <template v-if="!competitions.loading && !competitions.error">
      <div class="space-y-6">
        <h2 class="text-xl font-semibold">Upcoming Competitions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="comp in upcomingCompetitions" :key="comp.id">
            <CardHeader>
              <CardTitle>{{ comp.name }}</CardTitle>
              <CardDescription>{{ new Date(comp.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Round: {{ comp.round }}</p>
              <p v-if="comp.partners?.length">
                Partners: {{ comp.partners.join(', ') }}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" @click="navigateTo(`/competitions/${comp.id}`)">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </div>

        <h2 class="text-xl font-semibold mt-8">Past Competitions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="comp in pastCompetitions" :key="comp.id">
            <CardHeader>
              <CardTitle>{{ comp.name }}</CardTitle>
              <CardDescription>{{ new Date(comp.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Final Placement: {{ comp.placement || 'N/A' }}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" @click="navigateTo(`/competitions/${comp.id}`)">
                View Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template> 