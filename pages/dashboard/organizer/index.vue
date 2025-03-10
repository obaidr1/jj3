<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import { DanceStyle } from '../../../types/competition'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const competitions = useCompetitions()

// Get organizer's competitions
const organizerCompetitions = computed(() => {
  return competitions.organizerCompetitions
})

onMounted(() => {
  competitions.fetchCompetitions()
})

// Helper function to format dance style
function formatDanceStyle(style: string) {
  const danceStyles = {
    [DanceStyle.BACHATA]: 'Bachata',
    [DanceStyle.ZOUK]: 'Zouk',
    [DanceStyle.WESTCOAST_SWING]: 'West Coast Swing',
    [DanceStyle.SALSA]: 'Salsa',
    [DanceStyle.KIZOMBA]: 'Kizomba',
    [DanceStyle.OTHER]: 'Other'
  }
  return danceStyles[style as DanceStyle] || style
}

function handleManage(id: string) {
  navigateTo(`/competitions/${id}/manage`)
}
</script>

<template>
  <div>
    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <!-- Header Section -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">Organizer Dashboard</h1>
          <p class="text-gray-500 mt-2">Manage your dance competitions</p>
        </div>
        <NuxtLink to="/competitions/create">
          <Button>
            <PlusIcon class="w-5 h-5 mr-2" />
            Create Competition
          </Button>
        </NuxtLink>
      </div>

      <!-- Competitions List -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="competition in organizerCompetitions" :key="competition.id">
          <CardHeader>
            <CardTitle>{{ competition.name }}</CardTitle>
            <CardDescription>
              {{ formatDanceStyle(competition.danceStyle) }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <p><strong>Date:</strong> {{ new Date(competition.date).toLocaleDateString() }}</p>
              <p><strong>Location:</strong> {{ competition.location }}</p>
              <p><strong>Status:</strong> {{ competition.status }}</p>
              <p><strong>Registrations:</strong> {{ competition.registrations?.length || 0 }} / {{ competition.maxDancers || 'Unlimited' }}</p>
            </div>
          </CardContent>
          <CardFooter class="flex justify-end">
            <Button @click="handleManage(competition.id)">
              Manage
            </Button>
          </CardFooter>
        </Card>

        <!-- Empty State -->
        <div v-if="organizerCompetitions.length === 0" class="col-span-full text-center py-12">
          <h3 class="text-lg font-medium text-gray-900">No competitions yet</h3>
          <p class="mt-2 text-gray-500">Get started by creating your first competition</p>
          <div class="mt-6">
            <NuxtLink to="/competitions/create">
              <Button>
                <PlusIcon class="w-5 h-5 mr-2" />
                Create Competition
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 