<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
})

const competitions = useCompetitions()
const router = useRouter()

onMounted(() => {
  if (competitions.competitions.length === 0) {
    competitions.initializeFromStorage()
  }
})

const organizerCompetitions = computed(() => {
  return competitions.organizerCompetitions
})

const upcomingCompetitions = computed(() => {
  return organizerCompetitions.value.filter(comp => 
    new Date(comp.date) > new Date()
  )
})

const pastCompetitions = computed(() => {
  return organizerCompetitions.value.filter(comp => 
    new Date(comp.date) <= new Date()
  )
})

function handleCreateCompetition() {
  router.push('/competitions/create')
}

function handleManageCompetition(id: string) {
  router.push(`/competitions/${id}/manage`)
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Competitions</h1>
        <p class="text-muted-foreground">Manage your dance competitions</p>
      </div>
      <Button @click="handleCreateCompetition">
        Create Competition
      </Button>
    </div>

    <div v-if="competitions.loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
    </div>
    
    <div v-else-if="organizerCompetitions.length === 0" class="text-center py-12 bg-muted rounded-lg border">
      <div class="space-y-3">
        <h3 class="text-lg font-medium">No competitions yet</h3>
        <p class="text-muted-foreground">Get started by creating your first competition</p>
        <Button variant="outline" @click="handleCreateCompetition">
          Create Competition
        </Button>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div v-if="upcomingCompetitions.length > 0" class="space-y-4">
        <h2 class="text-xl font-semibold">Upcoming Competitions</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in upcomingCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><span class="font-medium">Location:</span> {{ competition.location }}</p>
                <p><span class="font-medium">Registrations:</span> {{ competition.registrations?.length || 0 }}</p>
                <p><span class="font-medium">Status:</span> {{ competition.status }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="w-full" @click="handleManageCompetition(competition.id)">
                Manage
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div v-if="pastCompetitions.length > 0" class="space-y-4">
        <h2 class="text-xl font-semibold">Past Competitions</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in pastCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><span class="font-medium">Location:</span> {{ competition.location }}</p>
                <p><span class="font-medium">Final Participants:</span> {{ competition.registrations?.length || 0 }}</p>
                <p><span class="font-medium">Status:</span> {{ competition.status }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="w-full" @click="handleManageCompetition(competition.id)">
                View Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template> 