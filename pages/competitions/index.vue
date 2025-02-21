<script setup lang="ts">
import { DanceStyle } from '~/types/competition'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const router = useRouter()
const competitions = useCompetitions()

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

// Update the click handler to prevent event bubbling
function handleCompetitionClick(id: string, event: Event) {
  // Prevent the click if it's from the button
  if ((event.target as HTMLElement).closest('button')) {
    return
  }
  router.push(`/competitions/${id}`)
}

// Separate handler for the button
function handleViewDetails(id: string) {
  router.push(`/competitions/${id}`)
}

// Add computed properties for competition status
function getCompetitionStatus(comp: Competition) {
  if (new Date() > new Date(comp.registrationDeadline)) {
    return { text: 'Registration Closed', color: 'text-gray-500' }
  }
  if (comp.maxDancers > 0 && (comp.registrations?.length || 0) >= comp.maxDancers) {
    return { text: 'Sold Out', color: 'text-destructive' }
  }
  return { text: 'Open for Registration', color: 'text-green-600' }
}

// Add a computed property for default banner
const defaultBanner = 'https://placehold.co/600x600/png?text=Dance+Competition'

function getBannerUrl(competition: Competition) {
  return competition.banner || defaultBanner
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = defaultBanner
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Available Competitions</h1>
    </div>

    <div v-if="competitions.loading" class="text-center py-8">
      Loading...
    </div>
    
    <Alert v-else-if="competitions.error" variant="destructive">
      {{ competitions.error }}
    </Alert>

    <template v-else>
      <div class="space-y-6">
        <div v-if="competitions.competitions.length === 0" class="text-center py-8 text-gray-500">
          No competitions available at the moment.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CompetitionCard 
            v-for="comp in competitions.competitions" 
            :key="comp.id"
            :competition="comp"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.aspect-square {
  position: relative;
  padding-top: 100%; /* Creates a 1:1 aspect ratio */
}

.aspect-square img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 