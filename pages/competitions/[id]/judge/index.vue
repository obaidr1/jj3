<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const auth = useAuth()
const competitions = useCompetitions()

const competitionId = route.params.id as string

// Get competition details
const competition = computed(() => {
  return competitions.getCompetitionById(competitionId)
})

// Check if user is a judge for this competition
const isJudge = computed(() => {
  return competition.value?.judges?.includes(auth.user?.id || '')
})

// Redirect if not a judge
onMounted(() => {
  if (!isJudge.value) {
    navigateTo('/dashboard/judge')
  }
})

// Get current round details
const currentRound = computed(() => {
  if (!competition.value) return null
  return {
    number: competition.value.currentRound,
    total: competition.value.rounds,
    isFinal: competition.value.currentRound === competition.value.rounds
  }
})

// Get registered dancers for current round
const currentRoundDancers = computed(() => {
  if (!competition.value?.registrations) return []
  return competition.value.registrations.filter(reg => reg.status === 'confirmed')
})

// Handle scoring submission
async function handleSubmitScores(scores: Record<string, number>) {
  try {
    // TODO: Implement score submission logic
    console.log('Submitting scores:', scores)
  } catch (error) {
    console.error('Failed to submit scores:', error)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="competition" class="space-y-8">
      <!-- Competition Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-semibold">{{ competition.name }}</h1>
          <p class="text-gray-500 mt-2">{{ new Date(competition.date).toLocaleDateString() }}</p>
        </div>
        <Badge :variant="competition.status === 'ongoing' ? 'default' : 'secondary'">
          {{ competition.status.charAt(0).toUpperCase() + competition.status.slice(1) }}
        </Badge>
      </div>

      <!-- Competition Details -->
      <Card>
        <CardHeader>
          <CardTitle>Competition Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Location:</strong> {{ competition.location }}</p>
              <p><strong>Dance Style:</strong> {{ competition.danceStyle }}</p>
              <p><strong>Date:</strong> {{ new Date(competition.date).toLocaleDateString() }}</p>
            </div>
            <div>
              <p><strong>Current Round:</strong> {{ currentRound?.number }} of {{ currentRound?.total }}</p>
              <p><strong>Registered Dancers:</strong> {{ currentRoundDancers.length }}</p>
              <p><strong>Status:</strong> {{ competition.status }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Scoring Interface -->
      <Card v-if="currentRound">
        <CardHeader>
          <CardTitle>Round {{ currentRound.number }} Scoring</CardTitle>
          <CardDescription>
            {{ currentRound.isFinal ? 'Final Round' : 'Qualification Round' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <!-- Dancer List -->
            <div class="space-y-4">
              <h3 class="font-medium">Dancers to Score</h3>
              <div class="grid gap-4">
                <div v-for="dancer in currentRoundDancers" :key="dancer.id" class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p class="font-medium">{{ dancer.personalInfo.firstName }} {{ dancer.personalInfo.lastName }}</p>
                    <p class="text-sm text-gray-500">{{ dancer.role }}</p>
                  </div>
                  <div class="flex items-center space-x-4">
                    <Label for="score">Score</Label>
                    <Input 
                      id="score" 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.1"
                      class="w-20"
                      placeholder="0-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Scoring Criteria -->
            <div class="space-y-4">
              <h3 class="font-medium">Scoring Criteria</h3>
              <div class="grid gap-4">
                <div class="p-4 border rounded-lg">
                  <p class="font-medium">Technical Execution (40%)</p>
                  <p class="text-sm text-gray-500">Accuracy of steps, timing, and technique</p>
                </div>
                <div class="p-4 border rounded-lg">
                  <p class="font-medium">Musicality (30%)</p>
                  <p class="text-sm text-gray-500">Interpretation of music and rhythm</p>
                </div>
                <div class="p-4 border rounded-lg">
                  <p class="font-medium">Performance (30%)</p>
                  <p class="text-sm text-gray-500">Stage presence, energy, and audience engagement</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <Button @click="handleSubmitScores({})">
                Submit Scores
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-else class="flex justify-center items-center h-64">
      <p class="text-gray-500">Loading competition details...</p>
    </div>
  </div>
</template> 