<script setup lang="ts">
import { ref, computed } from 'vue'
import { DanceStyle } from '~/types/competition'
import type { JudgeApplication } from '~/types/user'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const competitions = useCompetitions()

// State for filters
const selectedDanceStyle = ref<string>('all')
const selectedCountry = ref<string>('all')
const selectedStatus = ref<string>('all')

// Add state for application dialog
const showApplicationDialog = ref(false)
const selectedCompetitionId = ref<string>('')

// Get all competitions
const allCompetitions = computed(() => {
  return competitions.competitions
    .filter(comp => {
      const matchesDanceStyle = selectedDanceStyle.value === 'all' || comp.danceStyle === selectedDanceStyle.value
      const matchesCountry = selectedCountry.value === 'all' || comp.location.includes(selectedCountry.value)
      const matchesStatus = selectedStatus.value === 'all' || comp.status === selectedStatus.value
      return matchesDanceStyle && matchesCountry && matchesStatus
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// Get judge's applications
const judgeApplications = computed(() => {
  if (!auth.user) return []
  return competitions.competitions.flatMap(comp => 
    comp.judgeApplications?.filter(app => app.judgeId === auth.user?.id) || []
  )
})

// Get accepted competitions
const acceptedCompetitions = computed(() => {
  return competitions.competitions.filter(comp => 
    comp.judges?.includes(auth.user?.id || '')
  )
})

// Get unique dance styles for filter
const danceStyles = computed(() => {
  const styles = new Set(competitions.competitions.map(comp => comp.danceStyle))
  return Array.from(styles)
})

// Get unique countries for filter
const countries = computed(() => {
  const countrySet = new Set(competitions.competitions.map(comp => comp.location.split(',')[1]?.trim() || 'Unknown'))
  return Array.from(countrySet)
})

// Update handleApplyAsJudge function
function handleApplyAsJudge(competitionId: string) {
  selectedCompetitionId.value = competitionId
  showApplicationDialog.value = true
}

// Check if user has already applied
function hasApplied(competitionId: string): boolean {
  return judgeApplications.value.some(app => app.competitionId === competitionId)
}

// Get application status
function getApplicationStatus(competitionId: string): JudgeApplication['status'] | null {
  const application = judgeApplications.value.find(app => app.competitionId === competitionId)
  return application?.status || null
}

// Check if user is confirmed as judge
function isConfirmedJudge(competitionId: string): boolean {
  return acceptedCompetitions.value.some(comp => comp.id === competitionId)
}

onMounted(() => {
  competitions.fetchCompetitions()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Judge Dashboard</h1>
      <p class="text-gray-500 mt-2">Manage your judging assignments and applications</p>
    </div>

    <!-- Filters -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label for="danceStyle">Dance Style</Label>
            <Select v-model="selectedDanceStyle">
              <SelectTrigger id="danceStyle">
                <SelectValue placeholder="Select dance style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem v-for="style in danceStyles" :key="style" :value="style">
                  {{ style }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="country">Country</Label>
            <Select v-model="selectedCountry">
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="status">Status</Label>
            <Select v-model="selectedStatus">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tabs for different sections -->
    <Tabs defaultValue="all" class="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Competitions</TabsTrigger>
        <TabsTrigger value="applications">My Applications</TabsTrigger>
        <TabsTrigger value="accepted">Accepted Events</TabsTrigger>
      </TabsList>

      <!-- All Competitions Tab -->
      <TabsContent value="all" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in allCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Location:</strong> {{ competition.location }}</p>
                <p><strong>Dance Style:</strong> {{ competition.danceStyle }}</p>
                <p><strong>Status:</strong> {{ competition.status }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                v-if="isConfirmedJudge(competition.id)"
                class="w-full bg-green-600 hover:bg-green-700 text-white"
                variant="default"
                @click="navigateTo(`/competitions/${competition.id}/judge`)"
              >
                View Details
              </Button>
              <Button 
                v-else-if="!hasApplied(competition.id)"
                @click="handleApplyAsJudge(competition.id)"
                class="w-full"
              >
                Apply as Judge
              </Button>
              <div v-else class="w-full text-center">
                <Badge :variant="getApplicationStatus(competition.id) === 'pending' ? 'secondary' : 
                       getApplicationStatus(competition.id) === 'accepted' ? 'default' : 'destructive'">
                  {{ getApplicationStatus(competition.id)?.charAt(0).toUpperCase() + getApplicationStatus(competition.id)?.slice(1) }}
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Applications Tab -->
      <TabsContent value="applications" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="application in judgeApplications" :key="application.id">
            <CardHeader>
              <CardTitle>{{ competitions.getCompetitionById(application.competitionId)?.name }}</CardTitle>
              <CardDescription>{{ new Date(application.createdAt).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Status:</strong> {{ application.status }}</p>
                <p><strong>Experience:</strong> {{ application.experience }}</p>
                <p><strong>Specialties:</strong> {{ application.specialties.join(', ') }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge :variant="application.status === 'pending' ? 'secondary' : 
                     application.status === 'accepted' ? 'default' : 'destructive'">
                {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Accepted Events Tab -->
      <TabsContent value="accepted" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="competition in acceptedCompetitions" :key="competition.id">
            <CardHeader>
              <CardTitle>{{ competition.name }}</CardTitle>
              <CardDescription>{{ new Date(competition.date).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Location:</strong> {{ competition.location }}</p>
                <p><strong>Dance Style:</strong> {{ competition.danceStyle }}</p>
                <p><strong>Status:</strong> {{ competition.status }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                class="w-full bg-green-600 hover:bg-green-700 text-white"
                variant="default"
                @click="navigateTo(`/competitions/${competition.id}/judge`)"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <!-- Add JudgeApplicationDialog -->
    <JudgeApplicationDialog
      v-if="selectedCompetitionId"
      :competition-id="selectedCompetitionId"
      v-model:open="showApplicationDialog"
    />
  </div>
</template> 