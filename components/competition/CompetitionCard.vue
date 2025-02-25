<script setup lang="ts">
import { DanceStyle } from '~/types/competition'

const props = defineProps<{
  competition: Competition
  showManageButton?: boolean
}>()

const emit = defineEmits<{
  manage: [id: string]
}>()

const router = useRouter()
const auth = useAuth()

function handleViewDetails() {
  router.push(`/competitions/${props.competition.id}`)
}

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

// Get registration status text and color
function getCompetitionStatus(comp: Competition) {
  const deadline = new Date(comp.registrationDeadline.date)
  const [hours, minutes] = comp.registrationDeadline.time.split(':')
  deadline.setHours(parseInt(hours), parseInt(minutes))
  
  if (new Date() > deadline) {
    return { text: 'Registration Closed', color: 'text-destructive' }
  }
  if (comp.maxDancers > 0 && (comp.registrations?.length || 0) >= comp.maxDancers) {
    return { text: 'Competition Full', color: 'text-destructive' }
  }
  return { text: 'Open for Registration', color: 'text-green-600' }
}
</script>

<template>
  <Card class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
    <!-- Banner Image -->
    <div class="relative aspect-video">
      <img
        :src="competition.banner || 'https://placehold.co/600x400/png?text=Dance+Competition'"
        :alt="competition.name"
        class="w-full h-full object-cover rounded-t-lg"
        loading="lazy"
      />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col gap-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">
        {{ competition.name }}
      </h3>
      <!-- Status Badge -->
      <div 
        :class="getCompetitionStatus(competition).color"
        class="text-sm font-medium"
      >
        {{ getCompetitionStatus(competition).text }}
      </div>
      <p class="text-sm text-muted-foreground">
        {{ new Date(competition.date).toLocaleDateString() }}
      </p>
      <p class="text-sm mt-1">
        Organized by: <span class="font-medium">{{ auth.getUserById(competition.organizerId)?.name || 'Unknown' }}</span>
      </p>
    </div>

    <!-- Content Section -->
    <div class="p-6 pt-0">
      <p class="text-sm text-gray-500">Location: {{ competition.location }}</p>
      <p class="text-sm text-gray-500">Dance Style: {{ formatDanceStyle(competition.danceStyle) }}</p>
      <p class="text-sm text-gray-500">Entry Fee: €{{ competition.entryFee }}</p>
      <p class="text-sm text-gray-500">
        Max Dancers: {{ competition.maxDancers === 0 ? 'Unlimited' : competition.maxDancers }}
      </p>
    </div>

    <!-- Button Section -->
    <div class="flex items-center p-6 pt-0">
      <Button 
        v-if="showManageButton"
        variant="outline" 
        class="w-full"
        @click="emit('manage', competition.id)"
      >
        Manage
      </Button>
      <Button 
        v-else
        variant="outline" 
        class="w-full"
        @click="handleViewDetails"
      >
        View Details
      </Button>
    </div>
  </Card>
</template> 