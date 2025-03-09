<script setup lang="ts">
import OrganizerSubNav from '~/components/organizer/OrganizerSubNav.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const competitions = useCompetitions()

const completedCompetitions = computed(() => {
  return competitions.organizerCompetitions.filter(comp => comp.status === 'COMPLETED')
})
</script>

<template>
  <div>
    <OrganizerSubNav />
    
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">Competition Results</h1>
          <p class="text-gray-500 mt-2">View and manage your competition results</p>
        </div>
      </div>

      <!-- Results List -->
      <div class="space-y-6">
        <div v-if="completedCompetitions.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900">No completed competitions yet</h3>
            <p class="text-gray-500">Results will appear here once competitions are completed</p>
          </div>
        </div>

        <div v-else class="grid gap-6">
          <Card v-for="comp in completedCompetitions" :key="comp.id">
            <CardHeader>
              <CardTitle>{{ comp.name }}</CardTitle>
              <CardDescription>{{ new Date(comp.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Location</span>
                  <span>{{ comp.location }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">Total Participants</span>
                  <span>{{ comp.registrations?.length || 0 }}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" @click="navigateTo(`/competitions/${comp.id}/results`)">
                View Results
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template> 