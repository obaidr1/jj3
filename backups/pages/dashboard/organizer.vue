<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next'
import { DanceStyle } from '~/types/competition'

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

// Add a function to check if user is organizer of this competition
function isCompetitionOrganizer(competitionOrganizerId: string) {
  return auth.user?.id === competitionOrganizerId
}

function handleManage(id: string) {
  console.log('Button clicked, ID:', id)
  // The path should be /competitions/[id]/manage, not /dashboard/competitions
  navigateTo(`/competitions/${id}/manage`)
}
</script>

<template>
  <div>
    <!-- Add the sub-navigation here, before the main content -->
    <OrganizerSubNav />
    
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

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-bold">{{ organizerCompetitions.length }}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-bold">
              {{ organizerCompetitions.reduce((acc, comp) => acc + (comp.registrations?.length || 0), 0) }}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-3xl font-bold">
              {{ organizerCompetitions.filter(comp => new Date(comp.date) > new Date()).length }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Competitions List -->
      <div class="space-y-6">
        <h2 class="text-2xl font-semibold">Your Competitions</h2>
        
        <div v-if="organizerCompetitions.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900">No competitions yet</h3>
            <p class="text-gray-500">Get started by creating your first competition</p>
            <NuxtLink to="/competitions/create">
              <Button variant="outline">
                Create Competition
              </Button>
            </NuxtLink>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            v-for="comp in organizerCompetitions" 
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
    </div>
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