<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
})

const competitions = useCompetitions()

const completedCompetitions = computed(() => {
  return competitions.organizerCompetitions.filter(comp => comp.status === 'COMPLETED')
})

onMounted(() => {
  if (competitions.competitions.length === 0) {
    competitions.initializeFromStorage()
  }
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Competition Results</h1>
        <p class="text-muted-foreground">View and analyze your competition results</p>
      </div>
    </div>

    <div v-if="competitions.loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
    </div>

    <div v-else-if="completedCompetitions.length === 0" class="text-center py-12 bg-muted rounded-lg border">
      <div class="space-y-3">
        <h3 class="text-lg font-medium">No completed competitions</h3>
        <p class="text-muted-foreground">Results will appear here once competitions are completed</p>
      </div>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="competition in completedCompetitions" :key="competition.id">
        <CardHeader>
          <CardTitle>{{ competition.name }}</CardTitle>
          <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <p><span class="font-medium">Location:</span> {{ competition.location }}</p>
            <p><span class="font-medium">Participants:</span> {{ competition.registrations?.length || 0 }}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full" @click="navigateTo(`/competitions/${competition.id}/results`)">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template> 