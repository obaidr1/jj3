<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const competitions = useCompetitions()

// Get competitions where the user is a judge
const judgeCompetitions = computed(() => {
  return competitions.competitions.filter(comp => 
    comp.judges?.includes(auth.user?.id || '')
  )
})

// Get competitions grouped by status
const upcomingCompetitions = computed(() => 
  judgeCompetitions.value.filter(comp => comp.status === 'upcoming')
)

const ongoingCompetitions = computed(() => 
  judgeCompetitions.value.filter(comp => comp.status === 'ongoing')
)

const completedCompetitions = computed(() => 
  judgeCompetitions.value.filter(comp => comp.status === 'completed')
)

onMounted(() => {
  competitions.fetchCompetitions()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold">Scoring Dashboard</h1>
      <p class="text-gray-500 mt-2">Manage your judging assignments and scoring responsibilities</p>
    </div>

    <!-- Tabs for different competition statuses -->
    <Tabs defaultValue="upcoming" class="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming ({{ upcomingCompetitions.length }})</TabsTrigger>
        <TabsTrigger value="ongoing">Ongoing ({{ ongoingCompetitions.length }})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({{ completedCompetitions.length }})</TabsTrigger>
      </TabsList>

      <!-- Upcoming Competitions -->
      <TabsContent value="upcoming" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in upcomingCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Location:</strong> {{ competition.location }}</p>
                <p><strong>Dance Style:</strong> {{ competition.danceStyle }}</p>
                <p><strong>Date:</strong> {{ new Date(competition.date).toLocaleDateString() }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button class="w-full" disabled>
                Not Started
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Ongoing Competitions -->
      <TabsContent value="ongoing" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in ongoingCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Location:</strong> {{ competition.location }}</p>
                <p><strong>Dance Style:</strong> {{ competition.danceStyle }}</p>
                <p><strong>Current Round:</strong> {{ competition.currentRound }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                class="w-full" 
                @click="navigateTo(`/dashboard/scoring/${competition.id}`)"
              >
                Score Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Completed Competitions -->
      <TabsContent value="completed" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in completedCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Location:</strong> {{ competition.location }}</p>
                <p><strong>Dance Style:</strong> {{ competition.danceStyle }}</p>
                <p><strong>Final Round:</strong> {{ competition.rounds }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                class="w-full" 
                variant="outline"
                @click="navigateTo(`/dashboard/scoring/${competition.id}/results`)"
              >
                View Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template> 