<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'organizer']
})

const competitions = useCompetitions()

onMounted(() => {
  if (competitions.competitions.length === 0) {
    competitions.initializeFromStorage()
  }
})

const judges = ref([
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    expertise: ['Salsa', 'Bachata'],
    assignedCompetitions: 3
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    expertise: ['Zouk', 'West Coast Swing'],
    assignedCompetitions: 2
  }
])

const isInviting = ref(false)

function handleInviteJudge() {
  isInviting.value = true
  // TODO: Implement judge invitation
  setTimeout(() => {
    isInviting.value = false
    const { $toast } = useNuxtApp()
    $toast.success('Invitation sent successfully')
  }, 1000)
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Judges</h1>
        <p class="text-muted-foreground">Manage your competition judges</p>
      </div>
      <Button @click="handleInviteJudge" :disabled="isInviting">
        <span v-if="isInviting">Sending Invite...</span>
        <span v-else>Invite Judge</span>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Active Judges</CardTitle>
        <CardDescription>Judges available for your competitions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <div v-for="judge in judges" :key="judge.id" class="flex items-center justify-between p-4 border rounded-lg">
            <div class="space-y-1">
              <h3 class="font-medium">{{ judge.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ judge.email }}</p>
              <div class="flex gap-2 mt-2">
                <Badge v-for="skill in judge.expertise" :key="skill" variant="secondary">
                  {{ skill }}
                </Badge>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-muted-foreground">Assigned to</p>
              <p class="font-medium">{{ judge.assignedCompetitions }} competitions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template> 