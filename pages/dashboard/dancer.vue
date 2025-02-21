<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const competitions = useCompetitions()

onMounted(() => {
  competitions.fetchCompetitions()
})

const upcomingCompetitions = computed(() => 
  competitions.competitions.filter(c => c.status === 'upcoming')
)

const pastCompetitions = computed(() => 
  competitions.competitions.filter(c => c.status === 'completed')
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

    <div v-if="competitions.loading" class="text-center py-8">
      Loading...
    </div>
    
    <Alert v-else-if="competitions.error" variant="destructive">
      {{ competitions.error }}
    </Alert>

    <template v-else>
      <div class="space-y-6">
        <h2 class="text-xl font-semibold">Available Competitions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="comp in upcomingCompetitions" :key="comp.id">
            <CardHeader>
              <CardTitle>{{ comp.name }}</CardTitle>
              <CardDescription>{{ new Date(comp.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-gray-500">Location: {{ comp.location }}</p>
              <p class="text-sm text-gray-500">Max Dancers: {{ comp.maxDancers }}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" @click="navigateTo(`/competitions/${comp.id}`)">
                Register Now
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
              <p class="text-sm text-gray-500">Location: {{ comp.location }}</p>
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