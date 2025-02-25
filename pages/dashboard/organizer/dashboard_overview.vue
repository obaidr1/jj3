<script setup lang="ts">
import { DanceStyle } from '~/types/competition'
import OrganizerSubNav from '~/components/organizer/OrganizerSubNav.vue'

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

function handleManage(id: string) {
  navigateTo(`/competitions/${id}/manage`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <OrganizerSubNav />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold">Organizer Dashboard</h1>
          <p class="text-gray-500">Manage your dance competitions</p>
        </div>
        <NuxtLink to="/competitions/create">
          <Button variant="default">Create Competition</Button>
        </NuxtLink>
      </div>

      <!-- Stats Overview with improved card design -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card class="bg-white shadow-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg font-medium text-gray-700">Total Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-4xl font-bold text-primary">{{ organizerCompetitions.length }}</p>
          </CardContent>
        </Card>
        
        <Card class="bg-white shadow-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg font-medium text-gray-700">Active Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-4xl font-bold text-primary">
              {{ organizerCompetitions.reduce((acc, comp) => acc + (comp.registrations?.length || 0), 0) }}
            </p>
          </CardContent>
        </Card>
        
        <Card class="bg-white shadow-sm">
          <CardHeader class="pb-3">
            <CardTitle class="text-lg font-medium text-gray-700">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-4xl font-bold text-primary">
              {{ organizerCompetitions.filter(comp => new Date(comp.date) > new Date()).length }}
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Competitions List with improved spacing -->
      <div class="space-y-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold tracking-tight">Your Competitions</h2>
        </div>
        
        <div v-if="organizerCompetitions.length === 0" 
          class="text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-100"
        >
          <div class="space-y-4">
            <h3 class="text-xl font-medium text-gray-900">No competitions yet</h3>
            <p class="text-gray-500 max-w-md mx-auto">
              Get started by creating your first competition to begin managing dance events
            </p>
            <NuxtLink to="/competitions/create" class="inline-block mt-4">
              <Button variant="outline" size="lg">
                Create Competition
              </Button>
            </NuxtLink>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CompetitionCard 
            v-for="comp in organizerCompetitions" 
            :key="comp.id"
            :competition="comp"
            :show-manage-button="true"
            @manage="handleManage"
            class="bg-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style> 