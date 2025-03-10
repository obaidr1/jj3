<script setup lang="ts">
import type { JudgeApplication } from '~/types/user'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const auth = useAuth()
const competitions = useCompetitions()

// Get all judge applications for organizer's competitions
const judgeApplications = computed(() => {
  return competitions.organizerCompetitions.flatMap(comp => 
    comp.judgeApplications?.map(app => ({
      ...app,
      competitionName: comp.name,
      competitionDate: comp.date
    })) || []
  )
})

// Group applications by status
const pendingApplications = computed(() => 
  judgeApplications.value.filter(app => app.status === 'pending')
)

const acceptedApplications = computed(() => 
  judgeApplications.value.filter(app => app.status === 'accepted')
)

const rejectedApplications = computed(() => 
  judgeApplications.value.filter(app => app.status === 'rejected')
)

// Handle application status update
async function handleUpdateStatus(competitionId: string, applicationId: string, status: JudgeApplication['status']) {
  try {
    await competitions.updateJudgeApplicationStatus(competitionId, applicationId, status)
  } catch (error) {
    console.error('Failed to update application status:', error)
  }
}

onMounted(() => {
  competitions.fetchCompetitions()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold">Judge Applications</h1>
      <p class="text-gray-500 mt-2">Manage judge applications for your competitions</p>
    </div>

    <!-- Tabs for different application statuses -->
    <Tabs defaultValue="pending" class="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">Pending ({{ pendingApplications.length }})</TabsTrigger>
        <TabsTrigger value="accepted">Accepted ({{ acceptedApplications.length }})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({{ rejectedApplications.length }})</TabsTrigger>
      </TabsList>

      <!-- Pending Applications -->
      <TabsContent value="pending" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="application in pendingApplications" :key="application.id">
            <CardHeader>
              <CardTitle>{{ application.competitionName }}</CardTitle>
              <CardDescription>{{ new Date(application.competitionDate).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Judge:</strong> {{ auth.getUserById(application.judgeId)?.name }}</p>
                <p><strong>Experience:</strong> {{ application.experience }}</p>
                <p><strong>Specialties:</strong> {{ application.specialties.join(', ') }}</p>
                <p><strong>Bio:</strong> {{ application.bio }}</p>
              </div>
            </CardContent>
            <CardFooter class="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                @click="handleUpdateStatus(application.competitionId, application.id, 'rejected')"
              >
                Reject
              </Button>
              <Button 
                @click="handleUpdateStatus(application.competitionId, application.id, 'accepted')"
              >
                Accept
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Accepted Applications -->
      <TabsContent value="accepted" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="application in acceptedApplications" :key="application.id">
            <CardHeader>
              <CardTitle>{{ application.competitionName }}</CardTitle>
              <CardDescription>{{ new Date(application.competitionDate).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Judge:</strong> {{ auth.getUserById(application.judgeId)?.name }}</p>
                <p><strong>Experience:</strong> {{ application.experience }}</p>
                <p><strong>Specialties:</strong> {{ application.specialties.join(', ') }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="default">Accepted</Badge>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Rejected Applications -->
      <TabsContent value="rejected" class="space-y-4">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="application in rejectedApplications" :key="application.id">
            <CardHeader>
              <CardTitle>{{ application.competitionName }}</CardTitle>
              <CardDescription>{{ new Date(application.competitionDate).toLocaleDateString() }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <p><strong>Judge:</strong> {{ auth.getUserById(application.judgeId)?.name }}</p>
                <p><strong>Experience:</strong> {{ application.experience }}</p>
                <p><strong>Specialties:</strong> {{ application.specialties.join(', ') }}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="destructive">Rejected</Badge>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template> 