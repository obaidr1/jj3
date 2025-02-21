<script setup lang="ts">
import { DanceStyle } from '~/types/competition'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
})

const auth = useAuth()
const competitions = useCompetitions()
const router = useRouter()

// Add role check
if (auth.user?.role !== 'ORGANIZER') {
  router.push('/dashboard')
}

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

// Add a function to check if user is organizer of this competition
function isCompetitionOrganizer(competitionOrganizerId: string) {
  return auth.user?.id === competitionOrganizerId
}

function handleManage(id: string) {
  console.log('Button clicked, ID:', id)
  // The path should be /competitions/[id]/manage, not /dashboard/competitions
  router.push(`/competitions/${id}/manage`)
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Organizer Dashboard</h1>
      <Button @click="navigateTo('/competitions/new')">
        Create Competition
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
        <h2 class="text-xl font-semibold">Your Competitions</h2>
        <div v-if="competitions.organizerCompetitions.length === 0" class="text-center py-8 text-gray-500">
          No competitions created yet. Click "Create Competition" to get started.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            v-for="comp in competitions.organizerCompetitions" 
            :key="comp.id"
            class="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <!-- Banner Image -->
            <img
              :src="comp.banner || 'https://placehold.co/600x400/png?text=Dance+Competition'"
              :alt="comp.name"
              class="w-full h-48 object-cover rounded-t-lg"
            />

            <!-- Title Section -->
            <div class="flex flex-col gap-y-1.5 p-6">
              <h3 class="text-2xl font-semibold leading-none tracking-tight">
                {{ comp.name }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ new Date(comp.date).toLocaleDateString() }}
              </p>
            </div>

            <!-- Content Section -->
            <div class="p-6 pt-0">
              <p class="text-sm text-gray-500">Location: {{ comp.location }}</p>
              <p class="text-sm text-gray-500">Dance Style: {{ formatDanceStyle(comp.danceStyle) }}</p>
              <p class="text-sm text-gray-500">Status: {{ comp.status }}</p>
              <p class="text-sm text-gray-500">Max Dancers: {{ comp.maxDancers === 0 ? 'Unlimited' : comp.maxDancers }}</p>
            </div>

            <!-- Button Section -->
            <div class="flex items-center p-6 pt-0">
              <Button 
                v-if="isCompetitionOrganizer(comp.organizerId)"
                variant="outline" 
                class="bg-gray-100 shadow-md hover:bg-destructive hover:text-destructive-foreground hover:shadow-lg transition-all"
                @click="handleManage(comp.id)"
              >
                Manage
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hover\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style> 