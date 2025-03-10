<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Competition } from '~/types/competition'
import type { User } from '~/types/user'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const competitions = useCompetitions()

// Get competition ID from route
const competitionId = computed(() => route.params.id as string)

// Get competition details
const competition = computed(() => {
  return competitions.getCompetitionById(competitionId.value)
})

// Get all judge applications
const judgeApplications = computed(() => {
  if (!competition.value?.judgeApplications) return []
  
  return competition.value.judgeApplications.map(application => {
    const judge = auth.getUserById(application.userId)
    return {
      ...application,
      judge
    }
  })
})

// Filter and sort options
const searchQuery = ref('')
const statusFilter = ref('all') // all, pending, accepted, rejected
const sortBy = ref('name') // name, applicationDate
const sortOrder = ref('asc') // asc, desc

// Filtered and sorted judges
const filteredJudges = computed(() => {
  let applications = [...judgeApplications.value]

  // Apply status filter
  if (statusFilter.value !== 'all') {
    applications = applications.filter(app => app.status === statusFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    applications = applications.filter(app => 
      app.judge?.name.toLowerCase().includes(query) ||
      app.judge?.email.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  applications.sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'name') {
      comparison = (a.judge?.name || '').localeCompare(b.judge?.name || '')
    } else if (sortBy.value === 'applicationDate') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return sortOrder.value === 'desc' ? -comparison : comparison
  })

  return applications
})

// Handle judge application status update
async function handleUpdateStatus(applicationId: string, newStatus: 'accepted' | 'rejected') {
  if (!competition.value) return
  
  try {
    await competitions.updateJudgeApplicationStatus(competition.value.id, applicationId, newStatus)
    await competitions.fetchCompetitions()
  } catch (error) {
    console.error('Failed to update judge application:', error)
  }
}

onMounted(() => {
  competitions.fetchCompetitions()
})
</script>

<template>
  <div v-if="competition" class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Manage Judges</h1>
      <p class="text-gray-500 mt-2">{{ competition.name }}</p>
    </div>

    <!-- Filters and Search -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label for="search">Search</Label>
            <Input 
              id="search"
              v-model="searchQuery"
              placeholder="Search by name or email"
            />
          </div>
          <div>
            <Label for="status">Status</Label>
            <Select v-model="statusFilter">
              <SelectTrigger id="status">
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="sortBy">Sort By</Label>
            <Select v-model="sortBy">
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="applicationDate">Application Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="sortOrder">Order</Label>
            <Select v-model="sortOrder">
              <SelectTrigger id="sortOrder">
                <SelectValue placeholder="Order..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Judges List -->
    <Card>
      <CardHeader>
        <CardTitle>Judge Applications ({{ filteredJudges.length }})</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="filteredJudges.length === 0" class="text-center py-8">
          <p class="text-gray-500">No judge applications found</p>
        </div>
        <div v-else class="space-y-4">
          <Card v-for="application in filteredJudges" :key="application.id">
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle>{{ application.judge?.name }}</CardTitle>
                  <CardDescription>{{ application.judge?.email }}</CardDescription>
                </div>
                <div class="flex gap-2">
                  <Button 
                    v-if="application.status === 'pending'"
                    variant="default"
                    size="sm"
                    class="bg-green-500 hover:bg-green-600"
                    @click="handleUpdateStatus(application.id, 'accepted')"
                  >
                    Accept
                  </Button>
                  <Button 
                    v-if="application.status === 'pending'"
                    variant="destructive"
                    size="sm"
                    @click="handleUpdateStatus(application.id, 'rejected')"
                  >
                    Reject
                  </Button>
                  <Badge 
                    v-else
                    :variant="application.status === 'accepted' ? 'default' : 'destructive'"
                  >
                    {{ application.status }}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold mb-1">Application Date</h4>
                  <p>{{ new Date(application.createdAt).toLocaleDateString() }}</p>
                </div>
                <div>
                  <h4 class="font-semibold mb-1">Experience</h4>
                  <p>{{ application.experience || 'Not specified' }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 